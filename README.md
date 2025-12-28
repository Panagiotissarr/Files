# GitHub Pages File Browser

A minimal, client-side file browser for GitHub Pages.

This project lists files and directories from a GitHub repository using the GitHub REST API.  
All files are served from a `/files` directory, which acts as the root of the file system.  

No backend. No build step. Works entirely in the browser.

---

## Features

- Lists directories and files from `/files`
- Click directories to navigate
- Click files to open or download
- Automatically updates when repository content changes
- Clean, minimal UI
- Pure HTML, CSS, and JavaScript

---

## Project Structure

- /
- ├── index.html
- ├── app.js
- ├── style.css
- └── files/
- ├── images/
- │ └── example.png
- └── docs/
- └── readme.txt


All visible files and folders are inside `/files`.  
No nested `/files/files` folder is needed.

---

## Setup

1. Clone the repository.
2. Add your files and folders inside the `/files` directory.
3. Edit `app.js` and set your GitHub info:

```js
const OWNER = "panagiotissarr";
const REPO = "files";
const BRANCH = "main";
const ROOT = "files"; // points to /files folder
