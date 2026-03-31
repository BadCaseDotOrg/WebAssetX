(function() {
  if (window.__bc_network_hook_installed) return;
  window.__bc_network_hook_installed = true;

  function notify(url, type = "fetch") {
    if (!url || typeof url !== "string") return;

    window.dispatchEvent(new CustomEvent("bc-network-request", {
      detail: { url, type }
    }));
  }

  /* --------------------
  fetch interception
  -------------------- */
  const origFetch = window.fetch;

  window.fetch = function(...args) {
    try {
      const url = typeof args[0] === "string"
        ? args[0]
        : args[0]?.url;

      notify(url, "fetch");
    } catch {}

    return origFetch.apply(this, args);
  };

  /* --------------------
  XMLHttpRequest interception
  -------------------- */
  const origOpen = XMLHttpRequest.prototype.open;

  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    try {
      notify(url, "xhr");
    } catch {}

    return origOpen.call(this, method, url, ...rest);
  };

})();

/* --------------------
   WebSocket hook
-------------------- */

(function(){

  const OrigWebSocket = window.WebSocket;

  window.WebSocket = function(url, protocols) {

    try {
      window.dispatchEvent(new CustomEvent("bc-network-request", {
        detail: { url: url, type: "websocket" }
      }));
    } catch(e){}

    return new OrigWebSocket(url, protocols);
  };

  window.WebSocket.prototype = OrigWebSocket.prototype;

})();

/* --------------------
   Dynamic import() hook
-------------------- */

(function(){

  const origImport = window.import;

  if (origImport) {
    window.import = function(url) {

      try {
        window.dispatchEvent(new CustomEvent("bc-network-request", {
          detail: { url: url, type: "dynamic_import" }
        }));
      } catch(e){}

      return origImport.apply(this, arguments);
    };
  }

})();

/* --------------------
   PerformanceObserver hook
-------------------- */

(function(){

  if (!window.PerformanceObserver) return;

  try {

    const observer = new PerformanceObserver((list) => {

      const entries = list.getEntries();

      for (const entry of entries) {

        if (!entry.name) continue;

        try {
          window.dispatchEvent(new CustomEvent("bc-network-request", {
            detail: {
              url: entry.name,
              type: entry.initiatorType || "resource"
            }
          }));
        } catch(e){}

      }

    });

    observer.observe({
      entryTypes: ["resource"]
    });

  } catch(e){}

})();