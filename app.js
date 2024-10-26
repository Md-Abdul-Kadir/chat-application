const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");

//internal import
const {
  errorHandler,
  notFoundHandler,
} = require("./middlewares/common/errorHandler");
const loginRouter = require("./router/loginRouter");
const userRouter = require("./router/userRouter");
const inboxRouter = require("./router/inboxRouter");

const app = express();
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useCreateIndex: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.console.log(err));

//request parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//set view engine
app.set("view engine", "ejs");

//set static folder
app.use(express.static(path.join(__dirname, "public")));

//parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

//routing setup

app.use("/", loginRouter);
app.use("/users", userRouter);
app.use("/inbox", inboxRouter);

//error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// PORT
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`); // eslint-disable-line no-console
});
