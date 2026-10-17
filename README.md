Student Project Tracker

A hands-on web app development workshop project. It adds, displays, edits and deletes engineering projects, with data stored in local SQLite.

Run locally

Use the workshop Node 22 baseline (at least 22.18, below 23), Git and VS Code.

Open a PowerShell terminal inside the project, then run:

npm.cmd ci
npm.cmd start

Open http://localhost:3000. Stop the server with "Ctrl+C".

How it works

Browser HTML/CSS/JavaScript -> fetch/HTTP -> Express API -> SQLite -> JSON response -> updated page.

- "public/index.html": page structure and form.
- "public/style.css": appearance and responsive layout.
- "public/script.js": input, API requests, rendering and feedback.
- "server.js": starts the local server.
- "app.js": routes, validation and responses.
- "database.js": SQLite operations; creates "data/projects.db" locally.

API

- "GET /api/health"
- "GET /api/projects"
- "POST /api/projects"
- "PUT /api/projects/:id"
- "DELETE /api/projects/:id"

Verification

Checks performed:

- API test: "npm.cmd test" completed with 1 test passed and 0 failures.
- Create: added two distinct test projects successfully.
- Edit: edited a project and verified its ID remained "15".
- Cancel edit: cancelled an edit and verified the original name remained unchanged.
- Delete: confirmed deletion of a disposable test project and verified it disappeared.
- Persistence: refreshed the browser and restarted the server; retained and deleted records remained in their expected states.
- Validation: blank and whitespace-only names were rejected.
- Failure and recovery: stopped the server, observed a connection error, restarted the server and successfully retried the save. The project appeared only once, and the input remained in the form after failure.
- Slow network: used Slow 4G throttling and observed only one POST request during the repeated-click test. Restored No throttling afterward.
- Mobile and keyboard: tested at 390 × 642 pixels and confirmed a visible dark-blue keyboard-focus outline.

The Add Project button's disabled state during a pending save was not directly confirmed.

The supplied "test/crud.test.js" reference API test passed. It tests the reference API using a temporary database, not browser interactions.

Workshop limitations

This local teaching app has no sign-in or per-user permissions. Browsers calling the same server share its collection. The SQLite data file and "node_modules" are not uploaded to GitHub. Cloud hosting requires separate server and database configuration.