///////////////////////////////////////////////////////////////////////////////
//                              Post API Routes                              //
///////////////////////////////////////////////////////////////////////////////

/**
 * API routes to create, delete, and edit Helping Heroes posts
 * Regular users can only operate on their own posts.
 * Admins can delete any post
 */

const router = require('express').Router();
const session = require('express-session');
const { Post } = require('../../models');
const { withAuth } = require('../../utils/auth');

// user creates a new post
// req.body should have "title" and "content" fields
router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create(
      {
        user_id: req.session.user_id,
        ...req.body
      }
    );
    res.status(200).json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// user deletes their own post
// admin can delete any post
router.delete('/:id', withAuth, async (req, res) => {
  try {
    let deletedPost;
    if (req.session.is_admin) {
      // allow admin to delete any post
      deletedPost = await Post.destroy({ where: { id: req.params.id } });
    } else {
      // user can only delete their own post
      deletedPost = await Post.destroy({
        where: { id: req.params.id, user_id: req.session.user_id }
      });
    }
    if (deletedPost) {
      res.status(200).json('Deleted');
    } else {
      res.status(400).json('Invalid post/user.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// user edits their own post
// req.body should have "title" and "content" fields
router.put('/:id', withAuth, async (req, res) => {
  try {
    // validation that a post by the user exists with the submitted ID
    const postID = req.params.id;
    const userID = req.session.user_id;

    const getPost = await Post.findByPk(postID);

    if (!getPost) {
      res.status(400).json("Error: post with that ID does not exist");
      return;
    } else if (getPost.user_id !== userID) {
      res.status(400).json("Error: user not authorized to edit this post");
      return;
    };

    // update post title, summary, and/or content
    const updatePost = await Post.update(req.body, {
      where: { id: postID }
    });
    res.status(200).json(updatePost);

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
