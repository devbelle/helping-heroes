// client-side JS for the "one-posts" web page
// needs to allow users to upvote a response and to add comments

// set up ability to sort and search (list.js)
var postList = new List('post-responses',
  { valueNames: ['date', 'upvotes', 'content', 'username'] });
