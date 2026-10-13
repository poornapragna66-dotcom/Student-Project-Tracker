
const form = document.getElementById("project-form");
const nameInput = document.getElementById("name");
const statusInput = document.getElementById("status");
const projectList = document.getElementById("project-list");
const emptyState = document.getElementById("empty-state");

// Store projects temporarily in an array.
const projects = [];

// Display all projects on the page.
function renderProjects() {
    projectList.replaceChildren();

    projects.forEach(function (project) {
        const li = document.createElement("li");

        const name = document.createElement("strong");
        name.textContent = project.name;

        const status = document.createElement("span");
        status.textContent = " - " + project.status;

        li.appendChild(name);
        li.appendChild(status);
        projectList.appendChild(li);
    });

    if (emptyState) {
        emptyState.hidden = projects.length > 0;
    }
}

// Add a project when the form is submitted.
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = nameInput.value.trim();
    const status = statusInput.value;

    // Do not allow an empty project name.
    if (name === "") {
        nameInput.focus();
        return;
    }

    // Create a project with a unique ID.
    const project = {
        id: Date.now().toString() + "-" + Math.random().toString(36).slice(2),
        name: name,
        status: status
    };

    // Add the project to the array.
    projects.push(project);

    // Refresh the displayed list.
    renderProjects();

    // Clear the form for the next project.
    form.reset();
    nameInput.focus();
});
