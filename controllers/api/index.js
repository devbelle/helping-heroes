// routes serving the data (API routes)
const router = require('express').Router();
const postRoutes = require('./postRoutes');
const userRoutes = require('./userRoutes');
const responseRoutes = require('./responseRoutes');
const upvoteRoutes = require('./upvoteRoutes');
const tagRoutes = require('./tagRoutes');

router.use('/posts', postRoutes);
router.use('/users', userRoutes);
router.use('/responses', responseRoutes);
router.use('/upvotes', upvoteRoutes);
router.use('/tags', tagRoutes);

module.exports = router;
