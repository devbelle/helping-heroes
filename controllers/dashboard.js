const router = require('express').Router();
const sequelize = require('../config/connection');
const { withAuth } = require('../utils/auth');
const session = require('express-session');
const { Post, Response, Tag, TagPost, User, UserUpvote} = require('../models');
const { countUpvotes } = require('../utils/count');


//dashboard
router.get('/', withAuth, async (req, res) => {
  try {
  const postData = await Post.findAll({
    attributes: [
      'id',
      'title',
      'content'
    ], 

    where: {user_id: req.session.user_id},
    
    include: [
      {
        model: Response,
        attributes: ['content'],
      },
      
    ],
  });
  const posts = postData.map(val => val.get({ plain: true}));

  const responses = await Response.findAll({
    where: {user_id: req.session.user_id}
  });

  const userUpvotes = responses.map(val => val.get({ plain: true }));

  for (let i = 0; i < userUpvotes.length; i++) {
    userUpvotes[i].upvotes = await countUpvotes(userUpvotes[i].id);
  }

  res.render('dashboard', {
    ...posts,
    ...responses,
    ...userUpvotes,
    loggedIn: req.session.loggedIn,
    is_admin: req.session.is_admin,
    username: req.session.username
  });
  } catch (err) {
      res.status(500).json(err);
  }
});


//logout 
router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  });


  
 module.exports = router;