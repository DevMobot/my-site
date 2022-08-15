let now_playing = document.querySelector(".now-playing");
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

let isPlaying = false;
let updateTimer;
let seeker = true;
let loopQueue = true;

const host_conn = location.protocol;
const host = location.host;

// Create new audio element
let curr_track = document.createElement('audio');

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function Get(yourUrl) {
  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("GET", yourUrl, false);
  Httpreq.send(null);
  return Httpreq.responseText;
}
const mobileCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  if (window.innerWidth > 500) check = false;
  else if (window.innerWidth < 500) check = true;
  return check;
};

if (mobileCheck()) {
  document.querySelector(".queue").style.width = "100%";
  document.querySelector(".queueLabel").style.width = "100%";

  now_playing.style.fontSize = "1rem";
  track_name.style.fontSize = "1.5rem";
  track_artist.style.fontSize = "1rem";
}
const media = () => {
  if ('mediaSession' in window.navigator) {
      window.navigator.mediaSession.metadata = new MediaMetadata({
        title: track_list[track_index].name.substring(0, 45),
        artist: track_list[track_index].artist,
        album: "YouTube",
        artwork: [
          { src: track_list[track_index].image,   type: 'image/jpg' }
        ]
      });
  }
}
// Define the tracks that have to be play"ed
let track_index = parseInt(Get(host_conn+"//"+host+"/api/getindex?session="+getCookie("connect.sid")));
let track_list = JSON.parse(Get(host_conn+"//"+host+"/api/getTracks?session=" + getCookie("connect.sid")));

function random_bg_color() {

  // Get a number between 64 to 256 (for getting lighter colors)
  let red = Math.floor(Math.random() * 256) + 64;
  let green = Math.floor(Math.random() * 256) + 64;
  let blue = Math.floor(Math.random() * 256) + 64;

  // Construct a color withe the given values
  let bgColor = "rgb(" + red + "," + green + "," + blue + ")";

  // Set the background to that color
  document.body.style.background = bgColor;
}

function resetValues() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}

// Load the first track in the tracklist

let nextTrack = () => {
  if (track_index < track_list.length - 1)
    track_index += 1;
  else track_index = 0;

  loadTrack(track_index);
  playTrack();
}

let prevTrack = () => {
  if (track_index > 0)
    track_index -= 1;
  else track_index = track_list.length;
  loadTrack(track_index);
  playTrack();
}

//----------------------------------------------------------------------------
const rateLimit = () => {
  let emptyFunc = () => { return };

  let check = Get(host_conn+"//"+host+"/api/nextReady?session="+ getCookie("connect.sid"));
  //const spt = prevTrack;
  const snt = nextTrack;

  if (check == "true") {
    next_btn.onclick = nextTrack;
    prev_btn.onclick = prevTrack;
    next_btn.style.color = "black";
    prev_btn.style.color = "black";
    //callback();
  } else {
    
    next_btn.style.color = "grey";
    //prev_btn.style.color = "grey";
    next_btn.onclick = emptyFunc;
    //nextTrack = emptyFunc;
    //prevTrack = emptyFunc;
    //prev_btn.onclick = emptyFunc;
    
    setTimeout(() => {
      //callback();
      //nextTrack = snt;
      next_btn.onclick = nextTrack;
      //prev_btn.onclick = prevTrack;
      next_btn.style.color = "black";
      //prev_btn.style.color = "black";
    }, 3500)

  } 
}
//------------------------------------------------------------------------------------------------

async function loadTrack(track_index) {

  clearInterval(updateTimer);
  resetValues();

  curr_track.src = track_list[track_index].path;

  let sessionid = getCookie("connect.sid")
  Get(`${host_conn}//${host}/api/trackindexsave?ti=${track_index}&session=${sessionid}`);
  
  curr_track.load();

  document.title = track_list[track_index].name.substring(0, 35);
  track_art.style.backgroundImage = "url(" + track_list[track_index].image + ")";

  track_name.textContent = track_list[track_index].name.substring(0, 40);
  track_artist.textContent = track_list[track_index].artist;
  if (mobileCheck()) track_name.textContent = track_list[track_index].name.substring(0, 30);
  now_playing.textContent = "PLAYING " + (track_index + 1) + " OF " + track_list.length;

  rateLimit();

  updateTimer = setInterval(seekUpdate, 1000);
  curr_track.addEventListener("ended", () => {
    if (track_index < track_list.length - 1 && loopQueue) {
      nextTrack();
    } else {
      loadTrack(0);
      pauseTrack();
      return;
    }
  });
  
  document.querySelectorAll(".queueItem").forEach(e => {
    e.classList.remove("qnp");
  });

}
loadTrack(track_index);
//------------------------------------------------------------------------------------------------

function playpauseTrack() {
  if (!isPlaying) playTrack();
  else pauseTrack();
}

function playTrack() {
  curr_track.play().then(() => {
    media();
  }).catch(e => {
    console.log(e);
  });

  isPlaying = true;
  if ('mediaSession' in window.navigator) window.navigator.mediaSession.playbackState = "playing";
  playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';

  document.getElementById(track_index+"").classList.add("qnp");

}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  if ('mediaSession' in window.navigator) window.navigator.mediaSession.playbackState = "paused";
  playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';;
}

function seekTo() {
  let seekto = curr_track.duration * (seek_slider.value / 100);
  curr_track.currentTime = seekto;
}

function setVolume() {
  curr_track.volume = volume_slider.value / 100;
}

function seekUpdate() {
  let seekPosition = 0;

  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);

    seek_slider.value = seekPosition;

    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

    if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
    if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
    if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
    if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}

const noSeek = () => {
  let noSeeking = getCookie("noSeek");
  if (noSeeking == "yes") {
    seek_slider.style.display = "none";
    total_duration.style.display = "none";
    seeker = false;
  } else return;
}
noSeek(); 
//songList();


if ('mediaSession' in navigator) {
  navigator.mediaSession.setActionHandler('previoustrack', () => {
    prevTrack()
  });
  navigator.mediaSession.setActionHandler('nexttrack', () => {
    nextTrack()
  });
  navigator.mediaSession.setActionHandler('play', () => {
    window.navigator.mediaSession.playbackState = "playing";
    playpauseTrack()
  });
  navigator.mediaSession.setActionHandler('pause', () => {
    window.navigator.mediaSession.playbackState = "paused";
    playpauseTrack()
  });
}

//------------------------------------------------------------------------------------------------------

const loadFromQueue = (i) => {
  track_index = i;
  
  document.querySelectorAll(".queueItem").forEach(e => {
    e.classList.remove("qnp");
  })

  document.getElementById(i+"").classList.add("qnp");
}

const displayQueue = () => {
  for (let i = 0; i < track_list.length; i++) {
    
    let listItem = document.createElement("div");
    let artDiv = document.createElement("div");
    let trackNameSpan = document.createElement("span");

    let queueDiv = document.querySelector(".queue");

    artDiv.classList.add("queueTrackArt");
    listItem.classList.add("queueItem");
    listItem.id = i+"";

    listItem.setAttribute("onclick", `loadTrack(${i});playTrack();loadFromQueue(${i});`);
    //`redirect('${host_conn}//${host}/player?index=${i+1}')`;

    let trackNameText = document.createTextNode(track_list[i].name);
    trackNameSpan.appendChild(trackNameText);

    artDiv.style.backgroundImage = `url(${track_list[i].image})`;

    queueDiv.appendChild(listItem);
    listItem.appendChild(artDiv);
    listItem.appendChild(trackNameSpan);
  }
}
displayQueue();

const scrollQueue = () => {
  document.getElementById(track_index+'').scrollIntoView({ behavior: 'smooth' });
}
