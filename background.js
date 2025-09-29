chrome.runtime.onInstalled.addListener(() => {
  // Manifest "side_panel" block.
  try {
    if (chrome.sidePanel && chrome.sidePanel.setOptions) {
      chrome.sidePanel.setOptions({
        path: 'popup.html?sidepanel=1',
        enabled: true
      });
    }
  } catch (e) {
    // Ignore errors in older Chrome versions or if sidePanel API not available.
  }
});

// Adding Side Panel
function applyPanelBehavior(mode) {
  try {
    chrome.sidePanel?.setPanelBehavior?.({
      openPanelOnActionClick: mode === 'sidepanel'
    });
  } catch (e) {
    // Checking Chrome Version
  }
}

function syncPanelBehaviorFromStorage() {
  try {
    chrome.storage?.local?.get({ mode: 'popup' }, (res) => {
      const mode = res?.mode === 'sidepanel' ? 'sidepanel' : 'popup';
      applyPanelBehavior(mode);
    });
  } catch (e) {
    // ignore
  }
}

// Apply on browser startup and during installation/updates.
chrome.runtime.onStartup?.addListener?.(syncPanelBehaviorFromStorage);
chrome.runtime.onInstalled?.addListener?.(syncPanelBehaviorFromStorage);

// Respond to a user's change in preferred mode during execution.
chrome.storage?.onChanged?.addListener?.((changes, area) => {
  if (area === 'local' && changes.mode) {
    const mode = changes.mode.newValue === 'sidepanel' ? 'sidepanel' : 'popup';
    applyPanelBehavior(mode);
  }
});

// Dinamic CTRL
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === 'OPEN_SIDE_PANEL') {
    // Check options reset
    try {
      if (chrome.sidePanel && chrome.sidePanel.setOptions) {
        chrome.sidePanel.setOptions({
          path: 'popup.html?sidepanel=1',
          enabled: true
        });
      }
    } catch (e) {
      // ignore
    }

    const openForWindow = (windowId) => {
      try {
        if (chrome.sidePanel && chrome.sidePanel.open) {
          chrome.sidePanel.open({ windowId });
        }
      } catch (e) {
        // ignore
      }
    };

    if (sender && sender.tab && typeof sender.tab.windowId === 'number') {
      openForWindow(sender.tab.windowId);
    } else {
      try {
        chrome.windows.getLastFocused({}, (win) => {
          if (win && typeof win.id === 'number') {
            openForWindow(win.id);
          }
        });
      } catch (e) {
        // ignore
      }
    }
  }
});
