const addresses = [
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCBJycsmduvYEL83R_U4JriQ",
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCXuqSBlHAE6Xw-yeJA0Tunw",
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCBa659QWEk1AI4Tg--mrJ2A",
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCSbdMXOI_3HGiFviLZO6kNA", // ThrillSeeker
    "https://twitchrss.appspot.com/vod/thrilluwu"
];

const textarea = document.querySelector('#feed-textarea');


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

function getURL(url = "", header = []){
    let xml = new XMLHttpRequest();
    xml.open("GET", url);
    for(let i in header){
        xml.setRequestHeader(header[i][0], header[i][1])
    }
    xml.send();
    return xml;
}

UpdateClock();
setInterval(UpdateClock,1000);

let rssFeed;
window.onload = () => { if(feednami){rssFeed = new RssFeed(textarea, addresses);} };
