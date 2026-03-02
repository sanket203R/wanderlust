const listing = require('./Models/listing.js');
const review = require('./Models/review.js');
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema,reviewSchema} = require('./schema.js');

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        // console.log(req.session.redirectUrl);
        req.flash('error', "You must be signed in first!");
        return res.redirect('/login');
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.currPath = ((req, res, next) => {
    res.locals.currPath = req.path;
    next();
});

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;  
    let oneListing = await listing.findById(id);
    if(!oneListing.owner.equals(res.locals.currentUser._id)){
        req.flash('error', "You are not the owner of this listing!");
        return res.redirect('/listings');
    }
    next();
};

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id, reviewId} = req.params;
    let oneReview = await review.findById(reviewId);
    if(!oneReview.author.equals(res.locals.currentUser._id)){
        req.flash('error', "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error.details[0].message);
    }
    next();
};

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error.details[0].message);
    }
    else{
        next();
    }
};