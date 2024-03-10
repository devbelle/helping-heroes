// client-side JS for the "one-posts" web page
// needs to allow users to upvote a response and to add comments

document.addEventListener('DOMContentLoaded', () => {
  // set up ability to sort and search (list.js)
  var postList = new List('post-responses',
    { valueNames: ['date', 'num_upvotes', 'content', 'username'] });

  const upvoteResponse = async (evt) => {
    let responseID = evt.target.dataset.id;
    // need to account for possibly clicking inner icon
    if (!responseID) responseID = evt.target.parentElement.dataset.id;

    // try to increase upvote for this response
    // (if user already upvoted it, query will return a validation error)
    const response = await fetch(`/api/upvotes/${responseID}`, { method: 'POST' });

    if (response.ok) {
      // increase upvote count by one on web page
      const upvoteEl = evt.target.closest('div.upvote').querySelector('span.num_upvotes');
      let upvotes = Number(upvoteEl.innerHTML) + 1;
      upvoteEl.innerHTML = upvotes;
      // now display "you have upvoted"
      evt.target.closest('div.upvote').querySelector('em.upvote').style.display = 'inline';
    }
  }

  document
    .querySelectorAll('button.upvote')
    .forEach((el) => el.addEventListener('click', upvoteResponse));

}, false);  // end DOM ready
