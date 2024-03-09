const router = require('express').Router();
const sequelize = require('../config/connection');
const { withAuth } = require('../utils/auth');
const session = require('express-session');
const { Post, Response, Tag, TagPost, User, UserUpvote} = require('../models');


//getting all posts on the page 
// router.get('/', async (req, res) => {
//     try {
//     const postData = await Post.findAll({
//       attributes: [
//         //'id',
//         'title',
//         'content',
//         'score',
//         //'user_id'
//       ],
//       //including the response and the user_id of the responder
//       include: [
//         {
//           model: Response,
//           attributes: ['content' ],
//           include: {
//             model: User,
//             attributes: ['user_id']
//           },  
//         },
//         //pulls the users on teh homepage
//         {
//           model: User,
//           attributes: ['username'],
//           //exclude: ['password', 'email']
//         },
//         //including tags to render on home page
//         {
//             model: Tag,
//             attributes: ['name']
//         }
//       ],
//     });
//     const posts = postData.map(posts => posts.get({ plain: true }));

//     res.render('homepage', {
//         posts,
//         loggedIn: req.session.loggedIn,
//         username: req.session.username
//     });
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

//dashboard
router.get('/', withAuth, async (req, res) => {
  try {
  const userData = await User.findByPk(req.session.user_id, {
    attributes: [
      'username',
      'email'
    ],
    //including the response and the user_id of the responder
    include: [
      {
        model: Response,
        attributes: ['content' ],
        // include: {
        //   model: User,
        //   attributes: ['user_id']
        // },  
      },
      //pulls the users on teh homepage
      {
        model: Post,
        attributes: ['title', 'content'],
        // include: [{
        //   model: TagPost,
        //   include: [{
        //     model: Tag,
        //     attribute: ['name']
        //   }]
        // }]
        //exclude: ['password', 'email']
      }
      //including tags to render on home page
     
      // {
      //   model: UserUpvote,
      //   attribute: ['response_id']
      // },
    ],
  });
  const users = userData.get({ plain: true});

  res.render('dashboard', {
    ...users,
    logged_in: req.session.logged_in,
    is_admin: req.session.is_Admin,
    user_id: req.session.user_id
  });
  } catch (err) {
      res.status(500).json(err);
  }
});
//get all tags
// router.get('/', async (res, res) => {
//     try {
//         const tagData  = await Tag.findAll({
//             attributes: [ 'name'],
//             include: [
//                 {
//                     model: TagPost,
//                     attributes: ['post_id'],

//                 },
//             ],

//         });
//         const tags = tagData.map(tags => tags.get({ plain: true }));

//         res.render('homepage', {
//             tags,
//             loggedIn: req.session.loggedIn,
//             username: req.session.username
//         });
//         } catch (err) {
//             res.status(500).json(err);
//         }
//     });





//to log into with username and password
// router.post('/login', async (req, res) => {
//     try {
//       const userData = await User.findOne({ where: { email: req.body.email } });
// for homeRoutes later [Op.or]: [{email: req.body.username}, {username: req.body.username}]
  
//       if (!userData) {
//         res
//           .status(400)
//           .json({ message: 'Incorrect email or password, please try again' });
//         return;
//       }
  
//       const validPassword = await userData.checkPassword(req.body.password);
  
//       if (!validPassword) {
//         res
//           .status(400)
//           .json({ message: 'Incorrect email or password, please try again' });
//         return;
//       }
  
//       req.session.save(() => {
//         req.session.user_id = userData.id;
//         req.session.username = userData.username;
//         req.session.logged_in = true;
        
//         res.json({ user: userData, message: 'You are now logged in!' });
//       });
  
//     } catch (err) {
//       res.status(400).json(err);
//     }
//   });

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
  router.get('/:id', async (req, res) => {
    try {
      const countUpvotes = await UserUpvote.count({
        where: {response_id: req.params.id}
      })
      res.status(200).json(countUpvotes);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  module.exports = router;