const router = require('express').Router();
const { Post, Tag, User } = require('../models');


router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      attributes: ['title', 'content', 'id', ['created_at', 'date']],
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
      logged_in: req.session.logged_in,
      username: req.session.username
    });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
if (req.session.logged_in) {
  res.redirect('/dashboard', {
    logged_in: req.session.logged_in,
    is_admin: req.session.is_admin,
    username: req.session.username
  })
  return;
}

res.render ('login');
});




module.exports = router;