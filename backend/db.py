import sqlite3
from flask import current_app, g

SCHEMA ="""
CREATE TABLE IF NOT EXISTS post(
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL,
  author      TEXT NOT NULL,
  content     TEXT NOT NULL,
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);
"""
def get_db():
  if "db" not in g:
    g.db = sqlite3.connect(current_app.config["DATABASE"])
    g.db.row_factory = sqlite3.Row
  return g.db

def close_db(error=None):
  db = g.pop("db", None)
  if db is not None:
    db.close()


def init_db():
  db = get_db()
  db.executescript(SCHEMA)
  db.commit()

def init_app(app):
  app.teardown_appcontext(close_db)
  with app.app_context():
    init_db()      