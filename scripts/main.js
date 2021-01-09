function UpdateClock(){
    var d = new Date();
    var nhour = d.getHours()
    var nmin = d.getMinutes();

    if(nmin <= 9){
        nmin = "0" + nmin
    }
    if(nhour <= 9){
        nhour = "0" + nhour
    }
    
    var clocktext="" + nhour + ":" + nmin + "";
    document.getElementById('clock').innerHTML = clocktext;
}

UpdateClock();
setInterval(UpdateClock,1000);