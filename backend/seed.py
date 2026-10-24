from app import create_app
from db import get_db
from posts import now_iso

SAMPLES = [
    (
        "welcome to the blog",
        "Admin",
        "This blog is built with React and Flask.\n\nClick \"Write a post\" to add your own, or use Edit and Delete on any post to try the other CRUD operations.",
    ),
    (
        "What is API?",
        "Admin",
        "An API is a menu of requests a server understands.\n\nOur React page asks the Flask server for posts, and Flask replies with JSON data.",
    ),
    (
        "why Flask?",
        "Admin",
        "Flask is small. You add only need, which makes it a great way to see how a web server really works.",
    ),
]

app = create_app()
with app.app_context():
    db = get_db()
    if db.execute("SELECT COUNT(*) FROM post").fetchone()[0] == 0:
        for title, author, content in SAMPLES:
            stamp = now_iso()
            db.execute(
                "INSERT INTO post(title, author, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
                (title, author, content, stamp, stamp),
            )
        db.commit()
        print(f"Added {len(SAMPLES)} sample posts.")
    else:
        print("The blog already has posts; nothing added.")
