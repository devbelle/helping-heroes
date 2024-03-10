const router = require('express').Router();
const sequelize = require('../config/connection');
const session = require('express-session');
const { Post, Tag, User, TagPost } = require('../models');


router.get('/', async (req, res) => {
  try {

    const postData = await Post.findAll({
      attributes: ['title', 'id', ['created_at', 'date']],
      include: [ {
        model: User,
        attributes: ['username']
      },
      {
        model: Tag,
        attributes: ['name']
      }
      ]
    });

    const postTags = [];

    for (const post of postData) {
    const postId = post.id;
    
    // Query the TagPost model to find tag associations for the post
    const tagPostData = await TagPost.findAll({
    where: {
    post_id: postId
    }
    });



  if (tagPostData.length > 0) {
    // If tag associations are found, extract the tag ids
    const tagIds = tagPostData.map(tagPost => tagPost.tag_id);

    const tagNamesData = await Tag.findAll({
      where: {
        id: tagIds
      }
    });
    
    const tagNames = tagNamesData.map(tag => tag.name);

    const postwithTag = {
    id: postId,
    tag: tagNames
    };

    
    
    postTags.push(postwithTag);
      // Use the extracted tag ids as needed
      console.log(`Post ID #${postId} is associated with the following tags:`, tagNames);
    } else {
      console.log("No tag associations found for the post.");
    }
    
  }
    
  
    const posts = postData.map(post => post.get({ plain: true }));

    const tagData = await Tag.findAll({
      attributes: ['name']
    });

    const tags = tagData.map(tag => tag.get({ plain: true }));

   
  
    res.render('homepage', {
      posts,
      postTags,
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