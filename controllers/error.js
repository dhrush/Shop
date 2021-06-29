function get404Page(req, res, next) {
  res.status(404).render("error404", {
    docTitle: "Page Not Found",
    path: "/error404",
    isAuthenticated: req.session.isLoggedIn,
  });
}

function get500Page(req, res, next) {
  res.status(500).render("500", {
    docTitle: "Error!!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
}

module.exports = { get404Page, get500Page };
