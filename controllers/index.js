// all the routes that will be available to the server
const router = require('express').Router();

const apiRoutes = require('./api');
const dashboardRoutes = require('./dashboard');
const homeRoutes = require('./homeRoutes');
router.use('/api', apiRoutes);
router.use('/', homeRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
