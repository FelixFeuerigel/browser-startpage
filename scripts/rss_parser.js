const textarea = document.querySelector('#feed-textarea > ul');
const adresses = [
    'https://www.youtube.com/feeds/videos.xml?channel_id=UCsXVk37bltHxD1rDPwtNM8Q',
    'https://www.youtube.com/feeds/videos.xml?channel_id=UCBJycsmduvYEL83R_U4JriQ'
    
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
        <h4><a href="${feedEntry.meta.link}">${feedEntry.meta.title}</a></h4>
        <div><a href="${feedEntry.entry.link}">${feedEntry.entry.title}</a>
        `;
        if(feedEntry.entry.description != null){ 
            li.innerHTML += ` <br> <cite> ${feedEntry.entry.description}</cite>`;
        }
        li.innerHTML += `</div>
        <time>${feedEntry.date.toLocaleString()}</time>
        `;
        //append HTML content to list 
        textarea.appendChild(li);
    }
}

printFeed(adresses);