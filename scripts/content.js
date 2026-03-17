//check if the page already has a timer
chrome.runtime.sendMessage({ action: "getTabId" }, (tabId) => {
    //query the memory
    chrome.storage.local.get([tabId.toString()], (data) => {
        if(data[tabId.toString()]){
            let overlay = document.createElement("dialog");
            overlay.id = "timer_overlay";
            overlay.innerHTML = `<h1>Timer Started</h1>`;
            document.body.appendChild(overlay);
            overlay.showModal();
        }
    });
});

chrome.runtime.onMessage.addListener( (message) => {
    //check action type
    if (message.action === "startTimer") {
        //TODO: ADD TIMER EXPIRING

        //add page to memory
        chrome.storage.local.set({[message.tabId.toString()]: {duration: message.duration, tabId : message.tabId, startTime: Date.now()}});
        console.log("ADDED TAB " + message.tabId + " TO MEMORY");
        //add overlay to the page
        let overlay = document.createElement("dialog");
        overlay.id = "timer_overlay";
        overlay.innerHTML = `<h1>Timer Started</h1>`;
        document.body.appendChild(overlay);
        overlay.showModal();
    }

    if (message.action === "removeTab"){
        chrome.storage.local.get(message.tabId.toString(), (data) => {
            if(data[message.tabId.toString()]){
                document.body.removeChild(document.querySelector("#timer_overlay"));
                chrome.storage.local.remove(message.tabId.toString());
                console.log("REMOVED TAB " + message.tabId + " FROM MEMORY");
            }
        })
    }
});
