/*
function Get(yourUrl){
  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("GET",yourUrl,false);
  Httpreq.send(null);
  return Httpreq.responseText;          
}
*/

function CustomAlert(){
  this.render = function(dialog, title){
    var winW = window.innerWidth;
    var winH = window.innerHeight;
    var dialogoverlay = document.getElementById('dialogOverlayForAlert');
    var dialogbox = document.getElementById('dialogbox');
    dialogoverlay.style.display = "block";
    dialogoverlay.style.height = winH+"px";
    dialogbox.style.width = "350px";
    dialogbox.style.left = (winW/2) - (350 * .5)+"px";
    dialogbox.style.top = "100px";
    dialogbox.style.display = "block";
    document.getElementById('dialogboxhead').innerHTML = title || "★ Note!";
    document.getElementById('dialogboxbody').innerHTML = dialog;
    document.getElementById('dialogboxfoot').innerHTML = '<button id="alertboxButton" onclick="Alert.ok()">OK</button>';
  }
  this.playlistInfo = function(dialog, viewUrl, playUrl, title){
    var winW = window.innerWidth;
    var winH = window.innerHeight;
    var dialogoverlay = document.getElementById('dialogOverlayForAlert');
    var dialogbox = document.getElementById('dialogbox');
    dialogoverlay.style.display = "block";
    dialogoverlay.style.height = winH+"px";
    dialogbox.style.left = (winW/2) - (350 * .5)+"px";
    dialogbox.style.width = "350px";
    dialogbox.style.top = "100px";
    dialogbox.style.display = "block";
    document.getElementById('dialogboxhead').innerHTML = "🎧 Playlist: " + title;
    document.getElementById('dialogboxbody').innerHTML = dialog;
    let btns = `<button id="alertboxButton" onclick="rnt('${viewUrl}')">View</button>`;
    btns = btns + `<button id="alertboxButton" onclick="redirect('${playUrl}')">Play</button>`;
    btns = btns + `<button id="alertboxButton" onclick="Alert.ok()">Cancel</button>`;
    document.getElementById('dialogboxfoot').innerHTML = btns;
  }
  this.ok = function(){
    document.getElementById('dialogbox').style.display = "none";
    document.getElementById('dialogOverlayForAlert').style.display = "none";
  }
}
function rnt (url) {
	window.open(url, '_blank');
}
function redirect (url) {
  loadingScreen.render();
	window.location = url;
}

var Alert = new CustomAlert();