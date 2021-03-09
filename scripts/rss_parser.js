const addresses = [
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCSbdMXOI_3HGiFviLZO6kNA", // ThrillSeeker
    "https://twitchrss.appspot.com/vod/thrilluwu"
];

const textarea = document.querySelector('#feed-textarea');

class RssElement{
    iconURL = new String();
    rssDate = new Date();
    rssTitle = new String();
    rssLink = new String();
    rssDescription = new String();
    rssImage = new String();
    metaTitle = new String();
    metaLink = new String();

    constructor(pRssElement, metaData, pIconURL){
        this.iconURL = pIconURL;
        this.rssDate = new Date(pRssElement.pubdate);
        this.rssTitle = pRssElement.title;
        this.rssLink = pRssElement.link;
        this.rssDescription = pRssElement.description;
        this.rssImage = pRssElement.image.url;
        this.metaTitle = metaData.title;
        this.metaLink = metaData.link;
        this.metaDescription = metaData.description;
    }
}

class RssAddress{
    address = new String();
    feed;
    baseTimeout = new Number();
    timeout = new Number();
    status = new String();
    iconURL = new String();
    rssData;
    rssElements = new Array();

    constructor(pAdress = new String(), pFeed = new RssFeed(), pTimeout = 40000){
        this.address = pAdress;
        this.feed = pFeed;
        this.baseTimeout = pTimeout;
        this.timeout = pTimeout;
        this.status = "no data";
        this.iconURL = "http://" + new URL(this.address).host + "/favicon.ico";
    }
    onRssAddressLoaded(rssFeed){ // gets executed if the Address is loaded successfully
        this.rssData = rssFeed.meta;

        let newElements = new Array();
        for(let element of rssFeed.entries){
            newElements.push(new RssElement(element, this.rssData, this.iconURL));
        }
        this.rssElements = newElements;

        this.status = "data loaded";
        console.log(`Loaded feed from: ${this.address}`);

        this.timeout = this.baseTimeout;
        if(this.baseTimeout >= 0){
            setTimeout(()=>{this.upgrade();}, this.timeout);
        }
        return newElements;
    }
    onAddressLoadFailed(val){ // gets executed if the loading fails
        this.status = "failed to load data";
        console.log(`Failed to get feed from: ${this.address}`);
        console.log(val);

        if(this.timeout < this.baseTimeout * 10){
            this.timeout = Math.ceil(this.timeout * 1.3);
        }
        if(this.baseTimeout >= 0){
            setTimeout(()=>{this.upgrade();}, this.timeout);
        }
        return [];
    }
    async upgrade() { // loads the address and prints it to feed
        this.status = "loading data";
        let feed = feednami.load(this.address).then(
            (val)=>{
                this.onRssAddressLoaded(val);
                this.feed.upgrade();
            },
            (val)=>{
                this.onAddressLoadFailed(val);
                this.feed.upgrade();
            }
        );
        return feed;
    }
}

class RssFeed {
    textContainer;              // the element to print the feed in
    rssAddresses = new Array(); // Array of RSS feed addresses
    content = new Array();      // combined content of addresses
    monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
    dayNames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

    constructor(pTextarea = new Element(), pAddresses = new Array()){
        this.textContainer = pTextarea
        for(let address of pAddresses){
            this.rssAddresses.push(new RssAddress(address, this))
        }
        this.upgradeRecursive();
    }
    update(){ // updates the content of this without updating the rssAddresses
        let newContent = new Array();
        for(let address of this.rssAddresses){
            newContent = newContent.concat(address.rssElements);
        }
        newContent.sort( (a, b) => {return b.rssDate - a.rssDate} ); // sort the newContent array
        
        this.content = newContent; // update content array
        
        return newContent;
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
    
        for(let rssElement of this.content){
            if(rssElement.rssDate >= t_0d){
                if(step < 1){
                    step = 1;
                    let h3 = document.createElement('li');
                    h3.classList.add(`feed-time-entry`)
                    h3.innerHTML = `Heute`;
                    textarea.appendChild(h3);
                }
            }
            else if(rssElement.rssDate >= t_1d){
                if(step < 2){
                    step = 2;
                    let h3 = document.createElement('li');
                    h3.classList.add(`feed-time-entry`)
                    h3.innerHTML = `Gestern`;
                    textarea.appendChild(h3);
                }
            }
            else if(rssElement.rssDate >= t_7d){
                if(step < 3){
                    step = 3;
                    let h3 = document.createElement('li');
                    h3.classList.add(`feed-time-entry`)
                    h3.innerHTML = `Diese Woche`;
                    textarea.appendChild(h3);
                }
            }
            else if(rssElement.rssDate >= t_14d){
                if(step < 4){
                    step = 4;
                    let h3 = document.createElement('li');
                    h3.classList.add(`feed-time-entry`)
                    h3.innerHTML = `Letzten 14 Tage`;
                    textarea.appendChild(h3);
                }
            }
            else if(rssElement.rssDate.getMonth() === t_now.getMonth()){
                if(step < 5){
                    step = 5;
                    let h3 = document.createElement('li');
                    h3.classList.add(`feed-time-entry`)
                    h3.innerHTML = `Diesen Monat`;
                    textarea.appendChild(h3);
                }
            }
            else if(rssElement.rssDate.getFullYear() != t_now.getFullYear() && rssElement.rssDate.getMonth() != month){
                year = rssElement.rssDate.getFullYear();
                month = rssElement.rssDate.getMonth();
                let h3 = document.createElement('li');
                h3.classList.add(`feed-time-entry`);
                h3.innerHTML = `${this.monthNames[month]} ${year}`;
                textarea.appendChild(h3);
            }
            else if(rssElement.rssDate.getMonth() != month){
                month = rssElement.rssDate.getMonth();
                let h3 = document.createElement('li');
                h3.classList.add(`feed-time-entry`);
                h3.innerHTML = `${this.monthNames[month]}`;
                textarea.appendChild(h3);
            }
            
            // create HTML content for list items
            let newInnerHTML = String();
            newInnerHTML = `
            <div class="feed-meta-title-container">
                <img src="${rssElement.iconURL}" alt="">
                <a class="feed-meta-title" href="${rssElement.metaLink}">${rssElement.metaTitle}</a>
            </div>
            <a class="feed-entry-title" href="${rssElement.rssLink}">${rssElement.rssTitle}</a>
            `;
            if(rssElement.rssDescription != null || rssElement.rssImage != null){ 
                newInnerHTML += `<div class="feed-entry-description">`;
                if(rssElement.rssImage != null){ newInnerHTML += `<a href="${rssElement.rssLink}"><img src="${rssElement.rssImage}"></a><br>`; } // adds image, if available
                if(rssElement.rssDescription != null){ newInnerHTML += `${rssElement.rssDescription}`; } // adds feed description, if availabe
                newInnerHTML += `</div>`;
            }
            newInnerHTML += `<div class="feed-time">${rssElement.rssDate.getHours()>9?rssElement.rssDate.getHours():"0"+rssElement.rssDate.getHours()}:${rssElement.rssDate.getMinutes()>9?rssElement.rssDate.getMinutes():"0"+rssElement.rssDate.getMinutes()} Uhr, ${this.dayNames[rssElement.rssDate.getDay()]}. ${rssElement.rssDate.getDate()>9?rssElement.rssDate.getDate():"0"+rssElement.rssDate.getDate()}.${rssElement.rssDate.getMonth()>8?rssElement.rssDate.getMonth()+1:"0"+(rssElement.rssDate.getMonth()+1)}</div>`;

            // create a list element
            let li = document.createElement('li');
            li.classList.add(`feed-news-entry`)
            // add HTML content to list item
            li.innerHTML = newInnerHTML;
            // append HTML content to list 
            textarea.appendChild(li);
        }
        
        this.textContainer.innerHTML = ""; // clear feed
    
        let h3Title = document.createElement(`h3`); // create RSS title
        h3Title.innerHTML = `RSS-Feed`;
        h3Title.classList.add(`feed-title`)
        this.textContainer.appendChild(h3Title); // print RSS title to textContainer

        this.textContainer.appendChild(textarea); // print feed element list to textContainer 
    }
    upgrade(){ // updates the content of this without updating the rssAddresses and then prints
        const ret = this.update();
        this.print();
        return ret;
    }
    upgradeRecursive(){ // updates the rssAddresses plus this.content and then prints
        console.log("Loading addresses:");
        for(let address of this.rssAddresses){
            address.upgrade() // tells the addresses to update and call RssFeed.upgrade
        }
        return;
    }
    setTimeout(pTimeout = new Number()){ // changes the time between upgrades, values lower than 0 stop the updating
        for(let iAddress of this.rssAddresses){
            iAddress.baseTimeout = pTimeout;
        }
        return;
    }
}

let rssFeed
window.onload = () => { rssFeed = new RssFeed(textarea, addresses); };