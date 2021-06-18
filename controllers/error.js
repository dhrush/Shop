function get404Page(req, res, next) {
  res.status(404).render("shop/error404", {
    docTitle: "Page Not Found",
    path: "/error404",
  });
}

module.exports = { get404Page };
