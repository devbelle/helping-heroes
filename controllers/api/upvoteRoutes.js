///////////////////////////////////////////////////////////////////////////////
//                             Upvote API Routes                             //
///////////////////////////////////////////////////////////////////////////////

const router = require('express').Router();
const session = require('express-session');
const { UserUpvote } = require('../../models');
const { withAuth } = require('../../utils/auth');

// Input is the ID of the response to be upvoted and the ID of the user
// Only logged-in users can upvote, and they can only upvote a given response once.
// response-id is passed in the route, user_id in the session; req.body is not used.
// Function returns the updated record as JSON
router.post('/:id', withAuth, async (req, res) => {
  try {
    const newUpvote = await UserUpvote.create(
      {
        user_id: req.session.user_id,
        response_id: req.params.id
      }
    );
    res.status(200).json(newUpvote);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
