function get404Page(req, res, next) {
  res.status(404).render("error404", {
    docTitle: "Page Not Found",
    path: "/error404",
    isAuthenticated: false,
  });
}

module.exports = { get404Page };
