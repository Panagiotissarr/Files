const OWNER = "panagiotissarr";
const REPO = "files";
const BRANCH = "main";
const ROOT = "files";

const list = document.getElementById("list");
const pathView = document.getElementById("path");

// GitHub Pages base path (repo name)
const BASE = "/" + REPO;

function getPathFromURL() {
  const params = new URLSearchParams(window.location.search);
  let path = params.get("p");

  if (!path) {
    path = window.location.pathname;
  }

  // Remove /files (repo name)
  if (path.startsWith("/" + REPO)) {
    path = path.slice(REPO.length + 1);
  }

  path = path.replace(/^\/+|\/+$/g, "");
  return path ? `${ROOT}/${path}` : ROOT;
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
