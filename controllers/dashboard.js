const router = require('express').Router();
const sequelize = require('../config/connection');
const { withAuth } = require('../utils/auth');
const session = require('express-session');
const { Post, Response, Tag, TagPost, User, UserUpvote} = require('../models');
const { countUpvotes } = require('../utils/count');


//dashboard
router.get('/', withAuth, async (req, res) => {
  try {
  const userData = await User.findByPk(req.session.user_id, {
    attributes: [
      'username',
      'email'
    ],
    
    include: [
      {
        model: Response,
        attributes: ['content' ],
          
      },
      
      {
        model: Post,
        attributes: ['title', 'content'],
       
      },
      
    ],
  });
  const users = userData.get({ plain: true});

  res.render('dashboard', {
    ...users,
    logged_in: req.session.logged_in,
    is_admin: req.session.is_admin,
    username: req.session.username
  });
  } catch (err) {
      res.status(500).json(err);
  }
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