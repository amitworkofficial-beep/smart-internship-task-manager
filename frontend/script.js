const PROJECTS_API = "http://127.0.0.1:5000/api/projects";
const TASKS_API = "http://127.0.0.1:5000/api/tasks";

let projects = [];
let tasks = [];


// ==================== LOAD PROJECTS ====================

async function loadProjects() {
    try {
        const response = await fetch(PROJECTS_API);

        if (!response.ok) {
            throw new Error("Projects API failed");
        }

        projects = await response.json();

        updateProjectDashboard();
        populateProjectDropdown();
        displayProjects();

    } catch (error) {
        console.error("Error loading projects:", error);
    }
}


// ==================== PROJECT DASHBOARD ====================

function updateProjectDashboard() {

    document.getElementById("totalProjects").textContent =
        projects.length;

    document.getElementById("completedProjects").textContent =
        projects.filter(
            project => project.status === "Completed"
        ).length;

    document.getElementById("pendingProjects").textContent =
        projects.filter(
            project => project.status === "Pending"
        ).length;
}


// ==================== PROJECT DROPDOWN ====================

function populateProjectDropdown() {

    const taskProject =
        document.getElementById("taskProject");

    taskProject.innerHTML =
        '<option value="">Select Project</option>';

    projects.forEach(project => {

        const option = document.createElement("option");

        option.value = project.id;
        option.textContent = project.name;

        taskProject.appendChild(option);
    });
}


// ==================== DISPLAY PROJECTS ====================

function displayProjects() {

    const projectList =
        document.getElementById("projectList");

    const searchInput =
        document.getElementById("projectSearch");

    const filterInput =
        document.getElementById("projectFilter");

    const searchText =
        searchInput.value.trim().toLowerCase();

    const filterStatus =
        filterInput.value;

    const filteredProjects = projects.filter(project => {

        const name =
            String(project.name || "").toLowerCase();

        const description =
            String(project.description || "").toLowerCase();

        const status =
            String(project.status || "");

        const matchesSearch =
            name.includes(searchText) ||
            description.includes(searchText);

        const matchesStatus =
            filterStatus === "All" ||
            status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    projectList.innerHTML = "";

    if (filteredProjects.length === 0) {

        projectList.innerHTML =
            "<p>No matching projects found.</p>";

        return;
    }

    filteredProjects.forEach(project => {

        const projectDiv =
            document.createElement("div");

        projectDiv.innerHTML = `

            <h3>${project.name}</h3>

            <p>
                ${project.description || "No description"}
            </p>

            <p>
                Status:

                <select id="project-status-${project.id}">

                    <option value="Pending"
                        ${project.status === "Pending" ? "selected" : ""}>
                        Pending
                    </option>

                    <option value="In Progress"
                        ${project.status === "In Progress" ? "selected" : ""}>
                        In Progress
                    </option>

                    <option value="Completed"
                        ${project.status === "Completed" ? "selected" : ""}>
                        Completed
                    </option>

                </select>
            </p>

            <p>
                Priority:

                <select id="project-priority-${project.id}">

                    <option value="Low"
                        ${project.priority === "Low" ? "selected" : ""}>
                        Low
                    </option>

                    <option value="Medium"
                        ${project.priority === "Medium" ? "selected" : ""}>
                        Medium
                    </option>

                    <option value="High"
                        ${project.priority === "High" ? "selected" : ""}>
                        High
                    </option>

                </select>
            </p>

            <p>
                Deadline:
                ${project.deadline || "No deadline"}
            </p>

            <button onclick="updateProject(${project.id})">
                Update Project
            </button>

            <button onclick="deleteProject(${project.id})">
                Delete Project
            </button>

            <hr>
        `;

        projectList.appendChild(projectDiv);
    });
}


// ==================== LOAD TASKS ====================

async function loadTasks() {

    try {

        const response = await fetch(TASKS_API);

        if (!response.ok) {
            throw new Error("Tasks API failed");
        }

        tasks = await response.json();

        updateTaskDashboard();
        displayTasks();

    } catch (error) {

        console.error("Error loading tasks:", error);
    }
}


// ==================== TASK DASHBOARD ====================

function updateTaskDashboard() {

    document.getElementById("totalTasks").textContent =
        tasks.length;

    document.getElementById("completedTasks").textContent =
        tasks.filter(
            task => task.status === "Completed"
        ).length;
}


// ==================== DISPLAY TASKS ====================

function displayTasks() {

    const taskList =
        document.getElementById("taskList");

    const searchInput =
        document.getElementById("taskSearch");

    const filterInput =
        document.getElementById("taskFilter");

    const searchText =
        searchInput.value.trim().toLowerCase();

    const filterStatus =
        filterInput.value;

    const filteredTasks = tasks.filter(task => {

        const title =
            String(task.title || "").toLowerCase();

        const description =
            String(task.description || "").toLowerCase();

        const projectName =
            String(task.project_name || "").toLowerCase();

        const status =
            String(task.status || "");

        const matchesSearch =
            title.includes(searchText) ||
            description.includes(searchText) ||
            projectName.includes(searchText);

        const matchesStatus =
            filterStatus === "All" ||
            status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    taskList.innerHTML = "";

    if (filteredTasks.length === 0) {

        taskList.innerHTML =
            "<p>No matching tasks found.</p>";

        return;
    }

    filteredTasks.forEach(task => {

        const taskDiv =
            document.createElement("div");

        taskDiv.innerHTML = `

            <h3>${task.title}</h3>

            <p>
                ${task.description || "No description"}
            </p>

            <p>
                Project:
                ${task.project_name || "No project"}
            </p>

            <p>
                Status:

                <select id="status-${task.id}">

                    <option value="Pending"
                        ${task.status === "Pending" ? "selected" : ""}>
                        Pending
                    </option>

                    <option value="In Progress"
                        ${task.status === "In Progress" ? "selected" : ""}>
                        In Progress
                    </option>

                    <option value="Completed"
                        ${task.status === "Completed" ? "selected" : ""}>
                        Completed
                    </option>

                </select>
            </p>

            <p>
                Priority:

                <select id="priority-${task.id}">

                    <option value="Low"
                        ${task.priority === "Low" ? "selected" : ""}>
                        Low
                    </option>

                    <option value="Medium"
                        ${task.priority === "Medium" ? "selected" : ""}>
                        Medium
                    </option>

                    <option value="High"
                        ${task.priority === "High" ? "selected" : ""}>
                        High
                    </option>

                </select>
            </p>

            <p>
                Deadline:
                ${task.deadline || "No deadline"}
            </p>

            <button onclick="updateTask(${task.id})">
                Update Task
            </button>

            <button onclick="deleteTask(${task.id})">
                Delete Task
            </button>

            <hr>
        `;

        taskList.appendChild(taskDiv);
    });
}


// ==================== ADD PROJECT ====================

document.getElementById("projectForm").addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const project = {

            name:
                document.getElementById("projectName").value.trim(),

            description:
                document.getElementById("projectDescription").value.trim(),

            status:
                document.getElementById("projectStatus").value,

            priority:
                document.getElementById("projectPriority").value,

            deadline:
                document.getElementById("projectDeadline").value
        };

        try {

            const response = await fetch(
                PROJECTS_API,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(project)
                }
            );

            if (!response.ok) {
                throw new Error("Failed to add project");
            }

            alert("Project added successfully!");

            document.getElementById("projectForm").reset();

            await loadProjects();

        } catch (error) {

            console.error(error);

            alert("Error adding project");
        }
    }
);


// ==================== ADD TASK ====================

document.getElementById("taskForm").addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const task = {

            project_id:
                document.getElementById("taskProject").value,

            title:
                document.getElementById("taskTitle").value.trim(),

            description:
                document.getElementById("taskDescription").value.trim(),

            status:
                document.getElementById("taskStatus").value,

            priority:
                document.getElementById("taskPriority").value,

            deadline:
                document.getElementById("taskDeadline").value
        };

        try {

            const response = await fetch(
                TASKS_API,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(task)
                }
            );

            if (!response.ok) {
                throw new Error("Failed to add task");
            }

            alert("Task added successfully!");

            document.getElementById("taskForm").reset();

            await loadTasks();

        } catch (error) {

            console.error(error);

            alert("Error adding task");
        }
    }
);


// ==================== UPDATE PROJECT ====================

async function updateProject(projectId) {

    const status =
        document.getElementById(
            `project-status-${projectId}`
        ).value;

    const priority =
        document.getElementById(
            `project-priority-${projectId}`
        ).value;

    try {

        const response = await fetch(
            `${PROJECTS_API}/${projectId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    status: status,
                    priority: priority
                })
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update project");
        }

        alert("Project updated successfully!");

        await loadProjects();

    } catch (error) {

        console.error(error);

        alert("Error updating project");
    }
}


// ==================== DELETE PROJECT ====================

async function deleteProject(projectId) {

    if (!confirm(
        "Are you sure you want to delete this project?"
    )) {
        return;
    }

    try {

        const response = await fetch(
            `${PROJECTS_API}/${projectId}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete project");
        }

        alert("Project deleted successfully!");

        await loadProjects();

        await loadTasks();

    } catch (error) {

        console.error(error);

        alert("Error deleting project");
    }
}


// ==================== UPDATE TASK ====================

async function updateTask(taskId) {

    const status =
        document.getElementById(
            `status-${taskId}`
        ).value;

    const priority =
        document.getElementById(
            `priority-${taskId}`
        ).value;

    try {

        const response = await fetch(
            `${TASKS_API}/${taskId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    status: status,
                    priority: priority
                })
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update task");
        }

        alert("Task updated successfully!");

        await loadTasks();

    } catch (error) {

        console.error(error);

        alert("Error updating task");
    }
}


// ==================== DELETE TASK ====================

async function deleteTask(taskId) {

    if (!confirm(
        "Are you sure you want to delete this task?"
    )) {
        return;
    }

    try {

        const response = await fetch(
            `${TASKS_API}/${taskId}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete task");
        }

        alert("Task deleted successfully!");

        await loadTasks();

    } catch (error) {

        console.error(error);

        alert("Error deleting task");
    }
}


// ==================== SEARCH & FILTER ====================

document.getElementById("projectSearch").addEventListener(
    "input",
    function() {
        displayProjects();
    }
);

document.getElementById("projectFilter").addEventListener(
    "change",
    function() {
        displayProjects();
    }
);

document.getElementById("taskSearch").addEventListener(
    "input",
    function() {
        displayTasks();
    }
);

document.getElementById("taskFilter").addEventListener(
    "change",
    function() {
        displayTasks();
    }
);


// ==================== INITIALIZE ====================

async function initializeApp() {

    await loadProjects();

    await loadTasks();
}

initializeApp();


// ==================== AUTHENTICATION ====================

const REGISTER_API = "http://127.0.0.1:5000/api/register";
const LOGIN_API = "http://127.0.0.1:5000/api/login";


// ==================== REGISTER ====================

document.getElementById("registerForm").addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const user = {

            name:
                document.getElementById("registerName").value.trim(),

            email:
                document.getElementById("registerEmail").value.trim(),

            password:
                document.getElementById("registerPassword").value
        };

        try {

            const response = await fetch(
                REGISTER_API,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(user)
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || "Registration failed"
                );
            }

            alert("Registration successful!");

            document.getElementById("registerForm").reset();

        } catch (error) {

            console.error(error);

            alert(error.message);
        }
    }
);


// ==================== LOGIN ====================

document.getElementById("loginForm").addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const loginData = {

            email:
                document.getElementById("loginEmail").value.trim(),

            password:
                document.getElementById("loginPassword").value
        };

        try {

            const response = await fetch(
                LOGIN_API,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(loginData)
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || "Login failed"
                );
            }

            alert(
                "Login successful! Welcome " +
                result.user.name
            );

            document.getElementById("loginForm").reset();

            // Show dashboard after successful login
            document.getElementById(
                "mainContent"
            ).style.display = "block";

        } catch (error) {

            console.error(error);

            alert(error.message);
        }
    }
);