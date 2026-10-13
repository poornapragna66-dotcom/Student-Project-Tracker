const form = document.getElementById("project-form");
const nameInput = document.getElementById("name");
const statusInput = document.getElementById("status");
const projectList = document.getElementById("project-list");
const emptyState = document.getElementById("empty-state");
const saveButton = document.getElementById("save-button");
const cancelButton = document.getElementById("cancel-button");
const message = document.getElementById("message");

const STORAGE_KEY = "workshop-projects-v1";

let projects = [];
let editingId = null;
let storageReady = true;

// Display a message.
function showMessage(text) {
    message.textContent = text;
}

// Validate the saved project data.
function isValidProjects(data) {
    const validStatuses = ["Planned", "In Progress", "Completed"];

    if (!Array.isArray(data)) {
        return false;
    }

    const ids = new Set();

    return data.every(function (project) {
        if (
            !project ||
            typeof project !== "object" ||
            typeof project.id !== "string" ||
            project.id.trim() === "" ||
            typeof project.name !== "string" ||
            project.name.trim() === "" ||
            project.name.length > 80 ||
            !validStatuses.includes(project.status) ||
            ids.has(project.id)
        ) {
            return false;
        }

        ids.add(project.id);
        return true;
    });
}

// Load projects from browser storage.
function loadProjects() {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);

        if (savedData === null) {
            projects = [];
            return;
        }

        const loadedProjects = JSON.parse(savedData);

        if (!isValidProjects(loadedProjects)) {
            storageReady = false;
            showMessage(
                "Saved data is invalid. Existing data has not been changed."
            );
            return;
        }

        projects = loadedProjects;
    } catch (error) {
        storageReady = false;
        showMessage(
            "Could not read saved projects. Check browser storage settings."
        );
    }
}

// Save projects to browser storage.
function saveProjects() {
    if (!storageReady) {
        showMessage(
            "Cannot save because the existing stored data could not be loaded safely."
        );
        return false;
    }

    try {
        const projectsText = JSON.stringify(projects);
        localStorage.setItem(STORAGE_KEY, projectsText);
        showMessage("Projects saved successfully!");
        return true;
    } catch (error) {
        showMessage(
            "Could not save projects. Check browser storage settings."
        );
        return false;
    }
}

// Reset the form.
function resetForm() {
    form.reset();
    editingId = null;
    saveButton.textContent = "Save Project";
    cancelButton.hidden = true;
}

// Display all projects.
function renderProjects() {
    projectList.replaceChildren();

    projects.forEach(function (project) {
        const li = document.createElement("li");

        const name = document.createElement("strong");
        name.textContent = project.name;

        const status = document.createElement("span");
        status.textContent = " - " + project.status;

        const actions = document.createElement("div");
        actions.className = "card-actions";

        // Edit button.
        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function () {
            editingId = project.id;

            nameInput.value = project.name;
            statusInput.value = project.status;

            saveButton.textContent = "Save changes";
            cancelButton.hidden = false;

            showMessage("Editing project: " + project.name);
            nameInput.focus();
        });

        // Delete button.
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            const confirmed = window.confirm(
                'Are you sure you want to delete "' +
                project.name +
                '"?'
            );

            if (!confirmed) {
                return;
            }

            const index = projects.findIndex(function (item) {
                return item.id === project.id;
            });

            if (index === -1) {
                return;
            }

            projects.splice(index, 1);

            if (editingId === project.id) {
                resetForm();
            }

            renderProjects();
            saveProjects();
        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        li.appendChild(name);
        li.appendChild(status);
        li.appendChild(actions);

        projectList.appendChild(li);
    });

    emptyState.hidden = projects.length > 0;
}

// Add a new project or save an edit.
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const projectName = nameInput.value.trim();
    const projectStatus = statusInput.value;

    if (projectName === "") {
        showMessage("Please enter a project name.");
        nameInput.focus();
        return;
    }

    if (!["Planned", "In Progress", "Completed"].includes(projectStatus)) {
        showMessage("Please select a valid project status.");
        return;
    }

    if (editingId === null) {
        const project = {
            id: Date.now().toString() +
                "-" +
                Math.random().toString(36).slice(2),
            name: projectName,
            status: projectStatus
        };

        projects.push(project);
    } else {
        const project = projects.find(function (item) {
            return item.id === editingId;
        });

        if (!project) {
            showMessage("Project not found.");
            resetForm();
            renderProjects();
            return;
        }

        project.name = projectName;
        project.status = projectStatus;
    }

    const saved = saveProjects();

    renderProjects();
    resetForm();
    nameInput.focus();

    if (!saved) {
        showMessage(
            "Project appears on this page but could not be saved permanently."
        );
    }
});

// Cancel editing without saving changes.
cancelButton.addEventListener("click", function () {
    resetForm();
    showMessage("Editing cancelled. No changes were saved.");
    nameInput.focus();
});

// Load projects when the page starts.
loadProjects();
renderProjects();