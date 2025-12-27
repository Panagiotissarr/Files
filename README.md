# GitHub Pages File Browser

A minimal, client-side file browser for GitHub Pages.

This project lists files and directories from a GitHub repository using the GitHub REST API.  
All files are served from a dedicated `/files` directory and update automatically when the repository changes.

No backend. No build step.

---

## Features

- Lists directories and files from `/files`
- Click directories to navigate
- Click files to open or download
- Automatically reflects repository updates
- Works on GitHub Pages
- Clean, minimal UI
- Pure HTML, CSS, and JavaScript

---

## Project Structure

/
├── index.html
├── app.js
├── style.css
└── files/
└── your-content-here


Only the contents of `/files` are exposed in the browser.

---

## Setup

1. Clone the repository
2. Edit `app.js` and set:
   ```js
   const OWNER = "your-github-username";
   const REPO = "your-repo-name";