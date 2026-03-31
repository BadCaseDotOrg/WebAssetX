const api = typeof browser !== "undefined" ? browser : chrome;

// Store all requests per tab
const tabRequests = {};

// Listen for completed requests
api.webRequest.onCompleted.addListener(
  (details) => {
    const { tabId, url, type, statusCode, responseHeaders } = details;

    if (tabId < 0) return;

    if (!tabRequests[tabId]) tabRequests[tabId] = [];

    let size = "unknown";

    if (responseHeaders) {
      const cl = responseHeaders.find(
        (h) => h.name.toLowerCase() === "content-length",
      );
      if (cl) {
        const parsed = parseInt(cl.value);
        if (!isNaN(parsed)) size = parsed;
      }
    }

    tabRequests[tabId].push({
      url,
      type,
      statusCode,
      size,
    });
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"],
);

// Clear when tab starts loading / reloads
api.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "loading") {
    tabRequests[tabId] = [];
  }
});

// Clean up when tab is closed
api.tabs.onRemoved.addListener((tabId) => {
  delete tabRequests[tabId];
});

// ────────────────────────────────────────────────
// Download manager state
// ────────────────────────────────────────────────
let downloadQueue = [];
let activeDownloads = {}; // downloadId (number) → { url: string, status: string, tabId: number|null }

// ────────────────────────────────────────────────
// Messages from content/popup
// ────────────────────────────────────────────────
api.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const tabId = sender.tab ? sender.tab.id : null;

  if (msg.type === "GET_REQUESTS" || msg.type === "GET_REQUESTS_PAGE") {
    sendResponse({
      requests: tabRequests[tabId] || [],
    });
    return true;
  }

  if (msg.type === "CLEAR_REQUESTS") {
    if (tabId !== null) {
      tabRequests[tabId] = [];
    }
    sendResponse({ status: "cleared" });
    return true;
  }

  if (msg.type === "queueMultiple") {
    msg.urls.forEach((url) => {
      downloadQueue.push({ url, tabId });
    });
    processQueue();
    sendResponse({ status: "queued" });
    return true;
  }

  if (msg.type === "PAUSE_DOWNLOAD") {
    api.downloads.pause(msg.downloadId, () => {
      if (activeDownloads[msg.downloadId]) {
        activeDownloads[msg.downloadId].status = "paused";
      }
    });
    return true;
  }

  if (msg.type === "RESUME_DOWNLOAD") {
    api.downloads.resume(msg.downloadId, () => {
      if (activeDownloads[msg.downloadId]) {
        activeDownloads[msg.downloadId].status = "in_progress";
      }
    });
    return true;
  }

  if (msg.type === "CANCEL_DOWNLOAD") {
    api.downloads.cancel(msg.downloadId, () => {
      delete activeDownloads[msg.downloadId];
    });
    return true;
  }

  if (msg.type === "GET_TOGGLE_STATE") {
    if (!tabId) {
      sendResponse({ enabled: true });
      return true;
    }
    const key = `showFileTracker_${tabId}`;
    api.storage.local.get({ [key]: true }, (res) => {
      sendResponse({ enabled: res[key] ?? true });
    });
    return true;
  }
});

// ────────────────────────────────────────────────
// Queue processing
// ────────────────────────────────────────────────
function processQueue() {
  if (!downloadQueue.length) return;

  const item = downloadQueue.shift();
  const { url, tabId } = item;

  api.downloads.download({ url, saveAs: false }, (downloadId) => {
    if (api.runtime.lastError || !downloadId) {
      console.warn(
        "Download failed to start:",
        url,
        api.runtime.lastError?.message,
      );
      if (tabId) {
        api.tabs.sendMessage(tabId, {
          type: "DOWNLOAD_FAILED",
          url,
          error: api.runtime.lastError?.message || "Unknown error",
        });
      }
    } else {
      activeDownloads[downloadId] = {
        url,
        status: "in_progress",
        tabId: tabId || null,
      };

      if (tabId) {
        api.tabs.sendMessage(tabId, {
          type: "DOWNLOAD_STARTED",
          downloadId,
          url,
        });
      } else {
        // fallback broadcast
        api.runtime.sendMessage({
          type: "DOWNLOAD_STARTED",
          downloadId,
          url,
        });
      }
    }

    // Continue queue
    if (downloadQueue.length) processQueue();
  });
}

// ────────────────────────────────────────────────
// State change listener (complete, interrupted, etc.)
// ────────────────────────────────────────────────
api.downloads.onChanged.addListener((delta) => {
  const id = delta.id;
  if (!activeDownloads[id]) return;

  if (delta.state) {
    const newState = delta.state.current;
    activeDownloads[id].status = newState;

    const msg = {
      type: "DOWNLOAD_STATUS",
      downloadId: id,
      state: newState,
      url: activeDownloads[id].url,
    };

    if (activeDownloads[id].tabId) {
      api.tabs.sendMessage(activeDownloads[id].tabId, msg);
    } else {
      api.runtime.sendMessage(msg);
    }

    if (newState === "complete" || newState === "interrupted") {
      delete activeDownloads[id];
    }
  }
});

// ────────────────────────────────────────────────
// PROGRESS POLLING – this is what actually updates the bar
// ────────────────────────────────────────────────
setInterval(() => {
  const activeIds = Object.keys(activeDownloads).filter((id) => {
    return activeDownloads[id].status === "in_progress";
  });

  if (activeIds.length === 0) return;

  activeIds.forEach((downloadIdStr) => {
    const downloadId = parseInt(downloadIdStr, 10);

    api.downloads.search({ id: downloadId }, (items) => {
      if (!items || items.length === 0) {
        delete activeDownloads[downloadId];
        return;
      }

      const d = items[0];

      // Send progress update
      const msg = {
        type: "DOWNLOAD_PROGRESS",
        id: d.id,
        received: d.bytesReceived,
        total: d.totalBytes >= 0 ? d.totalBytes : 0,
        state: d.state,
      };

      if (activeDownloads[d.id]?.tabId) {
        api.tabs.sendMessage(activeDownloads[d.id].tabId, msg);
      } else {
        api.runtime.sendMessage(msg);
      }

      // Clean up finished ones
      if (d.state === "complete" || d.state === "interrupted") {
        delete activeDownloads[d.id];
      }
    });
  });
}, 600);
