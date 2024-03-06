// count the number of upvotes for a given response

const { UserUpvote } = require('../models');

const countUpvotes = async (responseID) => {
  const num = await UserUpvote.count({
    where: { response_id: responseID }
  });
  return num;
}

module.exports = { countUpvotes };
