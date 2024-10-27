const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const path = require("path");
const { unlink } = require("fs");

const addUserValidators = [
  check("name")
    .isLength({ min: 1 })
    .withMessage("Name is required")
    .isAlpha("en-US", { ignore: " _" })
    .withMessage("Name must not contain anything other than alphabet")
    .trim(),
  check("email")
    .isEmail()
    .withMessage("Email is required")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          throw createError("Email already exists");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("mobile")
    .isMobilePhone("en-US", { strictMode: true })
    .withMessage("Mobile number must be a valid Bangladeshi phone number")
    .custom(async (value) => {
      try {
        const user = await User.findOne({ mobile: value });
        if (user) {
          throw createError("Mobile number already exists");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("password").isStrongPassword().withMessage("Password must be strong"),
];

const addUserValidationHandler = (req, res, next) => {
  const errors = validationResult(req);
  const mappdedErrors = errors.mapped();
  if (Object.keys(mappdedErrors).length > 0) {
    next();
  } else {
    if (req.files.length > 0) {
      const { filename } = req.files[0];
      unlink(
        path.join(__dirname, `/../public/uploads/avatars/${filename}`),
        (err) => {
          if (err) console.log(err);
        }
      );
    }
    res.status(500).json({
      errors: mappdedErrors,
    });
  }
};

module.exports = { addUserValidators, addUserValidationHandler };
