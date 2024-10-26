const createError = require("http-errors");
// 404 not found handler

function notFoundHandler(req, res, next) {
  next(createError(404, "your requested content is not found"));
  // res.status(404).render("404", { title: "Page Not Found" });
}

//default error handler
function errorHandler(err, req, res, next) {
  res.locals.error =
    process.env.NODE_ENV == "development" ? err : { message: err.message };

  res.status(err.status || 500);

  if (res.locals.html) {
    // html response
    res.render("error", {
      title: "Error page",
    });
  } else {
    // json response
    res.json(res.locals.error);
  }
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
