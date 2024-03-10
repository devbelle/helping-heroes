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


//login
router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});


// router.get('/:id', withAuth, async (req, res) => {
//   try {
//     const numberUpvotes = await UserUpvote.findAll({
//       where: {response_id: req.params.id}
//     })
//     // res.status(200).json(countUpvotes);

//     const numberOfUpvotes = numberUpvotes.map(val => val.get({ plain: true }));

//     for (let i = 0; i < numberOfUpvotes.length; i++) {
//       numberOfUpvotes[i].upvotes = await countUpvotes(numberOfUpvotes[i].id);
//     }
//     res.render('dashboard',
//     {
//       logged_in: req.session.logged_in,
//       is_admin: req.session.is_admin,
//       numberOfUpvotes
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

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

//getting one post
// router.get('/post/:id', async (req, res) => {
//     try {
//     const postData = await Post.findByPk(req.params.id, {
//       attributes: [
//         //'id',
//         'title',
//         'content',
//         'score',
//         //'user_id'
//       ],
//       include: [
//         {
//           model: Response,
//           attributes: [ 'content' ],
//           include: {
//             model: User,
//             attributes: ['user_id']
//           },  
//         },
//         //pulls the users on the homepage
//         {
//           model: User,
//           attributes: ['username'],
//           //exclude: ['password']
//         },
//         //including tags to render on home page
//         {
//             model: Tag,
//             attributes: ['name']
//         },
//       ],
//     });
//         const singlePost = postData.get({ plain: true});

//         res.render('single-post', {
//             ...singlePost,
//             loggedIn: req.session.loggedIn,
//             username: req.session.username
//           });
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

//getting one tag
// router.get('/tag/:id', async (req, res) => {
//     //need to get all posts
//     try {
//     const tagData = await Tag.findByPk(req.params.id, {
//       attributes: [
//         //'id',
//         'name'
//       ],
//       include: [ 
//         {
//         model: TagPost,
//         attributes: ['post_id'],
//         }
//       ],
//     });
//         const singleTag = tagData.get({ plain: true});

//         res.render('single-tag', {
//             ...singleTag,
//             loggedIn: req.session.loggedIn,
//             username: req.session.username
//           });
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// router.post('/:id', async (req, res) => {
//     try {
//       const newUpvote = await UserUpvote.create(
//         {
//           user_id: req.session.user_id,
//           response_id: req.params.id
//         }
//       );
//       res.status(200).json(newUpvote);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });
  
  // Route counts the number of upvotes for a given response
  // The response-id is passed in the route
  // The return value is the number of upvotes for that response
  // Note that this should maybe be rewritten as a homeRoute since
  // the result will immediately be rendered somewhere
  // router.get('/:id', async (req, res) => {
  //   try {
  //     const countUpvotes = await UserUpvote.count({
  //       where: {response_id: req.params.id}
  //     })
  //     res.status(200).json(countUpvotes);
  //   } catch (err) {
  //     res.status(500).json(err);
  //   }
  // });
  
  // module.exports = router;