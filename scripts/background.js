chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "startTimer") {
        const tabId = message.tabId.toString();
        const duration = message.duration;

        // Store the timer info in chrome.storage
        chrome.storage.local.set({ [tabId]: { duration, startTime: Date.now() } }, () => {
            chrome.storage.local.get(tabId, (data) => {
                console.log("Timer started for tab", tabId, "with duration", data[tabId].duration);
            });
        });
    }
});