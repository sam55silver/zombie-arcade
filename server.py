from flask import Flask, request, jsonify
import argparse
import psycopg2

app = Flask(__name__)
db_params = {}

def add_high_score(score):
    try:
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()
        cur.execute("INSERT INTO high_scores (score) VALUES (%s);", (score,))
        conn.commit()
        conn.close()
    except psycopg2.Error as e:
        print(f"Error adding high score: {e}")


def get_top_scores(limit=10):
    try:
        conn = psycopg2.connect(**db_params)
        cur = conn.cursor()
        cur.execute("SELECT score FROM high_scores ORDER BY score DESC LIMIT %s;", (limit,))
        top_scores = cur.fetchall()
        conn.close()
        return [score[0] for score in top_scores]
    except psycopg2.Error as e:
        print(f"Error retrieving top scores: {e}")
        return []


@app.route('/highscore', methods=['GET', 'POST'])
def highscore():
    if request.method == 'GET':
        top_scores = get_top_scores()
        return jsonify({"top_scores": top_scores})

    if request.method == 'POST':
        data = request.get_json()
        new_high_score = data.get("score")
        add_high_score(new_high_score)
        return jsonify({"message": "High score updated"})


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Run a Flask application as a daemon.")
    parser.add_argument('--host', type=str, default='0.0.0.0', help='Host for the Flask application (default: 0.0.0.0)')
    parser.add_argument('--port', type=int, default=5000, help='Port for the Flask application (default: 5000)')
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

    app.run(host=args.host, port=args.port)

