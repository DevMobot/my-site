function loading(){
    this.render = function(dialog){
        var winW = window.innerWidth;
        var winH = window.innerHeight;
        var dialogoverlay = document.getElementById('dialogoverlay');
        dialogoverlay.style.display = "block";
        dialogoverlay.style.height = winH+"px";
        document.getElementById("loader").style.display = "flex";
    }
    this.ok = function(){
        document.getElementById('dialogoverlay').style.display = "none";
        document.getElementById("loader").style.display = "none";
    }
}

var loadingScreen = new loading();