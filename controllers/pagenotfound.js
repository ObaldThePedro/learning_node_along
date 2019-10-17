exports.notFound = (req, res, next) => {
  res.status(404).render("shop/404", { pageTitle: "Page Not Found" });
};
