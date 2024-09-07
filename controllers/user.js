const User = require("../models/user")

const Listing = require("../models/listing.js");


//signup form
module.exports.renderSignupForm =  (req, res) => {
    res.render("users/signup.ejs");
  };

//signup 
module.exports.signup = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser,(err)=>{
        if(err){
          return next(err);
        }
        req.flash("success", "Welcome to WanderLust !");
        res.redirect("/listings");
      });

    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  }; 

  //login form render
  
module.exports.renderLoginForm =  (req, res) => {
    res.render("users/login.ejs");
  };

//Login
module.exports.login =  async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!!");
    //if redirected url is empty then page should be not found so you can redirect to listings
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  };



//logout 

module.exports.logout = (req,res,next)=>{

    req.logout((err)=>{
        if(err){
        return next(err);
        }
        req.flash("success","you are logged out!!");
        res.redirect("/listings");
    })
};


//search



 // Search functionality

 module.exports.search = async (req, res) => {
  const { title } = req.query;

  try {
    const searchOptions = {
      title: { $regex: new RegExp(title, 'i') } // Case-insensitive search
    };

    const listings = await Listing.find(searchOptions);

    if (listings.length === 0) {
      req.flash('error', 'No listings found with that title.');
      return res.redirect('/listings');
    }
   
    res.render('listings/search-results', { listings });
  } catch (error) {
    console.error('Error searching listings:', error);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/listings');
  }
};
