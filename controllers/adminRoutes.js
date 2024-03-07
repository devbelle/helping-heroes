// routes associated with the admin page

const router = require('express').Router();
const session = require('express-session');
const { Post, Response, Tag, TagPost, User, UserUpvote } = require('../models');
const { withAuth, isAdmin } = require('../utils/auth');
const { countUpvotes, countResponses } = require('../utils/count');

// TODO: all "isAdmin" middleware to all of these routes

router.get('/responses', isAdmin, async (req, res) => {
  // get all responses with ID, date, and username
  const allResponses = await Response.findAll({
    attributes: ['id', 'content', 'user_id', ['updated_at', 'date']],
    include: {
      model: User,
      attributes: ['username']
    }
  });

  if (allResponses.length === 0) {
    res.send('No responses found.');
    return;
  }

  // get just the data
  const output = allResponses.map(val => val.get({ plain: true }));

  // for each object in the array, add number of upvotes
  // (.map doesn't play nicely with async functions)
  for (let i = 0; i < output.length; i++) {
    output[i].upvotes = await countUpvotes(output[i].id);
  }

  res.render('adminResponses', { all: true, output });
});

router.get('/responses/:id', isAdmin, async (req, res) => {
  // get responses from a single user
  const userResponses = await Response.findAll({
    attributes: ['id', 'content', 'user_id', ['updated_at', 'date']],
    include: {
      model: User,
      attributes: ['username']
    },
    where: { user_id: req.params.id }
  });

  if (userResponses.length === 0) {
    res.send('No responses by that user');
    return;
  }

  // get just the data
  const output = userResponses.map(val => val.get({ plain: true }));

  // for each object in the array, add number of upvotes
  // (.map doesn't play nicely with async functions)
  for (let i = 0; i < output.length; i++) {
    output[i].upvotes = await countUpvotes(output[i].id);
  }

  res.render('adminResponses', { all: false, username: output[0].user.username, output });
});

router.get('/posts', async (req, res) => {
  // get all posts with ID, date, and username
  const allPosts = await Post.findAll({
    attributes: ['id', 'title', 'content', 'user_id', ['updated_at', 'date']],
    include: {
      model: User,
      attributes: ['username']
    }
  });

  if (allPosts.length === 0) {
    res.send('No posts found');
    return;
  }

  // get just the data
  const output = allPosts.map(val => val.get({ plain: true }));

  // for each object in the array, add number of upvotes
  // (.map doesn't play nicely with async functions)
  for (let i = 0; i < output.length; i++) {
    output[i].comments = await countResponses(output[i].id);
  }

  res.render('adminPosts', { all: true, output });
});

router.get('/posts/:id', isAdmin, async (req, res) => {
  // get posts by a specific user
  try {
    const userPosts = await Post.findAll({
      attributes: ['id', 'title', 'content', 'user_id', ['updated_at', 'date']],
      include: {
        model: User,
        attributes: ['username']
      },
      where: { user_id: req.params.id }
    });

    if (userPosts.length === 0) {
      res.send('No posts by that user');
      return;
    }

    // get just the data
    const output = userPosts.map(val => val.get({ plain: true }));

    // for each object in the array, add number of upvotes
    // (.map doesn't play nicely with async functions)
    for (let i = 0; i < output.length; i++) {
      output[i].comments = await countResponses(output[i].id);
    }

    res.render('adminPosts', { all: false, username: output[0].user.username, output });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
