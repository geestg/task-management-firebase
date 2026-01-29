from flask import Blueprint, request, jsonify
from app.services.firebase_service import (
    create_task,
    get_all_tasks,
    get_task_by_id,
    update_task,
    delete_task
)

# Blueprint untuk task
task_bp = Blueprint("tasks", __name__, url_prefix="/tasks")


# ======================
# CREATE TASK
# ======================
@task_bp.route("/", methods=["POST"])
def add_task():
    data = request.json
    task = create_task(data)
    return jsonify(task), 201


# ======================
# READ ALL TASKS
# ======================
@task_bp.route("/", methods=["GET"])
def fetch_tasks():
    return jsonify(get_all_tasks()), 200


# ======================
# READ TASK BY ID
# ======================
@task_bp.route("/<task_id>", methods=["GET"])
def fetch_task(task_id):
    task = get_task_by_id(task_id)
    if task:
        return jsonify(task), 200
    return jsonify({"error": "Task not found"}), 404


# ======================
# UPDATE TASK
# ======================
@task_bp.route("/<task_id>", methods=["PUT"])
def edit_task(task_id):
    updated = update_task(task_id, request.json)
    if updated:
        return jsonify(updated), 200
    return jsonify({"error": "Task not found"}), 404


# ======================
# DELETE TASK
# ======================
@task_bp.route("/<task_id>", methods=["DELETE"])
def remove_task(task_id):
    deleted = delete_task(task_id)
    if deleted:
        return jsonify({"message": "Task deleted successfully"}), 200
    return jsonify({"error": "Task not found"}), 404
