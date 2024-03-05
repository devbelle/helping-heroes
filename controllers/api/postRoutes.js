// create/delete/edit posts
const router = require('express').Router();
const session = require('express-session');
const { Post } = require('../../models');

// user creates a new post
// will eventually require authorization middleware
