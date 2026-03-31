api.storage.local.get({ trackerSettings: {} }, (res) => {
  const settings = res.trackerSettings || {};
  //if (!isMobileLayout) {
  if (!settings[domain]) return; // tracker disabled → stop here
  //}

  // Create host container (file tracker)
  host.id = "bc-host";
  host.style.position = "fixed";
  host.style.bottom = "10px";
  host.style.right = "10px";
  host.style.zIndex = "2147483600";
  document.documentElement.appendChild(host);

  // Shadow root & styles

  style.textContent = `
  :host {
    font-size: 16px;
    font-family: 'system-ui';
    color: white;
    line-height: normal;
  }

  .panel,
  .panel *,
  .header,
  .content,
  .mainRow,
  .tableWrapper,
  table,
  th,
  td,
  .preview,
  .buttons,
  button,
  a {
    font-family: 'system-ui';
    font-size: 12px !important;
    color: white !important;
    line-height: 1.4 !important;
    letter-spacing: normal !important;
  }

  .panel {
    max-height: 94dvh;
    max-width: 94dvw;
background: #151515;
    color: #e6e6e6;
    border: 1px solid #2a2a2a;
    border-radius: 10px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, .6);
    display: flex;
    flex-direction: column;
  }

  .header {
    padding: 6px;
    background: #111;
    cursor: pointer;
    font-weight: bold;
    user-select: none;
    border-radius: 8px;
  }

  .content {
    flex: 1;
    display: none;
    flex-direction: column;
    gap: 4px;
    overflow: hidden;
    padding: 4px;
  }

  .mainRow {
    flex: 1;
    display: flex;
    gap: 4px;
    overflow: hidden;
  }

  .tableWrapper {
    flex: 1;
    overflow: auto;
  }
table {
    width: 100%;
    border-collapse: collapse;
    font-family: 'system-ui';
    font-size: 13px;
    color: #eee;
  }
  th, td {
      padding: 4px 8px;
    border-bottom: 1px solid #444;
    text-align: left;
  }
  th {
    background-color: #222;
    cursor: pointer;
  }
    thead th {
  position: sticky;
  top: 0;
  background: #2a2a2a;
  color: #fff;
  z-index: 10;
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #444;
  box-shadow: 0 2px 0 #111;
}
  tbody tr:nth-child(even) {
  background: #1b1b1b;
}
  tr:hover {
    background-color: #333;
  }
  a {
    color: #4ea1ff;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }

  #preview {
    margin-top: 8px;
  }
  /* Checkbox highlight */
  tr.selected {
    background-color: #2c3e50 !important;
  }



  .preview {
    width: 240px;
    border: 1px solid #2a2a2a;
    border-radius: 4px;
    background: #000;
    align-content: center;
    display: none;
    flex-direction: column;
    justify-content: end;
  }

  .buttons {
    padding: 4px;
    display: flex;
    gap: 4px;
    justify-content: space-between;
    border-top: 1px solid #555;
  }

  #bc-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 6px 8px;
  border-bottom: 1px solid #444;
}

.bc-filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;

  font-size: 12px;
  padding: 4px 8px;

  border-radius: 4px;
  border: 1px solid #555;

  background: #2a2a2a;
  color: #ddd;

  cursor: pointer;
  user-select: none;
}

.bc-filter-btn:hover {
  background: #333;
}

.bc-filter-btn.active {
  background: #0b5ed7;
  border-color: #0b5ed7;
  color: white;
}

.bc-filter-icon {
  width: 14px;
  height: 14px;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #1e1e1e;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 5px;
  border: 2px solid #1e1e1e;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #888;
}

* {
  scrollbar-width: thin;
  scrollbar-color: #555 #1e1e1e;
}

    .mainHeaderButtons, .managerButtons{
    display:flex;
    gap:6px;
  }

  #mainPanelToggleBtn, #blockClose, button {
    background:#1d1d1d;
    border:1px solid #333;
    color:#bbb;
    padding:3px 8px;
    border-radius:4px;
    cursor:pointer;
  }
  .panel .header span, .header span {
  font-size: 15px !important;
  padding-right: 10px;
  color: #e6e6e6 !important;
  }

  .buttons {
  display: flex;
  gap: 8px;
}

.buttons button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  white-space: nowrap;
  cursor: pointer;
}

.buttons button img {
  width: 24px;
  height: 24px;
  vertical-align: middle;
}

  #toast-root {
  position: fixed;
  z-index: 2147483647;
  pointer-events: none;
}

.toast-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
}

.toast {
  min-width: 220px;
  max-width: 320px;
  background: #1e1e1e;
  color: #fff;
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  pointer-events: auto;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.2s ease;
}

.toast.show {
  opacity: 1;
  transform: translateY(0);
}

.toast-icon {
  width: 18px;
  height: 18px;
}

.toast-close {
  margin-left: auto;
  cursor: pointer;
  opacity: 0.6;
}

.toast-close:hover {
  opacity: 1;
}

/* Types */
.toast.success { background: #1f7a3a; }
.toast.error   { background: #7a1f1f; }
.toast.warning { background: #7a5a1f; }
.toast.info    { background: #1f3a7a; }

/* Positions */
.toast-top       { top: 0; left: 0; right: 0; display: flex; justify-content: center; }
.toast-bottom    { bottom: 0; left: 0; right: 0; display: flex; justify-content: center; }
.toast-top-left  { top: 0; left: 0; }
.toast-top-right { top: 0; right: 0; }
.toast-bottom-left  { bottom: 0; left: 0; }
.toast-bottom-right { bottom: 0; right: 0; }
`;

  shadow.appendChild(style);

  // Panel HTML

  panel.className = "panel";

  shadow.appendChild(panel);

  // Main header
  header.className = "header";
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";

  const iconElement = document.createElement("img");
  iconElement.src = api.runtime.getURL("icons/icon128.png");
  iconElement.className = "webassetx-icon";
  iconElement.style.height = "45px";
  iconElement.style.paddingRight = "8px";
  // Title
  const mainHeaderTitle = document.createElement("span");
  mainHeaderTitle.textContent = "";
  mainHeaderTitle.style.display = "none";

  // Buttons container
  const mainHeaderButtons = document.createElement("div");
  mainHeaderButtons.className = "mainHeaderButtons";

  // Button
  const mainHeaderBtn = document.createElement("button");
  mainHeaderBtn.id = "mainPanelToggleBtn";

  // Image
  const mainHeaderImg = document.createElement("img");
  mainHeaderImg.id = "mainPanelToggleImg";
  mainHeaderImg.style.width = "16px";
  mainHeaderImg.src = api.runtime.getURL("icons/expand.svg");

  // Button
  const dragBtn = document.createElement("button");
  dragBtn.id = "dragBtn";
  dragBtn.style.background = "none";
  dragBtn.style.border = "none";
  dragBtn.style.cursor = "drag";
  // Image
  const dragBtnImg = document.createElement("img");
  dragBtnImg.id = "dragBtnImg";
  dragBtnImg.style.width = "16px";
  dragBtnImg.src = api.runtime.getURL("icons/grip.svg");

  // Build
  mainHeaderBtn.appendChild(mainHeaderImg);
  dragBtn.appendChild(dragBtnImg);

  mainHeaderButtons.appendChild(mainHeaderBtn);
  mainHeaderButtons.appendChild(dragBtn);

  // Append
  header.appendChild(iconElement);
  header.appendChild(mainHeaderTitle);
  header.appendChild(mainHeaderButtons);

  panel.appendChild(header);

  content.className = "content";
  panel.appendChild(content);

  mainRow.className = "mainRow";
  content.appendChild(mainRow);

  tableWrapper.className = "tableWrapper";
  mainRow.appendChild(tableWrapper);

  tableWrapper.appendChild(table);

  headers.forEach((h) => {
    const th = document.createElement("th");
    th.textContent = h;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  table.appendChild(tbody);

  /* preview element */
  previewEl.className = "preview";
  if (isMobileLayout) {
    previewEl.style.width = "unset";
    content.prepend(previewEl);
  } else {
    mainRow.appendChild(previewEl);
  }
  /* buttons */
  btnContainer.className = "buttons";
  content.appendChild(btnContainer);

  scrapeBtn.id = "scrapeLinks";

  function setButtonContent(btn, iconName, label) {
    btn.innerHTML = ""; // clear safely

    const img = document.createElement("img");
    img.src = api.runtime.getURL(`icons/${iconName}.svg`);
    img.style.width = "24px";
    img.style.maxHeight = "24px";
    if (label !== "") {
      img.style.marginRight = "6px";
    }
    img.style.verticalAlign = "middle";

    const text = document.createElement("span");
    text.textContent = label;
    if (label === "") {
      text.style.display = "none";
    }
    btn.appendChild(img);
    btn.appendChild(text);
  }
  if (isMobileLayout) {
    setButtonContent(toggleManagerBtn, "bars-progress", "");

    setButtonContent(scrapeBtn, "link", "");

    setButtonContent(downloadBtn, "download", "");

    setButtonContent(copyBtn, "clipboard-list-check", "");

    setButtonContent(clearBtn, "trash-list", "");
  } else {
    setButtonContent(toggleManagerBtn, "bars-progress", "Download Manager");

    setButtonContent(scrapeBtn, "link", "Scrape Page Links");

    setButtonContent(downloadBtn, "download", "Download Selected");

    setButtonContent(copyBtn, "clipboard-list-check", "Copy URLs");

    setButtonContent(clearBtn, "trash-list", "Clear List");
  }

  btnContainer.prepend(toggleManagerBtn); // or append wherever you want

  btnContainer.append(
    toggleManagerBtn,
    scrapeBtn,
    downloadBtn,
    copyBtn,
    clearBtn,
  );

  managerDiv.style.position = "fixed";
  managerDiv.style.bottom = "60px";
  managerDiv.style.right = "10px";
  managerDiv.style.maxHeight = "400px";
  managerDiv.style.color = "#e6e6e6";
  managerDiv.style.boxShadow = "0 8px 30px rgba(0, 0, 0, .6)";
  managerDiv.style.background = "#151515";
  managerDiv.style.border = "1px solid #2a2a2a";
  managerDiv.style.borderRadius = "10px";
  managerDiv.style.display = "none";
  managerDiv.style.zIndex = "2147483647";
  managerDiv.style.display = "none";
  managerDiv.style.flexDirection = "column";
  if (isMobileLayout) {
    managerDiv.style.width = "94dvw";
  } else {
    managerDiv.style.width = "50dvw";
    managerDiv.style.maxWidth = "94dvw";
  }
  shadow.appendChild(managerDiv);

  // Header
  managerHeader.className = "header";
  managerHeader.style.borderRadius = "8px";
  managerHeader.style.display = "flex";
  managerHeader.style.justifyContent = "space-between";
  managerHeader.style.alignItems = "center";

  // Set text without wiping children later
  const title = document.createElement("span");
  title.textContent = "WebAssetX - Download Manager";

  // Buttons container
  const managerButtons = document.createElement("div");
  managerButtons.className = "managerButtons";

  // Button
  const managerButton = document.createElement("button");
  managerButton.id = "blockClose";

  // Image
  const managerButtonImg = document.createElement("img");
  managerButtonImg.id = "minMaxImage";
  managerButtonImg.style.width = "16px";
  managerButtonImg.src = api.runtime.getURL("icons/compress.svg");

  // Build structure
  managerButton.appendChild(managerButtonImg);
  managerButtons.appendChild(managerButton);

  // Append to header

  managerHeader.appendChild(title);
  managerHeader.appendChild(managerButtons);

  /* Content area */
  managerContent.style.flex = "1";
  managerContent.style.overflowY = "auto";
  managerContent.style.padding = "4px";

  /* Toggle open/close like the file tracker */
  managerButton.onclick = () => {
    const isHidden = getComputedStyle(managerContent).display === "none";

    if (isHidden) {
      managerContent.style.display = "flex";
      managerButtonImg.src = api.runtime.getURL("icons/compress.svg");
    } else {
      managerContent.style.display = "none";
      managerButtonImg.src = api.runtime.getURL("icons/expand.svg");
    }
  };

  managerDiv.appendChild(managerHeader);
  managerDiv.appendChild(managerContent);

  // Filter controls (above buttons)
  filterContainer.className = "filters";
  filterContainer.id = "bc-filters";
  filterContainer.style.padding = "6px 4px";
  filterContainer.style.borderBottom = "1px solid #555";
  filterContainer.style.display = "flex";
  filterContainer.style.flexWrap = "wrap";
  if (isMobileLayout) {
    filterContainer.style.justifyContent = "space-between";
  } else {
    filterContainer.style.gap = "12px";
  }
  filterContainer.style.fontSize = "11px";

  filterCategories.forEach((cat) => {
    const label = document.createElement("label");
    label.style.display = "flex";
    label.style.alignItems = "center";
    label.style.justifyContent = "center";
    label.style.whiteSpace = "nowrap";
    label.style.cursor = "pointer";

    // Hover text
    label.title = cat.label;

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.id = cat.id;
    cb.checked = cat.checked ?? false;

    // hide checkbox but keep functionality
    cb.style.display = "none";

    // Icon
    const icon = document.createElement("img");
    icon.src = api.runtime.getURL(`icons/${cat.icon}`);

    icon.style.width = "18px";
    icon.style.height = "18px";
    icon.style.padding = "3px";
    icon.style.borderRadius = "4px";
    icon.style.background = cb.checked ? "#0b5ed7" : "#857e7e";
    icon.style.transition = "background 0.15s";

    icon.style.flexShrink = "0";

    label.appendChild(cb);
    label.appendChild(icon);

    filterContainer.appendChild(label);

    // Listen for changes
    cb.addEventListener("change", () => {
      icon.style.background = cb.checked ? "#0b5ed7" : "#857e7e";
      applyFilters();
    });
  });

  // If "All" is checked uncheck others
  const allCb = filterContainer.querySelector("#filter-all");
  allCb.addEventListener("change", () => {
    if (allCb.checked) {
      filterContainer
        .querySelectorAll('input[type="checkbox"]:not(#filter-all)')
        .forEach((c) => (c.checked = false));
    }
    applyFilters();
  });

  // Prevent unchecking all force "All" on if nothing selected
  filterContainer.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    cb.addEventListener("change", () => {
      const anyChecked = [
        ...filterContainer.querySelectorAll(
          'input[type="checkbox"]:not(#filter-all)',
        ),
      ].some((c) => c.checked);

      if (!anyChecked && !allCb.checked) {
        allCb.checked = true;
      }

      // --- Get label title ---
      let titleText = "";
      let lbl = cb.closest("label");

      if (lbl && lbl.title) {
        titleText = lbl.title.trim();
      } else {
        // fallback for <label for="id" title="...">
        const forLbl = filterContainer.querySelector(`label[for="${cb.id}"]`);
        if (forLbl && forLbl.title) {
          titleText = forLbl.title.trim();
        }
      }

      // --- Determine applied / removed ---
      const status = cb.checked ? "Applied" : "Removed";

      Toast.show(`${titleText} Filter ${status}`, {
        type: "info",
        position: "top",
        duration: 1000,
      });

      applyFilters();
    });
  });

  content.insertBefore(filterContainer, btnContainer);
  content.style.display = "none";

  /* toggle panel */
  let mainPanelOpen = false;
  let dragBottom = "10px";
  let dragRight = "10px";

  let isDragging = false;
  let offsetBottom, offsetRight;

  const getCoords = (e) => (e.touches ? e.touches[0] : e);

  const startDrag = (e) => {
    isDragging = true;
    const coords = getCoords(e);
    const rect = host.getBoundingClientRect();

    // Calculate the distance from the Mouse to the Bottom and Right edges of the host
    // window.innerHeight - rect.bottom = distance from viewport bottom to host bottom
    offsetBottom =
      window.innerHeight - coords.clientY - (window.innerHeight - rect.bottom);
    offsetRight =
      window.innerWidth - coords.clientX - (window.innerWidth - rect.right);

    document.body.style.userSelect = "none";
    if (e.type === "touchstart") e.preventDefault();
  };

  const moveDrag = (e) => {
    if (!isDragging) return;
    const coords = getCoords(e);

    // New position = (Distance from screen edge to mouse) - (Initial click offset)
    let b = window.innerHeight - coords.clientY - offsetBottom;
    let r = window.innerWidth - coords.clientX - offsetRight;

    // Viewport boundaries (Keep it on screen)
    b = Math.max(0, Math.min(b, window.innerHeight - host.offsetHeight));
    r = Math.max(0, Math.min(r, window.innerWidth - host.offsetWidth));

    host.style.bottom = b + "px";
    host.style.right = r + "px";
    dragBottom = b + "px";
    dragRight = r + "px";
  };

  const stopDrag = () => {
    isDragging = false;
    document.body.style.userSelect = "auto";
  };

  // Listeners
  dragBtn.addEventListener("mousedown", startDrag);
  dragBtn.addEventListener("touchstart", startDrag, { passive: false });

  window.addEventListener("mousemove", moveDrag);
  window.addEventListener("touchmove", moveDrag, { passive: false });
  window.addEventListener("mouseup", stopDrag);
  window.addEventListener("touchend", stopDrag);

  mainHeaderBtn.onclick = () => {
    mainPanelOpen = !mainPanelOpen;

    content.style.display = mainPanelOpen ? "flex" : "none";

    if (isMobileLayout) {
      panel.style.width = mainPanelOpen ? "94dvw" : "initial";
    }
    mainHeaderImg.src = api.runtime.getURL(
      mainPanelOpen ? "icons/compress.svg" : "icons/expand.svg",
    );
    dragBtn.style.display = mainPanelOpen ? "none" : "flex";

    host.style.bottom = mainPanelOpen ? "10px" : dragBottom;
    host.style.right = mainPanelOpen ? "10px" : dragRight;
    mainHeaderTitle.style.display = mainPanelOpen ? "block" : "none";
    mainHeaderTitle.textContent = mainPanelOpen ? "WebAssetX - by BadCase" : "";
  };
  /* --------------------
Sorting
-------------------- */
  headerRow.querySelectorAll("th").forEach((th, i) => {
    if (i > 0) {
      th.onclick = () => {
        const headerText = th.textContent.trim();
        sortTable(i, headerText);
      };
    }
  });

  /* --------------------
Refresh table
-------------------- */

  // Also call on initial load if needed
  setTimeout(applyFilters, 1000); // safety net

  /* --------------------
Auto refresh from network requests
-------------------- */
  setInterval(() => {
    if (content.style.display !== "none") refreshTable();
  }, 1500);

  /* --------------------
Buttons
-------------------- */

  toggleManagerBtn.onclick = () => {
    Toast.show(
      managerDiv.style.display === "none"
        ? "Download Manager Opened"
        : "Download Manager Closed",
      {
        type: "info",
        position: "top",
        duration: 1000,
      },
    );
    managerDiv.style.display =
      managerDiv.style.display === "none" ? "block" : "none";
  };

  scrapeBtn.addEventListener("click", () => {
    const confirmed = confirm("Scrape links from HTML, CSS, and JS?");

    if (!confirmed) return;
    const links = scrapeLinksFromPage();
    Toast.success(links.length + " Links Scraped");

    links.forEach((url) => tryAddMedia(url, "scraped"));
  });

  downloadBtn.onclick = async () => {
    const urls = [...tbody.rows]
      .map((r) => {
        const cb = r.cells[0].querySelector("input");
        let cellNum = 4;
        if (isMobileLayout) {
          cellNum = 3;
        }
        return cb?.checked ? r.cells[cellNum].querySelector("a")?.href : null;
      })
      .filter(Boolean);
    if (!urls.length) {
      Toast.error("No Files Selected");
    }

    if (!urls.length) return;

    // Send to background to queue downloads
    api.runtime.sendMessage({ type: "queueMultiple", urls }, (response) => {
      if (!Array.isArray(response)) return;

      // Only keep the downloads that match our selected URLs
      response
        .filter((item) => urls.includes(item.url))
        .forEach(({ downloadId, url }) => {
          addDownloadToManager(downloadId, url);
        });
    });
    // Uncheck all boxes after queueing
    [...tbody.rows].forEach((r) => {
      const cb = r.cells[0].querySelector("input");
      if (cb) cb.checked = false;
    });
    Toast.success(urls.length + " URLs Queued");
  };

  copyBtn.onclick = () => {
    const urls = [...tbody.rows]
      .map((r) => {
        const cb = r.cells[0].querySelector("input");
        let cellNum = 4;
        if (isMobileLayout) {
          cellNum = 3;
        }
        return cb?.checked ? r.cells[cellNum].querySelector("a")?.href : null;
      })
      .filter(Boolean)
      .join("\n");
    if (urls) {
      navigator.clipboard.writeText(urls).then(() => {
        Toast.success("Copied " + urls.split("\n").length + " URLs");
      });
    } else {
      Toast.error("No Files Selected");
    }
  };

  clearBtn.onclick = () => {
    const confirmed = confirm("Are you sure you want to clear the list?");

    if (!confirmed) return;
    Toast.success("File List Cleared");

    api.runtime.sendMessage({ type: "CLEAR_REQUESTS" });
    existingUrls.clear();
    tbody.innerHTML = "";
    previewEl.innerHTML = "";
  };

  /* --------------------
Per-tab visibility control
-------------------- */
  api.runtime.onMessage.addListener((msg) => {
    if (msg.type === "TOGGLE_BC_HOST") {
      host.style.display = msg.enabled ? "block" : "none";
    }
  });

  // Ask for initial per-tab state
  api.runtime.sendMessage({ type: "GET_TOGGLE_STATE" }, (response) => {
    host.style.display = response?.enabled !== false ? "block" : "none";
  });

  /* --------------------
Dynamic media & blob detection
-------------------- */

  const mediaObserver = new MutationObserver((mutations) => {
    for (const mut of mutations) {
      // Handle added nodes
      if (mut.type === "childList") {
        for (const node of mut.addedNodes || []) {
          if (node.nodeType !== 1) continue;
          if (node.matches("video, audio, source, track, img, video[poster]")) {
            checkMediaElement(node);
          }
          node
            .querySelectorAll?.("video, audio, source, track, img")
            .forEach(checkMediaElement);
        }
      }

      // Handle attribute changes
      if (mut.type === "attributes" && mut.target?.nodeType === 1) {
        if (
          mut.target.matches("video, audio, source, track, img, video[poster]")
        ) {
          checkMediaElement(mut.target);
        }
      }
    }
  });

  mediaObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["src", "currentSrc", "srcset", "poster"],
  });

  // Initial scan for already present elements
  document
    .querySelectorAll("video, audio, source, track, img, video[poster]")
    .forEach(checkMediaElement);

  injectBlobMonitor();

  injectNetworkHook();

  // run alongside blob/network hooks
  injectMSEHook();

  window.addEventListener(
    "bc-network-request",
    (e) => {
      const { url, type } = e.detail || {};

      if (!url) return;

      tryAddMedia(url, type);
    },
    false,
  );

  // Listen for blob URLs created in main world
  window.addEventListener(
    "bc-blob-url-created",
    (e) => {
      const { url, mime } = e.detail || {};
      if (url?.startsWith("blob:")) {
        let type = mime?.startsWith("video/")
          ? "blob_video"
          : mime?.startsWith("audio/")
            ? "blob_audio"
            : mime?.startsWith("image/")
              ? "blob_image"
              : "blob";
        if (isMobileLayout) {
          type = mime?.startsWith("video/")
            ? "b_video"
            : mime?.startsWith("audio/")
              ? "b_audio"
              : mime?.startsWith("image/")
                ? "b_image"
                : "blob";
        }
        tryAddMedia(url, type);
      }
    },
    false,
  );

  /* --------------------
Approval overlay
-------------------- */
  approvalContainer.style.position = "fixed";
  approvalContainer.style.top = "10px";
  approvalContainer.style.right = "10px";
  approvalContainer.style.zIndex = "2147483648";
  approvalContainer.style.display = "flex";
  approvalContainer.style.flexDirection = "column";
  approvalContainer.style.gap = "4px";
  shadow.appendChild(approvalContainer);

  api.runtime.onMessage.addListener((msg) => {
    if (msg.type === "SHOW_APPROVAL_UI") showApproval(msg.url, msg.reqType);
  });

  // ────────────────────────────────────────────────
  // Unified message listener for downloads
  // ────────────────────────────────────────────────
  api.runtime.onMessage.addListener((msg) => {
    if (msg.action === "scrapeLinks") {
      const links = scrapeLinksFromPage();
      links.forEach((url) => tryAddMedia(url, "scraped"));
      return;
    }

    // ── Download manager messages ──
    if (msg.type === "DOWNLOAD_STARTED") {
      let item = Object.values(activeDownloads).find((d) => d.url === msg.url);
      if (item) {
        // update placeholder row with real downloadId
        delete activeDownloads[item.row.dataset.downloadId]; // remove old fake key
        item.row.dataset.downloadId = msg.downloadId;
        activeDownloads[msg.downloadId] = item;
        item.status = "in_progress";
        renderButtonsForRow(item.row, "in_progress");
        item.info.textContent = "Starting...";
      } else {
        // New download (no prior row)
        addDownloadToManager(msg.downloadId, msg.url, "in_progress");
      }
    } else if (msg.type === "DOWNLOAD_STATUS") {
      const item = activeDownloads[msg.downloadId];
      if (!item) return;

      item.status = msg.state;

      renderButtonsForRow(item.row, msg.state);

      if (msg.state === "complete") {
        item.progress.value = 100;
        item.info.textContent = "Download Complete";
        Toast.success("Download Complete");
        renderButtonsForRow(item.row, msg.state);
      } else if (msg.state === "interrupted") {
        item.info.textContent = "Download interrupted or failed";
        item.progress.value = item.progress.value;
      } else if (msg.state === "paused") {
        item.info.textContent = "Paused";
      }
    } else if (msg.type === "DOWNLOAD_PROGRESS") {
      const item = activeDownloads[msg.id];
      if (!item) return;

      const received = msg.received || 0;
      const total = msg.total || 0;
      let percent = 0;

      if (total > 0) {
        percent = Math.min(100, Math.floor((received / total) * 100));
      }

      item.progress.value = percent;

      let text = formatBytes(received);
      if (total > 0) {
        text += ` / ${formatBytes(total)} (${percent}%)`;
      } else {
        text += " • unknown size";
      }

      if (percent === 100 && msg.state !== "complete") {
        text += " • finalizing...";
      }

      item.info.textContent = text;
    } else if (msg.type === "DOWNLOAD_FAILED") {
      const item = Object.values(activeDownloads).find(
        (d) => d.url === msg.url,
      );
      if (item) {
        item.info.textContent = `Failed: ${msg.error || "Unknown error"}`;
        renderButtonsForRow(item.row, "complete"); // or add error state
      }
    }
  });
});

// ------------------------
// Toast system for WebAssetX
// ------------------------
const Toast = (() => {
  const icons = {
    success: api.runtime.getURL("icons/badge-check-white.svg"),
    error: api.runtime.getURL("icons/diamond-exclamation-white.svg"),
    warning: api.runtime.getURL("icons/bell-exclamation-white.svg"),
    info: api.runtime.getURL("icons/circle-info-white.svg"),
  };

  let root;
  const containers = {};
  const injectedGlowTypes = new Set();

  // Ensure root container exists
  function ensureRoot() {
    if (root) return root;

    root = document.getElementById("bc-toast-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "bc-toast-root";
      Object.assign(root.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "0",
        zIndex: "2147483647",
        pointerEvents: "none",
      });
      panel.appendChild(root);
    }
    return root;
  }

  // Glow keyframes per type
  function ensureGlow(type, color) {
    if (injectedGlowTypes.has(type)) return;

    const style = document.createElement("style");
    style.textContent = `
      @keyframes bc-toast-glow-${type} {
        0%   { box-shadow: 0 0 0 ${color}; }
        50%  { box-shadow: 0 0 14px ${color}; }
        100% { box-shadow: 0 0 0 ${color}; }
      }
    `;
    document.documentElement.appendChild(style);
    injectedGlowTypes.add(type);
  }

  function getGlowColor(type) {
    switch (type) {
      case "success":
        return "rgba(46, 204, 113, 0.6)";
      case "error":
        return "rgba(231, 76, 60, 0.6)";
      case "warning":
        return "rgba(241, 196, 15, 0.6)";
      default:
        return "rgba(52, 152, 219, 0.6)";
    }
  }

  // Create/get per-position container
  function getContainer(position) {
    if (containers[position]) return containers[position];

    const el = document.createElement("div");
    el.className = `bc-toast-container ${position}`;
    Object.assign(el.style, {
      position: "fixed",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      padding: "10px",
      pointerEvents: "none",
    });

    const posMap = {
      top: { top: "0", left: "50%", transform: "translateX(-50%)" },
      bottom: { bottom: "0", left: "50%", transform: "translateX(-50%)" },
      "top-left": { top: "0", left: "0" },
      "top-right": { top: "0", right: "0" },
      "bottom-left": { bottom: "0", left: "0" },
      "bottom-right": { bottom: "0", right: "0" },
    };

    Object.assign(el.style, posMap[position] || posMap["top"]);
    ensureRoot().appendChild(el);
    containers[position] = el;
    return el;
  }

  function getBg(type) {
    switch (type) {
      case "success":
        return "#1f7a3a";
      case "error":
        return "#7a1f1f";
      case "warning":
        return "#7a5a1f";
      default:
        return "#1f3a7a";
    }
  }

  // Show toast
  function show(message, opts = {}) {
    const {
      type = "info",
      duration = 3000,
      position = "top",
      icon,
      closable = false,
    } = opts;

    const container = getContainer(position);
    const toast = document.createElement("div");

    let removed = false;
    let timeoutId = null;

    Object.assign(toast.style, {
      minWidth: "220px",
      maxWidth: "320px",
      background: getBg(type),
      color: "#fff",
      borderRadius: "8px",
      padding: "10px 12px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      pointerEvents: "auto",
      opacity: "0",
      transform: "translateY(10px)",
      transition: "all 0.2s ease",
      fontFamily: "system-ui",
      fontSize: "12px",
      cursor: closable ? "pointer" : "default",
    });

    // Glow only if closable
    if (closable) {
      const glowColor = getGlowColor(type);
      ensureGlow(type, glowColor);
      toast.style.animation = `bc-toast-glow-${type} 1.5s ease-in-out infinite`;
      // Hover effect
      toast.addEventListener(
        "mouseenter",
        () => (toast.style.opacity = "0.85"),
      );
      toast.addEventListener("mouseleave", () => (toast.style.opacity = "1"));
    }

    // Icons
    const leftIcon = document.createElement("img");
    leftIcon.src = icon || icons[type];
    leftIcon.style.width = "18px";
    const rightIcon = leftIcon.cloneNode();

    // Text
    const textEl = document.createElement("div");
    textEl.textContent = message;
    Object.assign(textEl.style, {
      flex: "1",
      textAlign: "center",
    });

    toast.appendChild(leftIcon);
    toast.appendChild(textEl);
    toast.appendChild(rightIcon);

    // Click-to-dismiss only if closable
    if (closable) {
      toast.addEventListener("click", () => {
        if (removed) return;
        removed = true;
        toast.style.animation = ""; // stop glow
        if (timeoutId) clearTimeout(timeoutId);
        removeToast(toast);
      });
    }

    // Animate in
    requestAnimationFrame(() => {
      if (removed) return;
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    });

    // Auto-remove
    if (duration > 0) {
      timeoutId = setTimeout(() => {
        if (removed) return;
        removed = true;
        toast.style.animation = ""; // stop glow
        removeToast(toast);
      }, duration);
    }

    container.appendChild(toast);
    return toast;
  }

  function removeToast(toast) {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.animation = "";
    setTimeout(() => toast.remove(), 200);
  }

  return {
    show,
    success: (msg, opts = {}) => show(msg, { ...opts, type: "success" }),
    error: (msg, opts = {}) => show(msg, { ...opts, type: "error" }),
    warning: (msg, opts = {}) => show(msg, { ...opts, type: "warning" }),
    info: (msg, opts = {}) => show(msg, { ...opts, type: "info" }),
  };
})();

Toast.success("WebAssetX By BadCase Is Loaded");
