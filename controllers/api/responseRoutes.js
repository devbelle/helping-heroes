///////////////////////////////////////////////////////////////////////////////
//                            Response API Routes                            //
///////////////////////////////////////////////////////////////////////////////

/*
 * API routes to create, edit, and delete a Resonse to a post
 * Regular users can only edit/delete their own Responses
 * Admins can delete any Response
 */

const router = require('express').Router();
const session = require('express-session');
const { Response } = require('../../models');
const { withAuth } = require('../../utils/auth');

// Create a new response
// req.body should include "post_id" and "content" fields
// Return value is the new post (JSON format)
router.post('/', withAuth, async (req, res) => {
  try {
    const newResponse = await Response.create(
      {
        user_id: req.session.user_id,
        ...req.body
      }
    );
    res.status(200).json(newResponse);
  } catch (err) {
    res.status(500).json(err);
  }
});

// User can edit an existing response
// req.body should include "post_id" and "content"
// To be successful, post_id must match the post the user is responding to
// Successful edit returns the number of records affects (JSON array)
router.put('/:id', withAuth, async (req, res) => {
  try {
    // validation that the response by the user exists
    const getResponse = await Response.findByPk(req.params.id);

    if (!getResponse) {
      res.status(400).json('Error: response with that ID does not exist.');
      return;
    } else if (getResponse.user_id !== req.session.user_id) {
      res.status(400).json('Error: user not authorized to edit this comment');
      return;
    }

    // now we can update
    const updateResponse = await Response.update(req.body, {
      where: { id: req.params.id, user_id: req.session.user_id }
    });

    res.status(200).json(updateResponse);

  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a response
// Users can delete their own response, admins can delete any response
// Return value is the number of items deleted (JSON)
router.delete('/:id', withAuth, async (req, res) => {
  try {
    let deletedResponse;
    if (req.session.is_admin) {
      // allow an admin to delete any response
      deletedResponse = await Response.destroy({ where: { id: req.params.id } });
    } else {
      // users can only delete their own response
      deletedResponse = await Response.destroy({
        where: { id: req.params.id, user_id: req.session.user_id }
      });
    }
    res.status(200).json(deletedResponse);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
