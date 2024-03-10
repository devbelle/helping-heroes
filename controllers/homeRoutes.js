const router = require('express').Router();
const sequelize = require('../config/connection');
const session = require('express-session');
const { Post, Tag, User } = require('../models');

router.get('/', async (req, res) => {
  try {
// Fetch all posts including associated tags
const allPosts = await Post.findAll({
  attributes: ['id', 'title', 'content', ['updated_at', 'date']],
  include: [
    {
      model: User,
      attributes: ['username']
    },
    {
      model: Tag,
      attributes: ['name']
    }
  ]
});

// Process each post to include tags
const processedPosts = allPosts.map(post => {
  const postData = post.get({ plain: true });
  const tagArray = [];

  // Extract tag names from each tag object
  postData.tags.forEach(tag => {
    tagArray.push(tag.name);
  });

  delete postData.tags;
  postData.tags = tagArray.join(', ');

  return postData;
});

const tagData = await Tag.findAll({
attributes: ['name']
});

const tags = tagData.map(tag => tag.get({ plain: true }));

    // res.json(processedPosts);
    res.render('homepage', {
      posts: processedPosts,
      tags,
      logged_in: req.session.logged_in,
      is_admin: req.session.is_admin,
      username: req.session.username
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

module.exports = router;
