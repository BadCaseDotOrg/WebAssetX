(function() {
  if (window.__bc_mse_hook_installed) return;
  window.__bc_mse_hook_installed = true;

  function notify(url, type = "mse") {
    if (!url || typeof url !== "string") return;
    window.dispatchEvent(new CustomEvent("bc-network-request", {
      detail: { url, type }
    }));
  }

  const origAppendBuffer = SourceBuffer.prototype.appendBuffer;
  SourceBuffer.prototype.appendBuffer = function(buffer) {
    try {
      // If it's a Blob or ArrayBuffer, tag as "mse" request
      if (buffer instanceof ArrayBuffer || buffer instanceof Uint8Array) {
        const pseudoUrl = `mse-segment://${Math.random().toString(36).substr(2,6)}`;
        notify(pseudoUrl, "mse");
      }
    } catch(e) {}
    return origAppendBuffer.apply(this, arguments);
  };

})();