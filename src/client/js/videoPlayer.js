const video = document.querySelector("#video");
const playBtn = document.querySelector("#playBtn");
const muteBtn = document.querySelector("#muteBtn");
const volume = document.querySelector("#volume");
let volumeValue = 0;
const duration = document.querySelector("#duration");
const currentTime = document.querySelector("#currentTime");

const handlePlayBtn = () => {
  if (video.paused) {
    video.play();
    playBtn.innerText = "Pause";
  } else {
    video.pause();
    playBtn.innerText = "Play";
  }
};

const handleMuteBtn = () => {
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Sound On";
    volume.value = volumeValue;
  } else {
    video.muted = true;
    muteBtn.innerText = "Sound Off";
    volume.value = 0;
  }
};

const handleVolume = (event) => {
  video.volume = event.target.value;
  volumeValue = video.volume;
  muteBtn.innerText = video.volume ? "Sound On" : "Sound Off";
};

const handleDuration = () => {
  const second = Math.floor(video.duration) * 1000;
  duration.innerText = new Date(second).toUTCString().split(" ")[4];
};

const handleCurrentTime = () => {
  const second = Math.floor(video.currentTime) * 1000;
  currentTime.innerText = new Date(second).toUTCString().split(" ")[4];
};

playBtn.addEventListener("click", handlePlayBtn);
muteBtn.addEventListener("click", handleMuteBtn);
volume.addEventListener("input", handleVolume);
video.addEventListener("loadedmetadata", handleDuration);
if (video.readyState >= 1) handleDuration();
video.addEventListener("timeupdate", handleCurrentTime);
