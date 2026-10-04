from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os

app = Flask(__name__)
CORS(app)

DATABASE = os.path.join(
    os.path.dirname(__file__),
    "..",
    "database",
    "internship.db"
)


def get_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


@app.route("/")
def home():
    return jsonify({
        "message": "Smart Internship & Task Management Platform API is running!"
    })


# ==================== AUTHENTICATION ====================

@app.route("/api/register", methods=["POST"])
def register():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({
            "error": "Name, email and password are required"
        }), 400

    connection = get_connection()

    existing_user = connection.execute(
        "SELECT id FROM users WHERE email = ?",
        (email,)
    ).fetchone()

    if existing_user:
        connection.close()

        return jsonify({
            "error": "Email already registered"
        }), 409

    hashed_password = generate_password_hash(password)

    cursor = connection.execute("""
        INSERT INTO users
        (name, email, password)
        VALUES (?, ?, ?)
    """, (
        name,
        email,
        hashed_password
    ))

    connection.commit()

    user_id = cursor.lastrowid

    connection.close()

    return jsonify({
        "message": "Registration successful",
        "user_id": user_id
    }), 201


@app.route("/api/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "error": "Email and password are required"
        }), 400

    connection = get_connection()

    user = connection.execute(
        "SELECT * FROM users WHERE email = ?",
        (email,)
    ).fetchone()

    connection.close()

    if not user:
        return jsonify({
            "error": "Invalid email or password"
        }), 401

    if not check_password_hash(
        user["password"],
        password
    ):
        return jsonify({
            "error": "Invalid email or password"
        }), 401

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"]
        }
    }), 200


# ==================== PROJECTS ====================

@app.route("/api/projects", methods=["GET"])
def get_projects():

    connection = get_connection()

    projects = connection.execute(
        "SELECT * FROM projects ORDER BY id DESC"
    ).fetchall()

    connection.close()

    return jsonify([
        dict(project)
        for project in projects
    ])


@app.route("/api/projects", methods=["POST"])
def add_project():

    data = request.get_json()

    name = data.get("name")
    description = data.get("description")
    status = data.get("status", "Pending")
    priority = data.get("priority", "Medium")
    deadline = data.get("deadline")

    if not name:
        return jsonify({
            "error": "Project name is required"
        }), 400

    connection = get_connection()

    cursor = connection.execute("""
        INSERT INTO projects
        (name, description, status, priority, deadline)
        VALUES (?, ?, ?, ?, ?)
    """, (
        name,
        description,
        status,
        priority,
        deadline
    ))

    connection.commit()

    project_id = cursor.lastrowid

    connection.close()

    return jsonify({
        "message": "Project added successfully",
        "id": project_id
    }), 201


@app.route("/api/projects/<int:project_id>", methods=["PUT"])
def update_project(project_id):

    data = request.get_json()

    status = data.get("status")
    priority = data.get("priority")

    connection = get_connection()

    connection.execute("""
        UPDATE projects
        SET status = ?, priority = ?
        WHERE id = ?
    """, (
        status,
        priority,
        project_id
    ))

    connection.commit()
    connection.close()

    return jsonify({
        "message": "Project updated successfully"
    })


@app.route("/api/projects/<int:project_id>", methods=["DELETE"])
def delete_project(project_id):

    connection = get_connection()

    connection.execute(
        "DELETE FROM projects WHERE id = ?",
        (project_id,)
    )

    connection.commit()
    connection.close()

    return jsonify({
        "message": "Project deleted successfully"
    })


# ==================== TASKS ====================

@app.route("/api/tasks", methods=["GET"])
def get_tasks():

    connection = get_connection()

    tasks = connection.execute("""
        SELECT
            tasks.id,
            tasks.project_id,
            tasks.title,
            tasks.description,
            tasks.status,
            tasks.priority,
            tasks.deadline,
            projects.name AS project_name
        FROM tasks
        LEFT JOIN projects
        ON tasks.project_id = projects.id
        ORDER BY tasks.id DESC
    """).fetchall()

    connection.close()

    return jsonify([
        dict(task)
        for task in tasks
    ])


@app.route("/api/tasks", methods=["POST"])
def add_task():

    data = request.get_json()

    project_id = data.get("project_id")
    title = data.get("title")
    description = data.get("description")
    status = data.get("status", "Pending")
    priority = data.get("priority", "Medium")
    deadline = data.get("deadline")

    if not title:
        return jsonify({
            "error": "Task title is required"
        }), 400

    connection = get_connection()

    cursor = connection.execute("""
        INSERT INTO tasks
        (project_id, title, description, status, priority, deadline)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        project_id,
        title,
        description,
        status,
        priority,
        deadline
    ))

    connection.commit()

    task_id = cursor.lastrowid

    connection.close()

    return jsonify({
        "message": "Task added successfully",
        "id": task_id
    }), 201


@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):

    data = request.get_json()

    status = data.get("status")
    priority = data.get("priority")

    connection = get_connection()

    connection.execute("""
        UPDATE tasks
        SET status = ?, priority = ?
        WHERE id = ?
    """, (
        status,
        priority,
        task_id
    ))

    connection.commit()
    connection.close()

    return jsonify({
        "message": "Task updated successfully"
    })


@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):

    connection = get_connection()

    connection.execute(
        "DELETE FROM tasks WHERE id = ?",
        (task_id,)
    )

    connection.commit()
    connection.close()

    return jsonify({
        "message": "Task deleted successfully"
    })


# ==================== RUN SERVER ====================

if __name__ == "__main__":
    app.run(debug=True)