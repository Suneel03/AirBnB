const ExpressError = require("./utils/ExpressErros.js");

const {listingSchema,reviewSchema} = require("./schema.js");

const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req,res,next)=>{
 

    if(!req.isAuthenticated()){
           //to move clicked user to re-direct page flow - 1st accessed path
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create a listing");
        
        
        return res.redirect("/login");
    }
    next();
}

module.exports.savedRedirectUrl = (req,res,next)=>{

    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","You don't have permission to edit this");
     return res.redirect(`/listings/${id}`);
    }
    next();

}

module.exports.isReviewAuthor = async(req,res,next)=>{
  let { id,reviewId} = req.params;
  let review = await Review.findById(reviewId);

  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You are not author of this listing");
   return res.redirect(`/listings/${id}`);
  }
  next();

}

//validateListing function middleware

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//validateListing function middleware

module.exports.validateReview  = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);

    if(error){
    let errMsg = error.details.map((el) =>el.message).join(",");
    throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};