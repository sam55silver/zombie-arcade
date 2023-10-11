from flask import Flask, request, jsonify
import argparse
import psycopg2

app = Flask(__name__)
db_params = {}

def add_high_score(score, name):
    conn = psycopg2.connect(**db_params)
    cur = conn.cursor()
    cur.execute("INSERT INTO high_scores (score, name) VALUES (%s, %s);", (score, name))
    conn.commit()
    conn.close()

def get_top_scores(limit=10):
    conn = psycopg2.connect(**db_params)
    cur = conn.cursor()
    cur.execute("SELECT * FROM high_scores ORDER BY score DESC LIMIT %s;", (limit,))
    top_scores = cur.fetchall()
    print(top_scores)
    conn.close()
    return [{"name": entry[1], "score": entry[2]} for entry in top_scores]

@app.route('/leaderboard', methods=['GET', 'POST'])
def highscore():
    try:
        if request.method == 'GET':
            top_scores = get_top_scores()
            return jsonify({"scores": top_scores})

        if request.method == 'POST':
            data = request.get_json()
            entry_score = data["score"]
            entry_name = data["name"]
            add_high_score(entry_score, entry_name)
            return jsonify({"message": "High score updated"})
    except psycopg2.Error as e:
        return jsonify({"message": e}), 500

def create_high_scores_table():
    conn = psycopg2.connect(**db_params)
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS high_scores (
            id serial PRIMARY KEY,
            name varchar(255) not null,
            score integer not null
        );
    """)
    conn.commit()
    conn.close()
   
if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Run a Flask application as a daemon.")
    parser.add_argument('--host', type=str, default='0.0.0.0', help='Host for the Flask application (default: 0.0.0.0)')
    parser.add_argument('--port', type=int, default=8070, help='Port for the Flask application (default: 5000)')
    parser.add_argument('--db-database', type=str, default='leaderboard', help='Port for the Flask application (default: 5000)')
    parser.add_argument('--db-user', type=str, default='zombie', help='Port for the Flask application (default: 5000)')
    parser.add_argument('--db-password', type=str, default='arcade', help='Port for the Flask application (default: 5000)')
    parser.add_argument('--db-host', type=str, default='0.0.0.0', help='Port for the Flask application (default: 5000)')
    parser.add_argument('--db-port', type=int, default=5432, help='Port for the Flask application (default: 5000)')
    args = parser.parse_args()

    db_params = {
        'database': args.db_database,
        'user': args.db_user,
        'password': args.db_password,
        'host': args.db_host,
        'port': args.db_port,
    }

    try:
        create_high_scores_table()
        app.run(host=args.host, port=args.port)
    except psycopg2.Error as e:
        print(f"Error creating table: {e}")


