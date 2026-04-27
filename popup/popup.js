const timeInputs = document.querySelectorAll(".time_input");

timeInputs.forEach(input => {
    input.addEventListener("input", (e) => {
        // Remove any non-digit characters
        input.value = input.value.replace(/\D/g, "");
    });
});

const start_button = document.getElementById("start_button");
const reset_button = document.getElementById("reset_button");
const hours_input = document.getElementById("hours_input");
const minutes_input = document.getElementById("minutes_input");
const seconds_input = document.getElementById("seconds_input");

document.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: e.target.href });
});

function convertToSeconds(hours, minutes, seconds) {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;

    return h * 3600 + m * 60 + s;
}

reset_button.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let status = document.getElementById("tabBlockerStatus");
        status.style.display = "none";

        const matchingTab = tabs[0];
        chrome.runtime.sendMessage({
            action: "removeTab",
            tabId: matchingTab.id,
        });
    });
});

start_button.addEventListener("click", () => {
    const hours = hours_input.value;
    const minutes = minutes_input.value;
    const seconds = seconds_input.value;

    hours_input.value = "";
    minutes_input.value = "";
    seconds_input.value = "";

    if (hours === "" && minutes === "" && seconds === "") {
        console.log("No time entered");
        return;
    }

    const duration = convertToSeconds(hours, minutes, seconds);

    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        const matchingTab = tabs[0];
        let startTime = Date.now();
        let status = document.getElementById("tabBlockerStatus");

        chrome.storage.local.get([matchingTab.id.toString()], (data) => {
            let tab = data[matchingTab.id.toString()];
            if(tab){
                status.style.display = "block";
                status.textContent = "Timer already running on this tab.";
                return;
            }else{
                status.style.display = "none";
                chrome.runtime.sendMessage({
                    action: "startTimer",
                    tabId: matchingTab.id,
                    duration: duration,
                    startTime: startTime
                });
            }
        })
    });
});