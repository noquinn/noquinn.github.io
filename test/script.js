var feedUrl = "https://www.googleapis.com/blogger/v3/blogs/4087366956799539233/posts?key=AIzaSyC_kOXxTI9r8mzgY2zWWlsa27X4O-PmCPQ";
var request = new XMLHttpRequest();
request.onreadystatechange = function() {
  if (request.readyState === 4) createLatestFeed(request.response);
}
request.open("GET", feedUrl);
request.send();

function createLatestFeed(r) {
	var posts = JSON.parse(r);
	for (var i = 0; i < Math.min(3, posts.items.length); i ++) {
		var p = posts.items[i];
		console.log(p);

		// get first image in p.content, use as post thumbnail
		var x = document.createElement("div");
		x.innerHTML = p.content;
		var firstImage = x.querySelector("img");

		var img = document.createElement('img');
		img.src = (firstImage ? firstImage.src : "default_post_thumbnail.png");
		//img.src = firstImage.src;
		img.width = "350";
		img.height = "197";
		img.alt = "";

		var thumbnail = document.createElement('div');
		thumbnail.classList.add("news-item-thumb");
		thumbnail.appendChild(img);

		var publishedtxt = document.createTextNode(formatDate(p.published));
		var published = document.createElement('div');
		published.classList.add("publish-date", "published");
		published.appendChild(publishedtxt);

		var titletxt = document.createTextNode(p.title);
		var title = document.createElement('h2');
		title.appendChild(titletxt);

		var itemBody = document.createElement('div');
		itemBody.classList.add("news-item-body");
		itemBody.appendChild(published);
		itemBody.appendChild(title);
		
		var a = document.createElement('a');
		a.classList.add("news-item", "news-item-list", "news-item-latest");
    a.appendChild(thumbnail);
		a.appendChild(itemBody);
    a.title = p.title;
    //a.href = p.url;
		a.href = `/news?post=${p.id}`;
    document.getElementById('latest-news').appendChild(a);
	}
}

function formatDate(date) {
	var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var date = new Date(date);
	var d = date.getDay();
	//https://gist.github.com/jlbruno/1535691/db35b4f3af3dcbb42babc01541410f291a8e8fac
	var ordinals = ["th", "st", "nd", "rd"];
	var x = d % 100;
	var ordinal = (ordinals[(x - 20) % 10] || ordinals[x] || ordinals[0]);
	return `${monthNames[date.getMonth()]} ${d}${ordinal}, ${date.getFullYear()}`;
}
