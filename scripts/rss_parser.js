let url = 'https://myanimelist.net/rss.php?type=rwe&u=DasIchigo';
const textarea = document.querySelector('#feed-textarea > ul');

feednami.load(url)
.then(feed => {
    textarea.value = ''
    console.log(feed);
    for(let entry of feed.entries){
        //create a list element
        let li = document.createElement('li');
        let date = new Date(entry.pubdate)
        //add HTML content to list items
        li.innerHTML = `
        <time>${date.getDay()}.${date.getMonth()}.${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()} </time>
        <h4><a href="${feed.meta.link}">${feed.meta.title}</a></h4>
        <h5><a href="${entry.link}">${entry.title}</a></h5>
        <div> ${entry.description} </div>
        `;
        //append HTML content to list 
        textarea.appendChild(li);
    }
});