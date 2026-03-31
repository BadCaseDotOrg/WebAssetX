const api = typeof browser !== "undefined" ? browser : chrome;
const domain = location.hostname;
const host = document.createElement("div");
const shadow = host.attachShadow({ mode: "open" });
const style = document.createElement("style");
const panel = document.createElement("div");
const header = document.createElement("div");
const content = document.createElement("div");
const mainRow = document.createElement("div");
const tableWrapper = document.createElement("div");
const table = document.createElement("table");
let headers = ["", "Type", "Ext", "Size", "Link", "File Name", ""];
let isMobileLayout = false;
let sortAsc = true;

function mobileLayout() {
  const isMobile =
    /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    window.matchMedia("(pointer: coarse)").matches;

  if (isMobile) {
    headers = ["", "Type", "Ext", "File Name", ""];
    isMobileLayout = true;
    return true;
  }
}
mobileLayout();

const thead = document.createElement("thead");
const headerRow = document.createElement("tr");
const tbody = document.createElement("tbody");
const previewEl = document.createElement("div");
const btnContainer = document.createElement("div");
const scrapeBtn = document.createElement("button");
const downloadBtn = document.createElement("button");
const copyBtn = document.createElement("button");
const clearBtn = document.createElement("button");
const toggleManagerBtn = document.createElement("button");
const managerDiv = document.createElement("div");
const managerHeader = document.createElement("div");
const managerContent = document.createElement("div");
const filterContainer = document.createElement("div");
const approvalContainer = document.createElement("div");
const activeDownloads = {}; // key = downloadId
const filterCategories = [
  {
    id: "filter-all",
    label: "All",
    icon: "layer-group.svg",
    checked: true,
  },

  {
    id: "filter-images",
    label: "Images",
    icon: "image.svg",
    exts: [
      "png",
      "jpg",
      "jpeg",
      "gif",
      "webp",
      "svg",
      "bmp",
      "ico",
      "avif",
      "heic",
      "heif",
      "jxl",
    ],
  },

  {
    id: "filter-videos",
    label: "Videos",
    icon: "film.svg",
    exts: [
      "mp4",
      "webm",
      "ogg",
      "mov",
      "avi",
      "mkv",
      "flv",
      "wmv",
      "m4v",
      "3gp",
      "ts",
      "m3u8",
      "m3u",
      "mpd",
    ],
  },

  {
    id: "filter-audio",
    label: "Audio",
    icon: "music.svg",
    exts: [
      "mp3",
      "wav",
      "ogg",
      "m4a",
      "aac",
      "flac",
      "opus",
      "wma",
      "mid",
      "midi",
      "amr",
    ],
  },

  {
    id: "filter-fonts",
    label: "Fonts",
    icon: "font.svg",
    exts: ["woff", "woff2", "ttf", "otf", "eot", "ttc"],
  },

  {
    id: "filter-styles",
    label: "CSS / Styles",
    icon: "palette.svg",
    exts: ["css", "scss", "sass", "less", "styl"],
  },

  {
    id: "filter-scripts",
    label: "JS / Scripts / Exe",
    icon: "code.svg",
    exts: [
      "js",
      "mjs",
      "cjs",
      "ts",
      "jsx",
      "tsx",
      "vue",
      "map",
      "json",
      "json5",
      "exe",
      "dll",
      "bat",
      "cmd",
      "ps1",
      "py",
      "sh",
      "apk",
    ],
  },

  {
    id: "filter-docs",
    label: "Documents / Text",
    icon: "file-lines.svg",
    exts: [
      "pdf",
      "txt",
      "md",
      "markdown",
      "html",
      "htm",
      "xhtml",
      "xml",
      "json",
      "yaml",
      "yml",
      "csv",
      "tsv",
      "doc",
      "docx",
      "odt",
      "rtf",
      "xls",
      "xlsx",
      "ods",
      "ppt",
      "pptx",
      "odp",
    ],
  },

  {
    id: "filter-archives",
    label: "Archives / Compressed",
    icon: "box-archive.svg",
    exts: [
      "zip",
      "rar",
      "7z",
      "tar",
      "gz",
      "tgz",
      "bz2",
      "xz",
      "zst",
      "iso",
      "dmg",
      "pkg",
    ],
  },

  {
    id: "filter-other",
    label: "Other / Unknown",
    icon: "circle-question.svg",
    exts: [],
  },
];

function getCategoryForExt(ext) {
  if (!ext) return "other";

  for (const cat of filterCategories) {
    if (cat.exts && cat.exts.includes(ext.toLowerCase())) {
      return cat.id.replace("filter-", "");
    }
  }
  return "other";
}

/* --------------------
Helpers
-------------------- */
function formatSize(size) {
  if (!size || size === "unknown") return "-";
  return size >= 1024 ? (size / 1024).toFixed(2) + " KB" : size + " B";
}

function middleTruncate(str, max = 30) {
  if (str.length <= max) return str;
  const keep = Math.floor((max - 5) / 2);
  return str.slice(0, keep) + "...." + str.slice(str.length - keep);
}

function getFileExtension(url) {
  try {
    if (!url || typeof url !== "string") return "-";
    const filename = url.split("/").pop().split("?")[0].split("#")[0];
    const parts = filename.split(".");
    if (parts.length < 2) return "-";
    const ext = parts.pop().toLowerCase();
    return ext.length > 10 ? "-" : ext;
  } catch {
    return "-";
  }
}

/* --------------------
Sorting
-------------------- */
function sortTable(col, headerText) {
  const rows = [...tbody.rows];
  rows.sort((a, b) => {
    const aText = a.cells[col].dataset.sort || a.cells[col].innerText;
    const bText = b.cells[col].dataset.sort || b.cells[col].innerText;
    if (!isNaN(aText) && !isNaN(bText))
      return sortAsc ? aText - bText : bText - aText;
    return sortAsc ? aText.localeCompare(bText) : bText.localeCompare(aText);
  });
  rows.forEach((r) => tbody.appendChild(r));

  Toast.show(
    `Sorted By ${headerText} ${sortAsc ? "Ascending" : "Descending"} Order`,
    {
      type: "info",
      position: "top",
      duration: 1000,
    },
  );
  sortAsc = !sortAsc;
}

/* --------------------
Refresh table
-------------------- */
const existingUrls = new Set();

const fontExts = new Set([
  "woff",
  "woff2",
  "ttf",
  "otf",
  "eot",
  "otc",
  "ttc",
  "pcf",
  "bdf",
  "snf",
  "pfa",
  "pfb",
  "xml",
]);

function isFontExt(fileExt) {
  return fontExts.has(fileExt.toLowerCase().replace(".", ""));
}

function addRequestToTable(request) {
  if (
    !request?.url ||
    existingUrls.has(request.url) ||
    request.url.startsWith("chrome")
  )
    return;
  existingUrls.add(request.url);

  const tr = document.createElement("tr");
  tr.style.cursor = "default";
  tr.dataset.url = request.url;

  // Checkbox
  const tdSelect = document.createElement("td");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  tdSelect.appendChild(checkbox);
  tr.appendChild(tdSelect);
  const isMobile = mobileLayout();
  // Type
  const tdType = document.createElement("td");
  if (!isMobile) {
    tdType.textContent = request.type;
  } else {
    tdType.textContent =
      request.type.toLowerCase() === "xmlhttprequest"
        ? "xmlhttp"
        : request.type;
  }
  tr.appendChild(tdType);
  // Extension
  const tdExt = document.createElement("td");
  const fileExt = getFileExtension(request.url);
  tdExt.textContent = fileExt;
  tr.appendChild(tdExt);
  if (!isMobile) {
    // Size
    const tdSize = document.createElement("td");
    tdSize.textContent = formatSize(request.size);
    tdSize.dataset.sort =
      request.size === "unknown" ? 0 : Number(request.size) || 0;
    tr.appendChild(tdSize);
  }

  if (!isMobile) {
    // Link
    const tdLink = document.createElement("td");
    const a = document.createElement("a");
    a.href = request.url;
    a.target = "_blank";
    a.textContent = middleTruncate(request.url, 50);
    tdLink.appendChild(a);
    tr.appendChild(tdLink);

    // File Name
    const tdName = document.createElement("td");
    tdName.textContent = middleTruncate(
      request.url.split("/").pop().split("?")[0].split("#")[0],
      25,
    );
    tr.appendChild(tdName);
  } else {
    // File Name
    const tdName = document.createElement("td");
    const a = document.createElement("a");
    a.href = request.url;
    a.target = "_blank";
    a.textContent = middleTruncate(
      request.url.split("/").pop().split("?")[0].split("#")[0],
      18,
    );
    tdName.appendChild(a);
    tr.appendChild(tdName);
  }

  // Preview Button
  const tdPreview = document.createElement("td");
  if (!isFontExt(fileExt)) {
    const previewBtn = document.createElement("img");
    previewBtn.src = api.runtime.getURL(`icons/eye.svg`);
    previewBtn.style.width = "18px";
    previewBtn.style.height = "18px";
    previewBtn.style.padding = "3px";
    previewBtn.style.borderRadius = "4px";
    previewBtn.style.border = "1px solid #333";
    previewBtn.style.cursor = "pointer";
    previewBtn.style.background = "#1d1d1d";
    previewBtn.style.transition = "background 0.15s";
    previewBtn.style.flexShrink = "0";
    previewBtn.onclick = (e) => {
      e.stopPropagation(); // prevent row click
      previewFile(request.url);
    };
    tdPreview.appendChild(previewBtn);
  }

  tr.appendChild(tdPreview);
  tbody.appendChild(tr);
  applyFilters();
}

function refreshTable() {
  api.runtime.sendMessage({ type: "GET_REQUESTS_PAGE" }, (res) => {
    const requests = res?.requests || [];
    requests.forEach((r) => addRequestToTable(r));
  });
}

function applyFilters() {
  const rows = tbody.querySelectorAll("tr");
  const filters = filterContainer.querySelectorAll('input[type="checkbox"]');

  let activeExtLists = [];
  let otherIsChecked = false;

  filters.forEach((cb) => {
    if (cb.checked) {
      const cat = filterCategories.find((c) => c.id === cb.id);
      if (cat) {
        if (cat.id === "filter-other") {
          otherIsChecked = true;
        } else if (cat.exts?.length > 0) {
          activeExtLists.push(cat.exts);
        }
      }
    }
  });

  const showAll =
    document.getElementById("filter-all")?.checked ||
    (activeExtLists.length === 0 && !otherIsChecked);
  rows.forEach((row) => {
    const extCell = row.cells[2];
    let ext = extCell?.textContent?.trim()?.toLowerCase() || "";

    if (showAll) {
      row.style.display = "";
      return;
    }

    ext = ext.replace(/[^a-z0-9]/g, "");

    const matchesSpecific = activeExtLists.some((list) =>
      list.some((known) => known.toLowerCase() === ext),
    );

    const isKnown = filterCategories.some((cat) =>
      cat.exts?.some((known) => known.toLowerCase() === ext),
    );

    if (matchesSpecific) {
      row.style.display = "";
    } else if (otherIsChecked && !isKnown) {
      row.style.display = ""; // only true "Other"
    } else {
      row.style.display = "none";
    }
  });
}

// Helper to check if extension is in any category
function isKnownExtension(ext) {
  return filterCategories.some(
    (cat) => cat.id !== "filter-other" && cat.exts?.includes(ext),
  );
}
// Call initially after table is populated
// Also call after every refreshTable()
function refreshTable() {
  api.runtime.sendMessage({ type: "GET_REQUESTS_PAGE" }, (res) => {
    const requests = res?.requests || [];
    requests.forEach((r) => {
      addRequestToTable(r);
    });
    applyFilters();
  });
}

/* --------------------
Preview logic
-------------------- */
function previewFile(url) {
  previewEl.innerHTML = "";

  // --- Hide button ---
  const hideBtn = document.createElement("button");
  hideBtn.textContent = "Close Preview";
  hideBtn.style.width = "stretch";
  hideBtn.style.cursor = "pointer";
  hideBtn.style.zIndex = "999999";
  hideBtn.addEventListener("click", function onClick() {
    previewEl.style.display = "none";
    previewEl.innerHTML = "";
    hideBtn.removeEventListener("click", onClick);
  });

  const ext = getFileExtension(url);
  let maxHeight = "100%";
  if (isMobileLayout) {
    maxHeight = "40dvh";
  }
  if (url.endsWith(".m3u8") && window.Hls) {
    const video = document.createElement("video");
    video.controls = true;
    video.autoplay = true;
    video.style.width = "stretch";
    video.style.height = "stretch";
    video.style.maxHeight = maxHeight;
    previewEl.appendChild(video);
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
  } else if (["mp4", "webm", "ogg"].includes(ext)) {
    const video = document.createElement("video");
    video.controls = true;
    video.autoplay = true;
    video.style.width = "stretch";
    video.style.height = "stretch";
    video.style.maxHeight = maxHeight;
    video.src = url;
    previewEl.appendChild(video);
  } else if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) {
    const img = document.createElement("img");
    img.src = url;
    img.style.width = "stretch";
    img.style.maxHeight = maxHeight;
    img.onerror = () => {
      img.alt = "Image failed to load";
    };
    previewEl.appendChild(img);
  } else {
    const iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.style.width = "stretch";
    if (isMobileLayout) {
      iframe.style.background = "#000";
    } else {
      iframe.style.background = "#fff";
    }
    iframe.style.height = maxHeight;
    iframe.style.border = "none";
    previewEl.appendChild(iframe);
  }
  previewEl.appendChild(hideBtn);

  // Make preview visible in case it was hidden
  previewEl.style.display = "flex";
}

/* --------------------
Dynamic media & blob detection
-------------------- */
const seenMediaSrc = new Set();

function tryAddMedia(url, mediaType = "media") {
  if (
    !url ||
    typeof url !== "string" ||
    url.length < 5 ||
    seenMediaSrc.has(url) ||
    existingUrls.has(url)
  )
    return;
  // Skip very short/invalid looking urls
  if (url.startsWith("about:") || url === "data:,") return;

  seenMediaSrc.add(url);

  const fakeReq = {
    url,
    type: mediaType,
    statusCode: 200,
    size: "unknown",
  };

  addRequestToTable(fakeReq);
}

function checkMediaElement(el) {
  if (!el || el.nodeType !== 1) return;

  const tag = el.tagName.toLowerCase();

  if (el.src) tryAddMedia(el.src, tag);
  if (el.currentSrc && el.currentSrc !== el.src)
    tryAddMedia(el.currentSrc, tag + "_current");
  if (el.poster) tryAddMedia(el.poster, "poster");
  if (el.srcset) {
    // Take first candidate as approximation
    const firstSrc = el.srcset.split(",")[0]?.trim().split(" ")[0];
    if (firstSrc) tryAddMedia(firstSrc, tag + "_srcset");
  }
  if (tag === "source" || tag === "track") {
    if (el.src) tryAddMedia(el.src, tag);
  }
  if (el.srcObject instanceof MediaStream) {
    tryAddMedia("[MediaStream – no direct URL]", "stream");
  }
}

/* --------------------
Monitor URL.createObjectURL calls (for blob: URLs from JS)
-------------------- */
function injectBlobMonitor() {
  const script = document.createElement("script");
  script.src = api.runtime.getURL("blobMonitor.js");
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);
}

function injectNetworkHook() {
  const script = document.createElement("script");
  script.src = api.runtime.getURL("networkHook.js");
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);
}

function injectMSEHook() {
  const script = document.createElement("script");
  script.src = api.runtime.getURL("mseHook.js");
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);
}

function showApproval(url, reqType) {
  const box = document.createElement("div");
  box.style.background = "#222";
  box.style.color = "#fff";
  box.style.border = "1px solid #555";
  box.style.borderRadius = "4px";
  box.style.padding = "4px";
  box.style.fontSize = "12px";
  box.style.maxWidth = "250px";
  box.style.wordBreak = "break-word";

  const text = document.createElement("div");
  text.textContent = `${reqType === "REQUEST_REDIRECT" ? "Redirect" : "Popup"} requested:\n${url}`;
  box.appendChild(text);

  const btnContainer = document.createElement("div");
  btnContainer.style.display = "flex";
  btnContainer.style.gap = "4px";
  btnContainer.style.marginTop = "4px";

  const allowBtn = document.createElement("button");
  allowBtn.textContent = "Allow";
  allowBtn.style.flex = "1";
  allowBtn.onclick = () => respond(true);

  const denyBtn = document.createElement("button");
  denyBtn.textContent = "Deny";
  denyBtn.style.flex = "1";
  denyBtn.onclick = () => respond(false);

  btnContainer.append(allowBtn, denyBtn);
  box.appendChild(btnContainer);
  approvalContainer.appendChild(box);

  function respond(allow) {
    api.runtime.sendMessage({ type: "REDIRECT_POPUP_RESPONSE", url, allow });
    approvalContainer.removeChild(box);
  }
}

function scrapeLinksFromPage() {
  const urls = new Set();

  function add(url) {
    if (!url || typeof url !== "string") return;
    if (url.startsWith("javascript:")) return;

    try {
      const absolute = new URL(url, location.href).href;
      urls.add(absolute);
    } catch {
      urls.add(url);
    }
  }

  /* --------------------
     Standard elements
  -------------------- */

  document.querySelectorAll("a[href]").forEach((el) => add(el.href));

  document
    .querySelectorAll("img, video, audio, source, track")
    .forEach((el) => {
      if (el.src) add(el.src);
      if (el.currentSrc) add(el.currentSrc);
      if (el.poster) add(el.poster);
    });

  document.querySelectorAll("link[href]").forEach((el) => add(el.href));

  /* --------------------
     srcset images
  -------------------- */

  document.querySelectorAll("[srcset]").forEach((el) => {
    el.srcset.split(",").forEach((part) => {
      const url = part.trim().split(" ")[0];
      add(url);
    });
  });

  /* --------------------
     Lazy loading attributes
  -------------------- */

  const lazyAttrs = [
    "data-src",
    "data-srcset",
    "data-lazy",
    "data-original",
    "data-url",
    "data-image",
    "data-bg",
    "data-background",
  ];

  lazyAttrs.forEach((attr) => {
    document.querySelectorAll(`[${attr}]`).forEach((el) => {
      add(el.getAttribute(attr));
    });
  });

  /* --------------------
     CSS background images
  -------------------- */

  document.querySelectorAll("*").forEach((el) => {
    const style = getComputedStyle(el);
    const bg = style.backgroundImage;

    if (bg && bg !== "none") {
      const match = bg.match(/url\(["']?(.*?)["']?\)/);
      if (match && match[1]) add(match[1]);
    }
  });

  /* --------------------
     Script URLs
  -------------------- */

  document.querySelectorAll("script").forEach((script) => {
    if (script.src) {
      add(script.src);
    } else if (script.textContent) {
      const matches = script.textContent.match(/https?:\/\/[^\s"'<>]+/g);
      matches?.forEach(add);
    }
  });

  /* --------------------
     FULL HTML scan
  -------------------- */

  const html = document.documentElement.outerHTML;

  const matches = html.match(
    /(https?:\/\/[^\s"'<>]+|\/[a-zA-Z0-9_\-\/\.]+\.(jpg|jpeg|png|gif|webp|mp4|webm|mp3|m4a|css|js|json|m3u8|pdf|zip|rar))/gi,
  );

  matches?.forEach(add);

  /* --------------------
     CSS stylesheet scanning
  -------------------- */

  for (const sheet of document.styleSheets) {
    let rules;

    try {
      rules = sheet.cssRules;
    } catch {
      continue; // cross-origin stylesheet
    }

    if (!rules) continue;

    for (const rule of rules) {
      const text = rule.cssText;

      const found = text.match(/url\(["']?(.*?)["']?\)/g);

      found?.forEach((entry) => {
        const url = entry.replace(/url\(["']?|["']?\)/g, "");
        add(url);
      });
    }
  }

  /* --------------------
     Performance API scan
  -------------------- */

  if (performance?.getEntriesByType) {
    const resources = performance.getEntriesByType("resource");

    resources.forEach((r) => {
      if (r.name) add(r.name);
    });
  }

  return Array.from(urls);
}

function renderButtonsForRow(row, status) {
  const btnContainer =
    row.querySelector('div[style*="display: flex; gap: 4px"]') ||
    row.querySelector("div"); // fallback

  if (!btnContainer) return;

  btnContainer.innerHTML = "";

  if (status === "queued") {
    const start = document.createElement("button");
    start.textContent = "Start";
    start.onclick = () => {
      api.runtime.sendMessage({
        type: "QUEUE_SINGLE",
        url: row.dataset.url || "",
      });
      renderButtonsForRow(row, "in_progress");
    };

    const cancel = document.createElement("button");
    cancel.textContent = "Cancel";
    cancel.onclick = () => {
      managerContent.removeChild(row);
      delete activeDownloads[row.dataset.downloadId];
    };

    btnContainer.append(start, cancel);
  } else if (status === "in_progress") {
    const pause = document.createElement("button");
    pause.textContent = "Pause";
    pause.onclick = () => {
      api.runtime.sendMessage({
        type: "PAUSE_DOWNLOAD",
        downloadId: row.dataset.downloadId,
      });
      renderButtonsForRow(row, "paused");
    };

    const cancel = document.createElement("button");
    cancel.textContent = "Cancel";
    cancel.onclick = () => {
      api.runtime.sendMessage({
        type: "CANCEL_DOWNLOAD",
        downloadId: row.dataset.downloadId,
      });
      managerContent.removeChild(row);
      delete activeDownloads[row.dataset.downloadId];
    };

    btnContainer.append(pause, cancel);
  } else if (status === "paused") {
    const resume = document.createElement("button");
    resume.textContent = "Resume";
    resume.onclick = () => {
      api.runtime.sendMessage({
        type: "RESUME_DOWNLOAD",
        downloadId: row.dataset.downloadId,
      });
      renderButtonsForRow(row, "in_progress");
    };

    const cancel = document.createElement("button");
    cancel.textContent = "Cancel";
    cancel.onclick = () => {
      managerContent.removeChild(row);
      delete activeDownloads[row.dataset.downloadId];
    };

    btnContainer.append(resume, cancel);
  } else if (status === "complete") {
    const done = document.createElement("button");
    done.textContent = "Done";
    done.onclick = () => {
      managerContent.removeChild(row);
      delete activeDownloads[row.dataset.downloadId];
    };
    btnContainer.appendChild(done);
  }
}
function addDownloadToManager(downloadId, url, initialStatus = "queued") {
  const row = document.createElement("div");
  row.style.display = "flex";
  row.style.flexDirection = "column";
  row.style.padding = "4px 0";
  row.dataset.downloadId = downloadId;

  const topRow = document.createElement("div");
  topRow.style.display = "flex";
  topRow.style.justifyContent = "space-between";
  topRow.style.alignItems = "center";
  topRow.style.gap = "20px";

  const name = document.createElement("span");
  name.textContent = url.split("/").pop().split("?")[0];
  name.style.flex = "1";
  name.style.marginRight = "4px";

  const btnContainer = document.createElement("div");
  btnContainer.style.display = "flex";
  btnContainer.style.gap = "4px";

  const info = document.createElement("div");
  info.style.fontSize = "11px";
  info.style.opacity = "0.8";
  info.textContent = "Waiting...";

  const progress = document.createElement("progress");
  progress.value = 0;
  progress.max = 100;
  progress.style.width = "100px";

  // Create wrappers
  const leftCol = document.createElement("div");
  const rightCol = document.createElement("div");
  topRow.style.border = "1px solid #333";
  topRow.style.padding = "10px";

  leftCol.style.display = "flex";
  rightCol.style.display = "flex";
  leftCol.style.width = "100%";
  rightCol.style.width = "100%";
  leftCol.style.justifyContent = "space-between";
  rightCol.style.justifyContent = "space-between";
  leftCol.style.alignItems = "center";
  rightCol.style.alignItems = "center";
  if (isMobileLayout) {
    topRow.style.flexDirection = "column";
  }
  // Put name + info into leftCol
  leftCol.append(name, info);

  // Put progress + btnContainer into rightCol
  rightCol.append(progress, btnContainer);

  // Now append the two columns into the top row
  topRow.append(leftCol, rightCol);

  row.append(topRow);

  // Buttons
  const startBtn = document.createElement("button");
  startBtn.textContent = "Start";

  const pauseBtn = document.createElement("button");
  pauseBtn.textContent = "Pause";

  const resumeBtn = document.createElement("button");
  resumeBtn.textContent = "Resume";

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";

  const completeBtn = document.createElement("button");
  completeBtn.textContent = "Download Complete";

  // Render correct buttons
  function renderButtons(status) {
    btnContainer.innerHTML = "";

    switch (status) {
      case "queued":
        btnContainer.append(startBtn, cancelBtn);
        break;

      case "in_progress":
        btnContainer.append(pauseBtn, cancelBtn);
        break;

      case "paused":
        btnContainer.append(resumeBtn, cancelBtn);
        break;

      case "complete":
        btnContainer.append(completeBtn);
        break;
    }
  }

  renderButtons(initialStatus);

  // Button events
  startBtn.onclick = (e) => {
    e.stopPropagation();
    api.runtime.sendMessage({ type: "QUEUE_SINGLE", url });
    renderButtons("in_progress");
  };

  pauseBtn.onclick = (e) => {
    e.stopPropagation();
    api.runtime.sendMessage({ type: "PAUSE_DOWNLOAD", downloadId });
    renderButtons("paused");
  };

  resumeBtn.onclick = (e) => {
    e.stopPropagation();
    api.runtime.sendMessage({ type: "RESUME_DOWNLOAD", downloadId });
    renderButtons("in_progress");
  };

  cancelBtn.onclick = (e) => {
    e.stopPropagation();
    api.runtime.sendMessage({ type: "CANCEL_DOWNLOAD", downloadId });
    managerContent.removeChild(row);
    delete activeDownloads[downloadId];
  };

  completeBtn.onclick = (e) => {
    e.stopPropagation();
    managerContent.removeChild(row);
    delete activeDownloads[downloadId];
  };

  managerContent.appendChild(row);

  activeDownloads[downloadId] = {
    row,
    url,
    status: initialStatus,
    progress,
    info,
  };
  // Make sure buttons can find the downloadId even in closures
  startBtn.dataset.downloadId = downloadId;
  pauseBtn.dataset.downloadId = downloadId;
  resumeBtn.dataset.downloadId = downloadId;
  cancelBtn.dataset.downloadId = downloadId;
  completeBtn.dataset.downloadId = downloadId;
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
}
