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

function removeOverlay(tabId){
    const el = document.querySelector("#tabBlocker_overlay");
    if (el) el.remove();

    console.log("DISABLED OVERLAY");

    chrome.storage.local.remove(tabId.toString());
    console.log("REMOVED TAB " + tabId + " FROM MEMORY");

    //enable scrolling
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
}

function startTimer(startTime, duration, tabId) {

    let endTime = startTime + duration * 1000;

    if (Date.now() >= endTime) {
        console.log("Timer already finished");
        return;
    }

    let overlay = document.createElement("div");
    overlay.id = "tabBlocker_overlay";

    overlay.innerHTML = `
        <div class="overlay-content">
            <h2>This tab has been blocked</h2>
            <h1 id="timer_text"></h1>
        </div>
    `;

    document.body.appendChild(overlay);

    //disable scrolling
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const timerText = document.getElementById("timer_text");

    function updateTimer() {
        let remaining = endTime - Date.now();

        if (remaining <= 0) {
            clearInterval(interval);

            const el = document.querySelector("#tabBlocker_overlay");
            if (el) el.remove();

            removeOverlay(tabId);
            return;
        }

        timerText.textContent = `Time remaining: ${Math.ceil(remaining / 1000)}s`;
    }

    // run immediately so no delay
    updateTimer();

    // update every second
    const interval = setInterval(updateTimer, 1000);
}

chrome.runtime.onMessage.addListener( (message) => {
    //check action type
    if (message.action === "startTimer") {
        //add page to memory if not exists
        chrome.storage.local.get(message.tabId.toString(), (data) => {
            const tab = data[message.tabId.toString()];
            if(!tab){
                chrome.storage.local.set({[message.tabId.toString()]:
                        {duration: message.duration, tabId : message.tabId, startTime: message.startTime}});
                console.log("ADDED TAB " + message.tabId + " TO MEMORY. duration:" + message.duration);
                //add overlay to the page
                startTimer(message.startTime, message.duration, message.tabId);
            }
        })
    }

    if (message.action === "removeTab"){
        chrome.storage.local.get(message.tabId.toString(), (data) => {
            let tab = data[message.tabId.toString()];
            if(tab){
                removeOverlay(tab.tabId);
            }
        })
    }
});
