const timeInputs = document.querySelectorAll(".time_input");

timeInputs.forEach(input => {
    input.addEventListener("input", (e) => {
        // Remove any non-digit characters
        input.value = input.value.replace(/\D/g, "");
    });
});

const start_button = document.getElementById("start_button");
const hours_input = document.getElementById("hours_input");
const minutes_input = document.getElementById("minutes_input");
const seconds_input = document.getElementById("seconds_input");

function convertToSeconds(hours, minutes, seconds) {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;

    return h * 3600 + m * 60 + s;
}

start_button.addEventListener("click", () => {
    const hours = hours_input.value;
    const minutes = minutes_input.value;
    const seconds = seconds_input.value;

    if (hours === "" && minutes === "" && seconds === "") {
        console.log("No time entered");
        return;
    }

    const totalSeconds = convertToSeconds(hours, minutes, seconds);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.runtime.sendMessage({
            action: "startTimer",
            tabId: activeTab.id,
            duration: totalSeconds
        });
    });
});