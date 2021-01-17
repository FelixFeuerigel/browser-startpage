const adresses = [
    "https://myanimelist.net/rss.php?type=rwe&u=DasIchigo",
    "https://myanimelist.net/rss.php?type=rwe&u=Ishoy33",
    "https://twitchrss.appspot.com/vod/thrilluwu",
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCLm6s42r_wCbBX0QqXNCTwg", // LeFloid
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCBdIstCmMf6W1IcL7hgyL9Q", // Selphius
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCo-vOxYorF0gguSt8qYWxaQ", // VRFunny
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCSbdMXOI_3HGiFviLZO6kNA", // ThrillSeeker
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCeeFfhMcJa1kjtfZAGskOCA", // TechLinked
];
const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const daynames = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

// ----
const textarea = document.querySelector('#feed-textarea');

class RssElement{
    adressData;
    elementData;
    date = new Date();
    iconURL = new String();

    constructor(pRssElement, pIconURL){
        this.elementData = pRssElement;
        this.iconURL = pIconURL;
    }
}

class RssAdress{
    adress = new String();
    content = new Array(new RssElement);
    status = new String;

    constructor(pAdress = new String()){
        this.adress = pAdress;
        this.status = "no data";
        this.update();
    }
    async update() {
        let iconURL = "https://" + new URL(this.adress).host + "/favicon.ico"
        function handleFulfillment(rssFeed){
            /* this.content = new Array(new RssElement);
            for(element of rssFeed){
                this.content.push(new RssElement(element, iconURL));
            }
            this.status = "data loaded"; */
            return rssFeed;
        }
        function handleRejected(val){
            //this.status = "failed to load data";
            console.log(`Failed to get feed from: ${this.adress}`);
            console.log(val);
            return [];
        }
        //feednami.load(this.adress).then(handleFulfillment, handleRejected);
        let feed = feednami.load(this.adress).then(handleFulfillment, handleRejected);
        for(element of feed){
            this.content.push(new RssElement(element, iconURL));
        }
        console.log(feed);
        feed.on
        return this.content;
    }

}

class RssFeed {
    textContainer;   // the element to print the feed in
    rssAdresses = new Array();
    content = new Array(); // combined content of adresses
    monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
    daynames = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

    constructor(pTextarea = new Element(), pAdresses = new Array(), timer = 60000){
        this.textContainer = pTextarea
        for(let adress of pAdresses){
            this.rssAdresses.push(new RssAdress(adress))
        }/*
        setInterval(this.upgrade, timer);
        this.upgrade();*/
    }

    update(){   // updates the content of this and of all adresses
        for(let adress of this.rssAdresses){
            adress.update();
        }
        this.content = new Array(); // clear content array
        for(let adress of this.rssAdresses){
            this.content = this.content.concat(adress.content); // append the content of every adress
        }
        this.content.sort( (a, b) => { b.date - a.date} ); // sort the content array
    }

    print(){
        function timeBackToMidnight(time){
            time = new Date(time);
            time.setHours(0);
            time.setMinutes(0);
            time.setSeconds(0);
            time.setMilliseconds(0);
            return time;
        }
        
        let textarea = document.createElement(`ul`); // create feed element list
    
        const t_now = new Date(); // curent Time
        let t_0d = timeBackToMidnight(t_now); // past midnight
        let t_1d = timeBackToMidnight(t_now - 1 * 24 * 60 * 60 * 1000);
        let t_7d = timeBackToMidnight(t_now - 7 * 24 * 60 * 60 * 1000);
        let t_14d = timeBackToMidnight(t_now - 14 * 24 * 60 * 60 * 1000);
        let step = 0;
        let month = t_now.getMonth();
        let year = t_now.getFullYear();
    
        for(rssElement of this.content){
            if(rssElement.date >= t_0d){
                if(step < 1){
                    step = 1;
                    let h3 = document.createElement('li');
                    h3.classList.add(`feed-time-entry`)
                    h3.innerHTML = `Heute`;
                    textarea.appendChild(h3);
                }
            }
            else if(rssElement.date >= t_1d){
                if(step < 2){
                    step = 2;
                    let h3 = document.createElement('li');
                    h3.classList.add(`feed-time-entry`)
                    h3.innerHTML = `Gestern`;
                    textarea.appendChild(h3);
                }
            }
            else if(rssElement.date >= t_7d){
                if(step < 3){
                    step = 3;
                    let h3 = document.createElement('li');
                    h3.classList.add(`feed-time-entry`)
                    h3.innerHTML = `Diese Woche`;
                    textarea.appendChild(h3);
                }
            }
            else if(rssElement.date >= t_14d){
                if(step < 4){
                    step = 4;
                    let h3 = document.createElement('li');
                    h3.classList.add(`feed-time-entry`)
                    h3.innerHTML = `Letzten 14 Tage`;
                    textarea.appendChild(h3);
                }
            }
            else if(rssElement.date.getMonth() === t_now.getMonth()){
                if(step < 5){
                    step = 5;
                    let h3 = document.createElement('li');
                    h3.classList.add(`feed-time-entry`)
                    h3.innerHTML = `Diesen Monat`;
                    textarea.appendChild(h3);
                }
            }
            else if(rssElement.date.getFullYear() != year){
                year = rssElement.date.getFullYear();
                month = rssElement.date.getMonth();
                let h3 = document.createElement('li');
                h3.classList.add(`feed-time-entry`)
                h3.innerHTML = `${monthNames[11]} ${year}`;
                textarea.appendChild(h3);
            }
            else if(rssElement.date.getMonth() != month){
                month = rssElement.date.getMonth();
                let h3 = document.createElement('li');
                h3.classList.add(`feed-time-entry`)
                h3.innerHTML = `${monthNames[month]}`;
                textarea.appendChild(h3);
            }
            
            // create a list element
            let li = document.createElement('li');
            li.classList.add(`feed-news-entry`)
            // add HTML content to list items
            li.innerHTML = `
            <div class="feed-meta-title-container">
                <img src="${feedEntry.iconURL}">
                <a class="feed-meta-title" href="${feedEntry.meta.link}">${feedEntry.meta.title}</a>
            </div>
            <a class="feed-entry-title" href="${feedEntry.entry.link}">${feedEntry.entry.title}</a>
            `;
            if(feedEntry.entry.description != null){ 
                li.innerHTML += `<div class="feed-entry-description">${feedEntry.entry.description}</div>`;
            }
            if(step < 3){
                li.innerHTML += `
                <div class="feed-time">${feedEntry.date.getHours()>9?feedEntry.date.getHours():"0"+feedEntry.date.getHours()}:${feedEntry.date.getMinutes()>9?feedEntry.date.getMinutes():"0"+feedEntry.date.getMinutes()} Uhr</div>
                `;
            }
            else{
                li.innerHTML += `
                <div class="feed-time">${feedEntry.date.getDate()>9?feedEntry.date.getDate():"0"+feedEntry.date.getDate()}.${feedEntry.date.getMonth()>8?feedEntry.date.getMonth()+1:"0"+(feedEntry.date.getMonth()+1)}, ${feedEntry.date.getHours()>9?feedEntry.date.getHours():"0"+feedEntry.date.getHours()}:${feedEntry.date.getMinutes()>9?feedEntry.date.getMinutes():"0"+feedEntry.date.getMinutes()} Uhr</div>
                `;
            }
            // append HTML content to list 
            textarea.appendChild(li);
        }
        
        this.textContainer.innerHTML = ""; // clear feed
    
        let h3Title = document.createElement(`h3`); // create RSS title
        h3Title.innerHTML = `RSS-Feed`;
        this.textContainer.appendChild(h3Title); // print RSS title to textContainer

        textContainer.appendChild(textarea); // print feed element list to textContainer 
    }

    upgrade(){
        function handleFulfillment(adress) {
            this.content = new Array(); // clear content array
            for(let tempAdress of this.rssAdresses){
                this.content = this.content.concat(tempAdress.content); // append the content of every adress
            }
            this.content.sort( (a, b) => { b.date - a.date} ); // sort the content array
            this.print(); 
        }
        function handleRejected(val) {
            console.log("error updating content of an adress: "+val);
        }

        for(let adress of this.rssAdresses){
            adress.update.then(handleFulfillment, handleRejected); // for every updatet adress.content
        }
    }
    setTimer(timer = new Number()){
        setInterval(this.upgrade, timer);
    }
}

let rssFeed = new RssFeed(textarea, adresses);
// ---
/*
async function loadFeed(urlList = [], i = 0){
    let urlRemain;
    if(urlList.length > i+1){
        urlRemain = await loadFeed(urlList, i+1);
    }

    return feednami.load(urlList[i]).then(feed => {
        let orderedFeed = [];
        console.log(`Success getting feed from: ${urlList[i]}`);
        console.log(feed);
        for(let entry of feed.entries){

            orderedFeed.push({
                meta: feed.meta,
                date: new Date(entry.pubdate),
                iconURL: `https://` + new URL(urlList[i]).host + "/favicon.ico",
                entry: entry
            });
        }

        if(urlRemain){
            return[...orderedFeed, ...urlRemain]
        }
        else{
            return orderedFeed;
        }
    }, error => {
        let orderedFeed = [];
        console.log(`Failed to get feed from: ${urlList[i]}`);
        console.log(error);

        if(urlRemain){
            return urlRemain;
        }
        else{
            return [];
        }
    });
}

async function printFeed(adresses = []){

    function timeBackToMidnight(time){
        time = new Date(time);
        time.setHours(0);
        time.setMinutes(0);
        time.setSeconds(0);
        time.setMilliseconds(0);
        return time;
    }
    
    let combinedFeed = await loadFeed(adresses); // get feed elements
    combinedFeed.sort( (a, b) => b.date - a.date ); // sort feed by date

    const t_now = new Date();
    let t_0d = timeBackToMidnight(t_now);
    let t_1d = timeBackToMidnight(t_now - 1 * 24 * 60 * 60 * 1000);
    let t_7d = timeBackToMidnight(t_now - 7 * 24 * 60 * 60 * 1000);
    let t_14d = timeBackToMidnight(t_now - 14 * 24 * 60 * 60 * 1000);
    let step = 0;
    let month = t_now.getMonth();
    let year = t_now.getFullYear();

    const textContainer = document.querySelector('#feed-textarea'); // clear feed
    textContainer.innerHTML = "";

    let h3Title = document.createElement(`h3`); // create RSS title
    h3Title.innerHTML = `RSS-Feed`;
    textContainer.appendChild(h3Title);

    textContainer.appendChild(document.createElement(`ul`));
    const textarea = document.querySelector('#feed-textarea > ul');

    for(feedEntry of combinedFeed){
        if(feedEntry.date >= t_0d){
            if(step < 1){
                step = 1;
                let h3 = document.createElement('li');
                h3.classList.add(`feed-time-entry`)
                h3.innerHTML = `Heute`;
                textarea.appendChild(h3);
            }
        }
        else if(feedEntry.date >= t_1d){
            if(step < 2){
                step = 2;
                let h3 = document.createElement('li');
                h3.classList.add(`feed-time-entry`)
                h3.innerHTML = `Gestern`;
                textarea.appendChild(h3);
            }
        }
        else if(feedEntry.date >= t_7d){
            if(step < 3){
                step = 3;
                let h3 = document.createElement('li');
                h3.classList.add(`feed-time-entry`)
                h3.innerHTML = `Diese Woche`;
                textarea.appendChild(h3);
            }
        }
        else if(feedEntry.date >= t_14d){
            if(step < 4){
                step = 4;
                let h3 = document.createElement('li');
                h3.classList.add(`feed-time-entry`)
                h3.innerHTML = `Letzten 14 Tage`;
                textarea.appendChild(h3);
            }
        }
        else if(feedEntry.date.getMonth() === t_now.getMonth()){
            if(step < 5){
                step = 5;
                let h3 = document.createElement('li');
                h3.classList.add(`feed-time-entry`)
                h3.innerHTML = `Diesen Monat`;
                textarea.appendChild(h3);
            }
        }
        else if(feedEntry.date.getFullYear() != year){
            year = feedEntry.date.getFullYear();
            month = feedEntry.date.getMonth();
            let h3 = document.createElement('li');
            h3.classList.add(`feed-time-entry`)
            h3.innerHTML = `${monthNames[11]} ${year}`;
            textarea.appendChild(h3);
        }
        else if(feedEntry.date.getMonth() != month){
            month = feedEntry.date.getMonth();
            let h3 = document.createElement('li');
            h3.classList.add(`feed-time-entry`)
            h3.innerHTML = `${monthNames[month]}`;
            textarea.appendChild(h3);
        }
        
        // create a list element
        let li = document.createElement('li');
        li.classList.add(`feed-news-entry`)
        // add HTML content to list items
        li.innerHTML = `
        <div class="feed-meta-title-container">
            <img src="${feedEntry.iconURL}">
            <a class="feed-meta-title" href="${feedEntry.meta.link}">${feedEntry.meta.title}</a>
        </div>
        <a class="feed-entry-title" href="${feedEntry.entry.link}">${feedEntry.entry.title}</a>
        `;
        if(feedEntry.entry.description != null){ 
            li.innerHTML += `<div class="feed-entry-description">${feedEntry.entry.description}</div>`;
        }
        if(step < 3){
            li.innerHTML += `
            <div class="feed-time">${feedEntry.date.getHours()>9?feedEntry.date.getHours():"0"+feedEntry.date.getHours()}:${feedEntry.date.getMinutes()>9?feedEntry.date.getMinutes():"0"+feedEntry.date.getMinutes()} Uhr</div>
            `;
        }
        else{
            li.innerHTML += `
            <div class="feed-time">${feedEntry.date.getDate()>9?feedEntry.date.getDate():"0"+feedEntry.date.getDate()}.${feedEntry.date.getMonth()>8?feedEntry.date.getMonth()+1:"0"+(feedEntry.date.getMonth()+1)}, ${feedEntry.date.getHours()>9?feedEntry.date.getHours():"0"+feedEntry.date.getHours()}:${feedEntry.date.getMinutes()>9?feedEntry.date.getMinutes():"0"+feedEntry.date.getMinutes()} Uhr</div>
            `;
        }
        // append HTML content to list 
        textarea.appendChild(li);
    }
}

printFeed(adresses);
setInterval(function(){ printFeed(adresses); }, 60000);
*/