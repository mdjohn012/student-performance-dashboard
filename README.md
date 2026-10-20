# Classwise — Student Performance Dashboard

A responsive student performance dashboard built with **HTML, CSS and vanilla JavaScript**. No framework or build step required.

## Features

- KPI cards for total students, average score, attendance and students needing support
- Subject performance bar chart and grade distribution donut
- Search students by name or email
- Filter by class and grade
- Sort by name or score
- Add and remove student records
- Automatic grade and support-status calculation
- Attendance breakdown by class
- Export student records as CSV
- LocalStorage persistence in the current browser
- Responsive desktop, tablet and mobile layout

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a browser.

For a local development server, use the **Live Server** extension in VS Code and click **Go Live**.

## Deploy with GitHub Pages

1. Create a GitHub repository, for example `student-performance-dashboard`.
2. Upload `index.html`, `style.css`, `script.js` and `README.md` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then save.
6. Wait for GitHub Pages to publish your site; the URL will appear in the Pages settings.

## Project structure

```text
student-performance-dashboard/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Important notes

- The included student records are fictional demo data.
- Records you add or delete are stored in your browser's LocalStorage. They are not shared between devices and are not stored in a server/database.
- The performance chart uses illustrative subject averages. The student table and KPI cards update from the current student records.
- Google Fonts is loaded online; system fonts remain available as fallbacks.

## Tech stack

- HTML5
- CSS3 (Grid, Flexbox, responsive media queries)
- Vanilla JavaScript (DOM, events, LocalStorage, CSV export)
