import sqlite3
import os
from flask import g, current_app

DATABASE = 'keyboard.db'


def get_db():
    if 'sqlite_db' not in g:
        g.sqlite_db = sqlite3.connect(DATABASE)
        g.sqlite_db.row_factory = sqlite3.Row
    return g.sqlite_db


def close_db(e=None):
    db = g.pop('sqlite_db', None)
    if db is not None:
        db.close()


def init_db():
    db = get_db()

    # Get the absolute path to schema.sql relative to this file
    current_dir = os.path.dirname(os.path.abspath(__file__))
    schema_path = os.path.join(current_dir, 'schema.sql')

    try:
        with open(schema_path, 'r') as f:
            db.executescript(f.read())
        db.commit()
        print("Database initialized successfully")
    except Exception as e:
        print(f"Error initializing database: {e}")
        raise


def get_sounds():
    db = get_db()
    cursor = db.execute(
        'SELECT id, filename, key_mapping, category FROM sounds ORDER BY id DESC'
    )
    return [dict(row) for row in cursor.fetchall()]