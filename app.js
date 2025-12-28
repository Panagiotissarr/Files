const OWNER = "panagiotissarr";
const REPO = "files";
const BRANCH = "main";
const ROOT = "files"; // /files is the virtual root

const list = document.getElementById("list");
const pathView = document.getElementById("path");

function getPathFromURL() {
  const urlPath = window.location.pathname;
  const parts = urlPath.split("/").filter(Boolean);
  return parts.length > 1 ? `${ROOT}/${parts.slice(1).join("/")}` : ROOT;
}

function setURL(dirPath) {
  const clean = dirPath.replace(`${ROOT}/`, "");
  const base = window.location.origin;
  history.pushState(null, "", base + "/" + clean);
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

  // Parent directory
  if (path !== ROOT) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = "..";
    li.appendChild(span);

    li.onclick = () => {
      const p = parentPath(path);
      setURL(p);
      load(p);
    };

    list.appendChild(li);
  }

  // Files & folders
  data.forEach(item => {
    const li = document.createElement("li");

    if (item.type === "dir") {
      const span = document.createElement("span");
      span.textContent = item.name;
      li.appendChild(span);

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
