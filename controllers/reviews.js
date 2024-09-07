
const Listing = require("../models/listing.js");
const Review = require("../models/review.js")


//post route
module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new Review saved");
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
  };


//delete route - review delete

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    //by using pull operator deleting refer pull operator mongoose
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  };