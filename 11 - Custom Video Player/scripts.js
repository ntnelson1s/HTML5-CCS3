// grab elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const full = document.getElementById('fullscreen');

// define functions

function togglePlay() {
  video.paused ? video.play() : video.pause();
}

function updateButton() {
  const icon = this.paused ? '►' : '❚ ❚';
  toggle.textContent = icon;
}

function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  video[this.name] = this.value;
}

function handleProgress() {
  const percent = video.currentTime / video.duration * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

let time;
function scrub(e) {
  if (!time) time = Date.now();  //cap on dragging scrub
  if (Date.now() - time < 150) return;
  time = Date.now();

  const scrubTime = e.offsetX / progress.offsetWidth * video.duration;
  video.currentTime = scrubTime;
}

let fullscreenFunc = video.requestFullscreen;
if (!fullscreenFunc) { //if the video element doesnt have a fullscreen func
  ['mozRequestFullScreen', 
   'msRequestFullscreen',
   'webkitRequestFullScreen'].forEach(function (req) {
     fullscreenFunc = fullscreenFunc || video[req];  //until you find which exists of FF, MS, or chrome browser
   });            //     find the correct one and make it the fullscreen function
}

function enterFullscreen() {
  fullscreenFunc.call(video);   //u have to use .call to invoke it
}
            

// add event listeners

video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);
full.addEventListener('click', enterFullscreen);