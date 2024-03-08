///////////////////////////////////////////////////////////////////////////////
//                                User Routes                                //
///////////////////////////////////////////////////////////////////////////////

/*
 * API routes for users: login, logout, user creation
 * APIs restricted to admins:
 * - list all users
 * - ban users
 * - delete users
 * - create new admin user
 */

const router = require('express').Router();
const { User } = require('../../models');
const { Op } = require('sequelize');
const { isAdmin } = require('../../utils/auth');

// create new user: /api/users POST route
// input username, email, and password as JSON
router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      // values below are default in the model
      req.session.is_admin = false;
      req.session.is_banned = false;
    });

    res.status(200).json(userData);

  } catch (err) {
    res.status(400).json(err);
  }
});

// check login input against User table in DB
// submit username/password (but username can be email address)
router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({
      where: {
        // user may input either username or password on login form
        [Op.or]: [{email: req.body.username}, {username: req.body.username}]
      }
    });

    if (!userData) {
      res.status(400).json({ message: 'Could not find username/email' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password, please try again' });
      return;
    }

    // if user is banned do not let them log in
    if (userData.is_banned) {
      res.status(400).json({ message: `User ${UserData.id} is banned` });
      return;
    }

    const loginMessage = userData.is_admin ?
          'You are logged in as an admin!' :
          'You are now logged in!';

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      req.session.is_admin = userData.is_admin;
      req.session.is_banned = userData.is_banned;
      res.status(200).json({ user: userData, message: loginMessage});
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

// Logging out destroys the session/cookie
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// list all users, including passwords
// Only admins can use this route
router.get('/', isAdmin, async (req, res) => {
  try {
    const allUsers = await User.findAll();
    res.status(200).json(allUsers);
  } catch (err) {
    res.status(500).json(err);
  }
});

// toggle the "is_banned" state of a user
router.put('/ban/:id', isAdmin, async (req, res) => {
  try {
    // user can't ban himself/herself
    if (req.params.id == req.session.user_id) {
      res.status(400).json('Error: user cannot ban himself/herself.');
      return;
    };

    // get the current value of the flag
    const banState = await User.findByPk(req.params.id, {attributes: ['is_banned']});

    // toggle the is_banned state
    const bannedUser = await User.update(
      { is_banned: !banState.is_banned },
      { where: { id: req.params.id } }
    );

    if (banState.is_banned) {
      res.status(200).json({ message: `User ${req.params.id} is no longer banned.` })
    } else {
      res.status(200).json({ message: `User ${req.params.id} has been banned.` })
    }

  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a user
router.delete('/delete/:id', isAdmin, async (req, res) => {
  try {
    // user can't delete himself/herself
    if (req.params.id == req.session.user_id) {
      res.status(400).json('Error: user cannot delete himself/herself.');
      return;
    };

    const deletedUser = await User.destroy({ where: { id: req.params.id } });

    res.status(200).json(`User ${req.params.id} has been deleted.`);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new admin user
router.post('/admin', isAdmin, async (req, res) => {
  try {
    const adminUser = await User.create({
      is_admin: true,
      ...req.body
    });

    req.session.save(() => {
      req.session.user_id = adminUser.id;
      req.session.logged_in = true;
      req.session.is_admin = true;
      req.session.is_banned = false;
    });

    res.status(200).json(adminUser);

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
