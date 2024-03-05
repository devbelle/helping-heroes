///////////////////////////////////////////////////////////////////////////////
//                               Tag API Routes                              //
///////////////////////////////////////////////////////////////////////////////

/*
 * Tags-to-Posts is a many-to-many relationship that goes thru the TagPost
 * join table. There are some constraints in tagging posts:
 * - only the author of the post can tag it
 * - a tag can only be applied to a give post once.
 * The TagPost model has a composite PK (tag_id and post_id) that
 * enforces uniqueness. The route logic has to ensure only the
 * author of a post can tag it.
 */

const router = require('express').Router();
const session = require('express-session');
const { TagPost, Post } = require('../../models');
const { withAuth } = require('../../utils/auth');

// apply a tag to a given post
// the route URL contains the tag_id
// req.body must contain the post_id
// only the user who authored the post can apply a tag
router.post('/:id', withAuth, async (req, res) => {
  try {
    // confirm that this user created the post
    const postData = await Post.findByPk(req.body.post_id);
    if (postData.user_id !== req.session.user_id) {
      res.status(400).json('Error: user cannot tag this post');
      return;
    }

    const newTag = await TagPost.create(
      {
        tag_id: req.params.id,
        ...req.body
      }
    );
    res.status(200).json(newTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

// remove a tag from a post
// the route URL contains the tag_id
// req.body must contain the post_id
// only the user who authored the post can delete a tag
router.delete('/:id', withAuth, async (req, res) => {
  try {
    // confirm that this user created the post
    const postData = await Post.findByPk(req.body.post_id);
    if (postData.user_id !== req.session.user_id) {
      res.status(400).json('Error: user cannot delete this tag');
      return;
    }

    const deletedTag = await TagPost.destroy({
      where: {tag_id: req.params.id, post_id: req.body.post_id}
    });
    res.status(200).json(deletedTag);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
