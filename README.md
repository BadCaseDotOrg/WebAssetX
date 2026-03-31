# WebAssetX Browser Extension

![WebAssetX Logo](./badcases-webassetx/icons/icon128.png)

**WebAssetX** is a browser extension that creates a list of all files a site requests while loading and allows you to preview and download them.

---

## 📖 Table of Contents

- [Key Features](#key-features)  
- [Screenshots](#screenshots)  
- [Installation](#installation)  

---

## Key Features

- Live Asset Capture: Automatically generates a real-time list of every file a site requests during page load.

- Deep Scrape Engine: Extracts standard HTML links and dynamically injected links from JavaScript files.

- Intelligent Filtering: Instantly drills down by specific file types or custom extensions.

- Batch Action: Multi-select files to queue for bulk download or copy organized link lists to your clipboard.

- Instant Preview: Preview media files and inspect code strings directly within the extension without leaving the tab.

- Integrated Download Manager: A built-in system to track, manage, and organize your extracted assets.

- Cross-Platform Sync: Optimized for a seamless experience across both desktop and mobile browsers.

---

## Screenshots

**Main Panel (Desktop)**  
<img src="./img/desktop_panel.png" alt="Desktop Main Panel" width="600">

**Trophy Room (Desktop)**  
<img src="./img/desktop_trophy.png" alt="Desktop Trophy Room" width="600">

**Trophy Room with Settings (Desktop)**  
<img src="./img/desktop_trophy_settings.png" alt="Desktop Trophy Room Settings" width="600">

**Main Panel (Mobile)**  
<img src="./img/mobile_panel.jpg" alt="Mobile Main Panel" width="300">

**Trophy Room (Mobile)**  
<img src="./img/mobile_trophy.jpg" alt="Mobile Trophy Room" width="300">

**Trophy Room with Settings (Mobile)**  
<img src="./img/mobile_trophy_settings.jpg" alt="Mobile Trophy Room Settings" width="300">

---

## Installation

### Chrome Desktop (Recommended for Desktop)

1. Download the latest ZIP release from [Releases](https://github.com/BadCaseDotOrg/BloX/releases).
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (toggle top-right).
4. Click **Load unpacked** and select the extracted folder from the ZIP.

---

### Quetta Mobile (Recommended for Mobile)

1. Download the latest ZIP release from [Releases](https://github.com/BadCaseDotOrg/BloX/releases).
2. Open **[Quetta Mobile](https://play.google.com/store/apps/details?id=net.quetta.browser)**, go to **Settings → Extensions**, and scroll to the bottom and select **Developer options**.
3. Enable **Developer mode** (toggle in the upper right).
4. Tap **(from .zip/.crx/.user.js)** and select the downloaded ZIP file.
5. The extension will now be installed and appear in your Quetta extensions list.

---

### Firefox Nightly Desktop (using CRX Installer)

1. Download the latest CRX release from [Releases](https://github.com/BadCaseDotOrg/BloX/releases).
2. Download and install **Firefox Nightly**:  
   - **Desktop:** [Firefox Nightly for Windows/macOS/Linux](https://www.mozilla.org/firefox/channel/desktop/)
3. Install the **CRX Installer** add-on from [Mozilla Add-ons](https://addons.mozilla.org/en-US/firefox/addon/crxinstaller/).
4. Go to `about:config` in the address bar and disable `xpinstall.signatures.required` to allow unsigned extensions.
5. Open **CRX Installer** from the Firefox extension menu, tap **Choose File**, and select the downloaded CRX file, a prompt will appear to install the extension.
6. The extension will now appear in your add-ons list and is active.


### Firefox Nightly Mobile (using CRX Installer)

1. Download the latest CRX release from [Releases](https://github.com/BadCaseDotOrg/BloX/releases).
2. Download and install **Firefox Nightly**:  
   - **Android:** [Firefox Nightly for Developers on Google Play](https://play.google.com/store/apps/details?id=org.mozilla.fenix)
3. Install the **CRX Installer** add-on from [Mozilla Add-ons](https://addons.mozilla.org/en-US/firefox/addon/crxinstaller/).
4. Go to `about:config` in the address bar and disable `xpinstall.signatures.required` to allow unsigned extensions.
5. Open **CRX Installer** from the Firefox extension menu, tap **Choose File**, and select the downloaded CRX file — it will automatically create a `.xpi` file.
6. Enable the **Debug menu** in Firefox Nightly:  
   - Go to **Settings → About Firefox Nightly**.
   - Tap the **Firefox logo** multiple times until you see “Debug menu enabled”.
7. Go back to **Settings → Install extension from file**, and select the `.xpi` file that CRX Installer created.
8. The extension will now appear in your add-ons list and is active.

