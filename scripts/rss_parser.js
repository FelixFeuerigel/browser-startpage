const textarea = document.querySelector('#feed-textarea > ul');
const adresses = [
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCSbdMXOI_3HGiFviLZO6kNA", //ThrillSeeker
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCeeFfhMcJa1kjtfZAGskOCA", //TechLinked
];

async function getFeed(url = ""){
    console.log(`Loading feed from: ${url}`);
    return feednami.load(url).then(feed => {
        let orderedFeed = [];
        console.log(feed);
        console.log(`Success getting feed from: ${url}`);
        for(let entry of feed.entries){

            orderedFeed.push({
                meta: feed.meta,
                date: new Date(entry.pubdate),
                entry: entry
            });
        }
        return orderedFeed;
    });
}
async function printFeed(adresses = []){
    let combinedFeed = [];
    for(url of adresses){
        let newFeed = await getFeed(url);
        combinedFeed = [...combinedFeed, ...newFeed]
    }
    combinedFeed.sort( (a, b) => b.date - a.date );
    for(feedEntry of combinedFeed){
        //create a list element
        let li = document.createElement('li');
        //add HTML content to list items
        li.innerHTML = `
        <h4 class="feed-title"><a href="${feedEntry.meta.link}">${feedEntry.meta.title}</a></h4>
        <h5 class="feed-title2"><a href="${feedEntry.entry.link}">${feedEntry.entry.title}</a></h5>
        `;
        if(feedEntry.entry.description != null){ 
            li.innerHTML += ` <br> <cite> ${feedEntry.entry.description}</cite>`;
        }
        li.innerHTML += `
        <time  class="feed-time">${feedEntry.date.toLocaleString()}</time>
        `;
        //append HTML content to list 
        textarea.appendChild(li);
    }
}

printFeed(adresses);