// routes serving the data (API routes)
const router = require('express').Router();
const postRoutes = require('./postRoutes');
const userRoutes = require('./userRoutes');
const responseRoutes = require('./responseRoutes');

router.use('/posts', postRoutes);
router.use('/users', userRoutes);
router.use('/responses', responseRoutes);

module.exports = router;
