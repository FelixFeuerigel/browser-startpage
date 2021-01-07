let url = 'https://myanimelist.net/rss.php?type=rwe&u=DasIchigo';
const textarea = document.querySelector('#feed-textarea > ul');

feednami.load(url)
.then(feed => {
    textarea.value = '';
    console.log(feed);
    for(let entry of feed.entries){
        //create a list element
        let li = document.createElement('li');
        //add HTML content to list items
        let date = new Date(entry.pubdate);
        li.innerHTML = `
        <h4><a href="${feed.meta.link}">${feed.meta.title}</a></h4>
        <div><a href="${entry.link}">${entry.title}</a> <br> <cite> ${entry.description}</cite></div>
        <time>${date.toLocaleString()}</time>
        `;
        //append HTML content to list 
        textarea.appendChild(li);
    }
});