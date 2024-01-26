from flask import Flask, request, jsonify, g
from flask_cors import CORS
import argparse
import sqlite3

app = Flask(__name__)
db_name = "./data/zombie-leaderboard.db"

def add_high_score(db, cur, score, name):
    cur.execute("INSERT INTO high_scores (score, name) VALUES (?, ?);", (score, name))
    db.commit()


def get_top_scores(cur, limit=10):
    cur.execute("SELECT * FROM high_scores ORDER BY score DESC LIMIT ?;", (limit,))
    top_scores = cur.fetchall()
    scores = [{"name": name, "score": score} for (_, name, score) in top_scores]
    
    return scores


@app.route('/leaderboard', methods=['GET', 'POST'])
def highscore():
    db = get_db()
    cur = db.cursor()

    try:
        if request.method == 'GET':
            top_scores = get_top_scores(cur)
            return jsonify({"scores": top_scores})

        if request.method == 'POST':
            data = request.get_json()
            entry_score = data["score"]
            entry_name = data["name"]

            if type(entry_score) != int:
                return jsonify({"message": "entry_score not int"}), 500

            if type(entry_name) != str:
                return jsonify({"message": "entry_name not str"}), 500

            if len(entry_name) > 6 or len(entry_name) < 1:
                return jsonify({"message": "entry_name needs to be 1-6 characters"}), 500

            add_high_score(db, cur, entry_score, entry_name)
            return jsonify({"message": "High score updated"})

    except sqlite3.Error as e:
        return jsonify({"message": e}), 500
    except KeyError as e:
        return jsonify({"message": e}), 500
    finally:
        cur.close()


def create_leaderboard():
    db = get_db()
    cur = db.cursor()
    
    try:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS high_scores (
                id serial PRIMARY KEY,
                name varchar(255) not null,
                score integer not null
            );
        """)
        db.commit()
    except sqlite3.Error as e:
        print("Error creating table:", e)
    finally:
        cur.close()


def get_db():
    db = getattr(g, "_db", None)
    if db is None:
        db = sqlite3.connect(db_name)
        g._db = db
    return db


@app.teardown_appcontext
def close_db(exception):
    db = getattr(g, '_db', None)
    if db is not None:
        db.close()

def create_app():
    with app.app_context():
        create_leaderboard()

    CORS(app)
    return app
    
   
if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Run a Flask application as a daemon.")
    parser.add_argument('--host', type=str, default='0.0.0.0', help='Host for the Flask application')
    parser.add_argument('--port', type=int, default=8070, help='Port for the Flask application')
    parser.add_argument('--db', type=str, default="zombie-leaderboard", help='Name of database file for leaderboard')
    parser.add_argument('--debug', action="store_true", help='Start flask in debug mode')
    args = parser.parse_args()

    db_name = args.db + ".db"

    main_app = create_app()
    main_app.run(host=args.host, port=args.port, debug=args.debug)


