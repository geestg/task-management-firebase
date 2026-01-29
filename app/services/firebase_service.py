from datetime import datetime
from app.config.firebase import db


# ======================
# ACTIVITY LOG
# ======================
def log_activity(action, task_id, payload=None):
    log = {
        "action": action,
        "task_id": task_id,
        "timestamp": datetime.utcnow().isoformat(),
        "payload": payload or {}
    }

    db.collection("activity_logs").add(log)


# ======================
# CREATE
# ======================
def create_task(data):
    now = datetime.utcnow().isoformat()

    task = {
        "title": data.get("title"),
        "description": data.get("description", ""),
        "status": data.get("status", "TODO"),
        "created_at": now,
        "updated_at": now
    }

    doc_ref = db.collection("tasks").add(task)
    task_id = doc_ref[1].id
    task["id"] = task_id

    # log activity
    log_activity("CREATE", task_id, task)

    return task


# ======================
# READ ALL
# ======================
def get_all_tasks():
    tasks = []
    docs = db.collection("tasks").stream()

    for doc in docs:
        task = doc.to_dict()
        task["id"] = doc.id
        tasks.append(task)

    return tasks


# ======================
# READ BY ID
# ======================
def get_task_by_id(task_id):
    doc = db.collection("tasks").document(task_id).get()

    if not doc.exists:
        return None

    task = doc.to_dict()
    task["id"] = doc.id
    return task


# ======================
# UPDATE
# ======================
def update_task(task_id, data):
    ref = db.collection("tasks").document(task_id)

    snapshot = ref.get()
    if not snapshot.exists:
        return None

    data["updated_at"] = datetime.utcnow().isoformat()
    ref.update(data)

    updated = ref.get().to_dict()
    updated["id"] = task_id

    # log activity
    log_activity("UPDATE", task_id, data)

    return updated


# ======================
# DELETE
# ======================
def delete_task(task_id):
    ref = db.collection("tasks").document(task_id)

    snapshot = ref.get()
    if not snapshot.exists:
        return False

    ref.delete()

    # log activity
    log_activity("DELETE", task_id)

    return True
