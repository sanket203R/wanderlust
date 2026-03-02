const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const listing = require("../Models/listing.js");
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema,reviewSchema} = require('../schema.js');
const review = require('../Models/review.js');
const { isLoggedIn,isReviewAuthor } = require('../middleware.js');
// const {isLoggedIn,isOwner} = require('../middleware.js');
const reviewController = require('../controller/reviews.js');
const { validateReview } = require('../middleware.js');




router.post('/',isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;