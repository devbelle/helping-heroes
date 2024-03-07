// count the number of upvotes for a given response

const { UserUpvote, Response } = require('../models');

// count the number of upvotes a given response has rec'd
const countUpvotes = async (responseID) => {
  const num = await UserUpvote.count({
    where: { response_id: responseID }
  });
  return num;
}

// count the number of responses to a given post
const countResponses = async (postID) => {
  const num = await Response.count({
    where: { post_id: postID }
  });
  return num;
}

module.exports = { countUpvotes, countResponses };
