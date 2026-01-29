const API_URL = "http://127.0.0.1:5000/tasks/";

const taskList = document.getElementById("taskList");
const form = document.getElementById("taskForm");

async function fetchTasks() {
    const res = await fetch(API_URL);
    const tasks = await res.json();
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");

        const info = document.createElement("div");
        info.className = "task-info";
        info.innerHTML = `
            <strong>${task.title}</strong>
            <span class="badge ${task.status}">${task.status}</span>
            <div>${task.description}</div>
        `;

        const actions = document.createElement("div");
        actions.className = "actions";

        const statusBtn = document.createElement("button");
        statusBtn.textContent = "Next Status";
        statusBtn.onclick = () => updateStatus(task);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteTask(task.id);

        actions.appendChild(statusBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(info);
        li.appendChild(actions);
        taskList.appendChild(li);
    });
}

function nextStatus(current) {
    if (current === "TODO") return "IN_PROGRESS";
    if (current === "IN_PROGRESS") return "DONE";
    return "TODO";
}

async function updateStatus(task) {
    const newStatus = nextStatus(task.status);

    await fetch(API_URL + task.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
    });

    fetchTasks();
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description })
    });

    form.reset();
    fetchTasks();
});

async function deleteTask(id) {
    await fetch(API_URL + id, { method: "DELETE" });
    fetchTasks();
}

fetchTasks();
