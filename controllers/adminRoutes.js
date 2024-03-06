// routes associated with the admin page

const router = require('express').Router();
const session = require('express-session');
const { Post, Response, Tag, TagPost, User, UserUpvote } = require('../models');
const { withAuth, isAdmin } = require('../utils/auth');
const { countUpvotes } = require('../utils/count');

// eventually use the "isAdmin" middleware below
router.get('/responses', async (req, res) => {
  // get all responses with ID, date, and username
  const allResponses = await Response.findAll({
    attributes: ['id', 'content', 'user_id', ['updated_at', 'date']],
    include: {
      model: User,
      attributes: ['username']
    }
  });

  // get just the data
  const output = allResponses.map( val => val.get({ plain: true }));

  // for each object in the array, add number of upvotes
  // (.map doesn't play nicely with async functions)
  for (let i = 0; i < output.length; i++) {
    output[i].upvotes = await countUpvotes(output[i].id);
  }

  // uncomment the line below to use insomnia to examine the output
  // res.json(output);

  res.render('admin', { output });
});


module.exports = router;
