///////////////////////////////////////////////////////////////////////////////
//                             Model Associations                            //
///////////////////////////////////////////////////////////////////////////////

// the four main tables of data
const User = require('./User');
const Post = require('./Post');
const Response = require('./Response');
const Tag = require('./Tag');
// two junction/join tables
const TagPost = require('./TagPost');
const UserUpvote = require('./UserUpvote');

// one-to-many users-to-posts
User.hasMany(Post, {foreignKey: 'user_id'});
Post.belongsTo(User, {foreignKey: 'user_id'});

// one-to-many users-to-responses
User.hasMany(Response, {foreignKey: 'user_id'});
Response.belongsTo(User, {foreignKey: 'user_id'});

// one-to-many posts-to-responses
Post.hasMany(Response, {foreignKey: 'post_id'});
Response.belongsTo(Post, {foreignKey: 'post_id'});

// many-to-many tags-to-posts, use TagPost join table
// https://sequelize.org/docs/v6/core-concepts/assocs/
// https://sequelize.org/docs/v6/advanced-association-concepts/advanced-many-to-many/
Tag.belongsToMany(Post, {through: {model: TagPost}});
Post.belongsToMany(Tag, {through: {model: TagPost}});

// users can upvote responses, responses can have upvotes from many users
// not quite a M:N relationship, we are tracking response upvotes in a separate
// table and we enforce a constraint that a user can only upvote a given
// response once...not sure this will work...
User.hasMany(UserUpvote, {foreignKey: 'user_id'});
UserUpvote.belongsTo(User, {foreignKey: 'user_id'});
Response.hasMany(UserUpvote, {foreignKey: 'response_id'});
UserUpvote.belongsTo(Response, {foreignKey: 'response_id'});

module.exports = {
  User,
  Post,
  Response,
  Tag,
  TagPost,
  UserUpvote
};
