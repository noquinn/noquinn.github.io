const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

//document.body.appendChild();

//https://www.googleapis.com/blogger/v3/blogs/blogId/posts/postId

// use search params to determine if vieweing a specific post or what page number of all posts

// page
// ?p=1

// 