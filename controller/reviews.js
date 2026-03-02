const listing = require('../Models/listing.js');
const review = require('../Models/review.js');

module.exports.createReview = async (req,res)=>{
    let {id} = req.params;
    const oneListing = await listing.findById(id);
    const newReview = new review(req.body.review);
    newReview.author = req.user._id; // Set the author field to the current user's ID
    oneListing.reviews.push(newReview);
    await newReview.save();
    await oneListing.save();
    req.flash('success', "New review created!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async (req,res)=>{
    let {id, reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash('success', "Review deleted!");
    res.redirect(`/listings/${id}`);
};