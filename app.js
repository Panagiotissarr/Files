const OWNER = "panagiotissarr";
const REPO = "files";
const BRANCH = "main";
const ROOT = "files"; // points to the /files folder

const list = document.getElementById("list");
const pathView = document.getElementById("path");

// Determine path from URL
function getPathFromURL() {
  const urlPath = window.location.pathname;
  const parts = urlPath.split("/").filter(Boolean); // remove empty parts
  return parts.length > 1 ? `${ROOT}/${parts.slice(1).join("/")}` : ROOT;
}

function setURL(dirPath) {
  const clean = dirPath.replace(`${ROOT}/`, "");
  const base = window.location.origin;
  history.pushState(null, "", base + "/" + REPO + "/" + clean);
}

function parentPath(path) {
  const parts = path.split("/");
  parts.pop();
  return parts.join("/") || ROOT;
}

async function load(path = getPathFromURL()) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`;
  const res = await fetch(url);

  if (!res.ok) {
    list.innerHTML = "<li>Not found</li>";
    pathView.textContent = "/";
    return;
  }

  const data = await res.json();

  list.innerHTML = "";
  pathView.textContent = "/" + path.replace(`${ROOT}/`, "");

  if (path !== ROOT) {
    const li = document.createElement("li");
    li.textContent = "..";
    li.onclick = () => {
      const p = parentPath(path);
      setURL(p);
      load(p);
    };
    list.appendChild(li);
  }

  data.forEach(item => {
    const li = document.createElement("li");

    if (item.type === "dir") {
      li.textContent = item.name;
      li.onclick = () => {
        setURL(item.path);
        load(item.path);
      };
    } else {
      const a = document.createElement("a");
      a.textContent = item.name;
      a.href = item.download_url;
      a.target = "_blank";
      li.appendChild(a);
    }

    list.appendChild(li);
  });
}

window.onpopstate = () => load();
load();
