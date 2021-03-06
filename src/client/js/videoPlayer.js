const video = document.querySelector("#video");
const playBtn = document.querySelector("#playBtn");
const muteBtn = document.querySelector("#muteBtn");
const volumeRange = document.querySelector("#volumeRange");
let volumeValue = 0;
const duration = document.querySelector("#duration");
const currentTime = document.querySelector("#currentTime");
const timeLine = document.querySelector("#timeLine");
const fullscreenBtn = document.querySelector("#fullscreen");
const videoContainer = document.querySelector("#videoContainer");

const handlePlayBtn = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
};
const handlePlay = () => {
  playBtn.innerText = video.paused ? "Play" : "Pause";
};
const handleMuteBtn = () => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
};
const handleVolumeRange = (event) => {
  video.volume = event.target.value;
};
const handleVolume = (event) => {
  const currentVolume = event.target.volume;
  if (!Boolean(currentVolume) || event.target.muted) {
    muteBtn.innerText = "Sound On";
    volumeRange.value = 0;
  } else {
    muteBtn.innerText = "Sound Off";
    volumeRange.value = currentVolume;
  }
};
const handleDuration = () => {
  const second = Math.floor(video.duration) * 1000;
  duration.innerText = new Date(second).toUTCString().split(" ")[4];
  timeLine.max = video.duration;
};

const handleCurrentTime = () => {
  const second = Math.floor(video.currentTime) * 1000;
  currentTime.innerText = new Date(second).toUTCString().split(" ")[4];
  timeLine.value = video.currentTime;
};

const handelTimeLine = (event) => {
  video.currentTime = event.target.value;
};

const handleFullscreenBtn = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
  } else {
    videoContainer.requestFullscreen();
  }
};

const handleFullscreenchange = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    fullscreenBtn.innerText = "Exit Screen";
  } else {
    fullscreenBtn.innerText = "Full Screen";
  }
};

playBtn.addEventListener("click", handlePlayBtn);
video.addEventListener("play", handlePlay);
video.addEventListener("pause", handlePlay);

muteBtn.addEventListener("click", handleMuteBtn);
volumeRange.addEventListener("input", handleVolumeRange);
video.addEventListener("volumechange", handleVolume);

video.addEventListener("loadedmetadata", handleDuration);
if (video.readyState >= 1) handleDuration();
video.addEventListener("timeupdate", handleCurrentTime);
timeLine.addEventListener("input", handelTimeLine);
fullscreenBtn.addEventListener("click", handleFullscreenBtn);
document.addEventListener("fullscreenchange", handleFullscreenchange);
