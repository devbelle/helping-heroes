// client-side JS for the "one-posts" web page
// needs to allow users to upvote a response and to add comments

document.addEventListener('DOMContentLoaded', () => {
  /////////////////////////////////////////////////////////////////////////////
  //                       Global Variable Declarations                      //
  /////////////////////////////////////////////////////////////////////////////

  const responseTextboxEl = document.getElementById('response-content');
  const submitResponseBtnEl = document.getElementById('submit-response');
  const cancelResponseBtnEl = document.getElementById('cancel-response');
  const addResponseBtnEl = document.querySelector('button.add-response');

  // set up ability to sort and search (list.js)
  var postList = new List('post-responses',
    { valueNames: ['date', 'num_upvotes', 'content', 'username'] });

  /////////////////////////////////////////////////////////////////////////////
  //                           Function Definitions                          //
  /////////////////////////////////////////////////////////////////////////////

  // CB function to upvote an existing response
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
  }; // end upvoteResponse function

  // hiding form elements to submit a new response
  const cancelResponse = () => {
    responseTextboxEl.style.display = "none";
    submitResponseBtnEl.style.display = "none";
    cancelResponseBtnEl.style.display = "none";
    addResponseBtnEl.style.display = "inline-block";
  };

  // displaying the form elements to submit a response
  const getResponse = () => {
    responseTextboxEl.style.display = "inline-block";
    submitResponseBtnEl.style.display = "inline-block";
    cancelResponseBtnEl.style.display = "inline-block";
    addResponseBtnEl.style.display = "none";
  };

  // create new response in the DB
  const createResponse = async (evt) => {
    // get the post ID to which to attach the response
    const post_id = evt.target.dataset.id;
    // get the contents of the textbox (ie the response the user wishes to add)
    const content = responseTextboxEl.value;

    // on to the CRUD
    if (content) {
      response = await fetch('/api/responses', {
        method: 'POST',
        body: JSON.stringify({ post_id, content }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        document.location.reload();
      } else {
        cancelResponse();  // even w error need to clean up
        alert('Failed to add response: response.statusText')
      }
    }
  };

  /////////////////////////////////////////////////////////////////////////////
  //                             Event Listeners                             //
  /////////////////////////////////////////////////////////////////////////////

  // upvoting a response
  document
    .querySelectorAll('button.upvote')
    .forEach((el) => el.addEventListener('click', upvoteResponse));

  // display form to get response content
  addResponseBtnEl.addEventListener('click', getResponse);

  // changing mind about adding a response
  cancelResponseBtnEl.addEventListener('click', cancelResponse);

  // creating a new response in the DB
  submitResponseBtnEl.addEventListener('click', createResponse);

  /////////////////////////////////////////////////////////////////////////////
  //                          Executible Statements                          //
  /////////////////////////////////////////////////////////////////////////////

  // hide the "add response" form elements
  cancelResponse();


}, false);  // end DOM ready
