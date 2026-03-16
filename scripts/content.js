chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];

    chrome.storage.local.get(activeTab.id, (data) => {
        if (data[activeTab.id]) {
            const duration = data[activeTab.id].duration;
            const startTime = data[activeTab.id].startTime;
            const currentTime = Date.now();
            const elapsedTime = (currentTime - startTime) / 1000;

            if (elapsedTime < duration) {
                const remainingTime = duration - elapsedTime;
                const hours = Math.floor(remainingTime / 3600);
                const minutes = Math.floor((remainingTime % 3600) / 60);
            }
        }
    })
});