const sequelize = require('../config/connection');
// import models
const { Post, Response, Tag, TagPost, User, UserUpvote } = require('../models/index.js');
// import file data
const userData = require('./userData.json');
const postData = require('./postData.json');
const responseData = require('./responseData.json');
const tagData = require('./tagData.json');

const seedDatabase = async () => {
  // create the tables, overwriting if necessary
  await sequelize.sync({ force: true });

  // seed users
  const allUsers = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  // seed tags
  const allTags = await Tag.bulkCreate(tagData);

  // posts with random user IDs
  for (const post of postData) {
    await Post.create({
      ...post,
      user_id: allUsers[Math.floor(Math.random() * allUsers.length)].id,
    });
  }

  // get the array of posts we just created
  const allPosts = await Post.findAll();

  // seed responses with randonly generated user IDs and post IDs
  for (const response of responseData) {
    await Response.create({
      ...response,
      user_id: allUsers[Math.floor(Math.random() * allUsers.length)].id,
      post_id: allPosts[Math.floor(Math.random() * allPosts.length)].id,
    })
  }

  // get the array of responses we just created
  const allResponses = await Response.findAll();

  // loop through each post and then each tag
  // 25% chance that a given tag is assigned to a given post
  for (const post of allPosts) {
    for (const tag of allTags) {
      if (Math.random() < 0.25) {
        await TagPost.create({
          tag_id: tag.id,
          post_id: post.id
        });
      }
    }
  }

  // loop through each user and then each response, flip a coin
  // on whether the user will upvote the response
  for (const user of allUsers) {
    for (const response of allResponses) {
      if (Math.random() < 0.5) {
        await UserUpvote.create({
          user_id: user.id,
          response_id: response.id
        });
      }
    }
  }

  process.exit(0);
};

seedDatabase();
