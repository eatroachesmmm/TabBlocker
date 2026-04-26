

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startTimer") {
        chrome.tabs.sendMessage(message.tabId, {
            action: "startTimer",
            tabId: message.tabId,
            duration: message.duration,
            startTime: message.startTime
        })
    }

    if (message.action === "removeTab") {
        chrome.tabs.sendMessage(message.tabId, {
            action: "removeTab",
            tabId: message.tabId,
            duration: message.duration
        })
    }

    if (message.action === "getTabId") {
        sendResponse(sender.tab.id);
    }
});