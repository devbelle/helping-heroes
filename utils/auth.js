// TODO: add function for admin approval

const withAuth = (req, res, next) => {
  // If the user is not logged in, redirect the request to the login route
  if (!req.session.logged_in) {
    res.redirect('/login');
  } else {
    next();
  }
};

const isAdmin = (req, res, next) => {
  // middleware to block non-admins
  // eventually send to a different page ("you are not admin, etc...")
  if (!req.session.is_admin) {
    res.redirect('/login');
  } else {
    next();
  }
}

module.exports = { withAuth, isAdmin };
