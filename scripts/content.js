//check if the page already has a timer
chrome.runtime.sendMessage({ action: "getTabId" }, (tabId) => {
    //query the memory
    chrome.storage.local.get([tabId.toString()], (data) => {
        const tab = data[tabId.toString()];
        if(tab){
            startTimer(tab.startTime, tab.duration, tab.tabId);
        }
    });
});

function startTimer(startTime, duration, tabId) {

    let currentTime = Date.now();
    let endTime = startTime + duration * 1000;


    if (currentTime >= endTime) {
        console.log("Timer already finished");
        return;
    }

    let remaining = endTime - currentTime;

    let overlay = document.createElement("div");
    overlay.id = "timer_overlay";

    overlay.innerHTML = `
    <div class="overlay-content">
        <h2>This tab has been blocked</h2>
        <h1>Time remaining: ${Math.ceil(remaining / 1000)}s</h1>
    </div>
`;
    overlay.id = "tabBlocker_overlay";
    document.body.appendChild(overlay);

    setTimeout(() => {
        //remove
        document.body.removeChild(document.querySelector("#tabBlocker_overlay"));
        chrome.storage.local.remove(tabId.toString());
        console.log("REMOVED TAB " + tabId + " FROM MEMORY");
    }, remaining);
}

chrome.runtime.onMessage.addListener( (message) => {
    //check action type
    if (message.action === "startTimer") {
        //add page to memory
        chrome.storage.local.set({[message.tabId.toString()]:
                {duration: message.duration, tabId : message.tabId, startTime: message.startTime}});
        console.log("ADDED TAB " + message.tabId + " TO MEMORY. duration:" + message.duration);
        //add overlay to the page
        startTimer(message.startTime, message.duration, message.tabId);
    }

    if (message.action === "removeTab"){
        chrome.storage.local.get(message.tabId.toString(), (data) => {
            if(data[message.tabId.toString()]){
                document.body.removeChild(document.querySelector("#tabBlocker_overlay"));
                chrome.storage.local.remove(message.tabId.toString());
                console.log("REMOVED TAB " + message.tabId + " FROM MEMORY");
            }
        })
    }
});
