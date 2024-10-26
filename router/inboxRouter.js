const express = require("express");
const getInbox = require("../controller/inboxController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");

const router = express.Router();

router.get("/", decorateHtmlResponse("inbox"), getInbox);

module.exports = router;
