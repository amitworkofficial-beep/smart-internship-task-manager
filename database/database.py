
import sqlite3
import os
DATABASE = os.path.join(os.path.dirname(__file__), "internship.db")


def get_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'Pending',
            priority TEXT DEFAULT 'Medium',
            deadline TEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'Pending',
            priority TEXT DEFAULT 'Medium',
            deadline TEXT,
            FOREIGN KEY (project_id) REFERENCES projects(id)
        )
    """)

    connection.commit()
    connection.close()


def add_sample_project():
    connection = get_connection()

    connection.execute("""
        INSERT INTO projects
        (name, description, status, priority, deadline)
        VALUES (?, ?, ?, ?, ?)
    """, (
        "Internship Management System",
        "A platform to manage internship projects and tasks.",
        "In Progress",
        "High",
        "2026-10-30"
    ))

    connection.commit()
    connection.close()


if __name__ == "__main__":
    initialize_database()
    add_sample_project()
    print("Database initialized and sample project added!")

