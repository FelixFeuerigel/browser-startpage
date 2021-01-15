const adresses = [
    "https://twitchrss.appspot.com/vod/twitch",
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCo-vOxYorF0gguSt8qYWxaQ", // VRFunny
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCSbdMXOI_3HGiFviLZO6kNA", // ThrillSeeker
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCeeFfhMcJa1kjtfZAGskOCA", // TechLinked
];
const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const daynames = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];


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