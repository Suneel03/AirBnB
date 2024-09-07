const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapASync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");
//REVIEWS
//POST REVIEW ROute

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapASync(reviewController.createReview)
);

//deleting review route

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapASync(reviewController.destroyReview)
);

module.exports = router;
