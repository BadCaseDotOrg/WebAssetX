const api = typeof browser !== "undefined" ? browser : chrome;

const checkbox = document.getElementById("toggleFileTracker");

// Get the domain from a URL
function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

// Load the current domain setting and update checkbox
api.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (!tabs[0]) return;
  const domain = getDomain(tabs[0].url);
  if (!domain) return;

  api.storage.local.get({ trackerSettings: {} }, (res) => {
    const settings = res.trackerSettings || {};
    const enabled = settings[domain] ?? true; // default enabled
    checkbox.checked = enabled;
    sendToggleMessage(tabs[0].id, enabled);
  });
});

// Save changes per domain
checkbox.onchange = () => {
  api.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) return;
    const domain = getDomain(tabs[0].url);
    if (!domain) return;

    api.storage.local.get({ trackerSettings: {} }, (res) => {
      const settings = res.trackerSettings || {};
      settings[domain] = checkbox.checked;
      api.storage.local.set({ trackerSettings: settings });

      sendToggleMessage(tabs[0].id, checkbox.checked);

      // Show alert to reload the tab
      alert("Tracker setting changed. Please reload the tab to apply changes.");
    });
  });
};

// Send toggle message to content script
function sendToggleMessage(tabId, enabled) {
  api.tabs.sendMessage(tabId, {
    type: "TOGGLE_BC_HOST",
    enabled,
  });
}
