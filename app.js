const OWNER = "panagiotissarr";
const REPO = "files";
const BRANCH = "main";
const ROOT = "files";

const list = document.getElementById("list");
const pathView = document.getElementById("path");
const searchInput = document.getElementById("search");

function getPathFromURL() {
  const urlPath = window.location.pathname;
  const parts = urlPath.split("/").filter(Boolean);
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
    li.innerHTML = `<span>📁 ..</span>`;
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
      li.innerHTML = `<span>📁 ${item.name}</span>`;
      li.onclick = () => {
        setURL(item.path);
        load(item.path);
      };
    } else {
      li.innerHTML = `<a href="${item.download_url}" target="_blank">📄 ${item.name}</a>`;
    }
    list.appendChild(li);
  });
}

// Filter files in the current folder
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const items = list.querySelectorAll("li");

  items.forEach(li => {
    const text = li.textContent.toLowerCase();
    li.style.display = text.includes(query) ? "" : "none";
  });
});

window.onpopstate = () => load();
load();
