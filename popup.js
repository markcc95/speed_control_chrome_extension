let runBtn = document.getElementById("run-btn");
let speedInput = document.getElementById("speed-input");
let speedChips = document.getElementsByClassName("speed-chip");

const chooseChip = function() {
  // control chip class
  for (var i = 0; i < speedChips.length; i++) {
    speedChips[i].classList.remove("active");
  }
  this.classList.add("active");

  var chipSpeed = this.getAttribute("data-speed");
  speedInput.value = chipSpeed
  chrome.storage.local.set({ "speed": chipSpeed })
  executeScript()
};

for (var i = 0; i < speedChips.length; i++) {
  speedChips[i].addEventListener('click', chooseChip, false);
}

// user ENTER on the input
speedInput.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    runBtn.click();
  }
});

// user CLICK on the run button
runBtn.addEventListener("click", async () => {
  highlightChip()
  chrome.storage.local.set({ "speed": speedInput.value })
  executeScript()
})

// HIGHLIGHT chip if the speed input value match with the chip value
function highlightChip() {
  for (var i = 0; i < speedChips.length; i++) {
    let chipValue = speedChips[i].getAttribute("data-speed");
    if(speedInput.value == chipValue) {
      for (var j = 0; j < speedChips.length; j++) {
        speedChips[j].classList.remove("active");
      }
      speedChips[i].classList.add("active");
    }
  }
}

async function executeScript() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: updateVideoSpeed,
  });
}

async function updateVideoSpeed() {
  await chrome.storage.local.get("speed", value => {
    let video = document.querySelector('video')
    video.playbackRate = value.speed
  })
}
