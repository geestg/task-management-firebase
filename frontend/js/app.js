const API_URL = "http://127.0.0.1:5000/tasks/";

const taskListBody = document.querySelector("#taskList tbody");
const form = document.getElementById("taskForm");

async function fetchTasks() {
    const res = await fetch(API_URL);
    const tasks = await res.json();
    taskListBody.innerHTML = "";

    tasks.forEach(task => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${task.title}</td>
            <td>${task.description}</td>
            <td><span class="badge ${task.status}">${task.status}</span></td>
            <td class="actions">
                <button onclick="updateStatus('${task.id}', '${task.status}')">Next Status</button>
                <button onclick="deleteTask('${task.id}')">Delete</button>
            </td>
        `;

        taskListBody.appendChild(tr);
    });
}

function nextStatus(current) {
    if (current === "TODO") return "IN_PROGRESS";
    if (current === "IN_PROGRESS") return "DONE";
    return "TODO";
}

async function updateStatus(id, currentStatus) {
    const newStatus = nextStatus(currentStatus);
    await fetch(API_URL + id, {
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
    if (!confirm("Are you sure you want to delete this task?")) return;
    await fetch(API_URL + id, { method: "DELETE" });
    fetchTasks();
}

fetchTasks();
