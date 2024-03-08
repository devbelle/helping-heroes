const router = require('express').Router();
const sequelize = require('../config/connection');
const session = require('express-session');
const { withAuth } = require('../utils/auth');
const { Post, Response, Tag, TagPost, User, UserUpvote} = require('../models');


router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      attributes: ['title', 'content'],
      include: [ {
        model: User,
        attributes: ['username']
      },
      {
        model: Tag,
        attributes: ['name']
      }
      ]
   
       // Include title and content from Post model
    });

    const posts = postData.map(post => post.get({ plain: true }));


    const tagData = await Tag.findAll({
      attributes: ['name']
    });

    const tags = tagData.map(tag => tag.get({ plain: true }));


    res.render('homepage', {
      posts,
      tags,
      loggedIn: req.session.loggedIn,
      username: req.session.username
    });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});





module.exports = router;