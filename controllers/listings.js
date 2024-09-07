const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


//index mvc
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  };


  //filter

  // Controller for filtering by category

  module.exports.filterByCategory = async (req, res) => {
    const { category } = req.query;

    const filteredListings = await Listing.find({ 'geometry.category': category });

    if (filteredListings.length === 0) {
      req.flash('error', 'This filtered category is not available.');
      return res.redirect('/listings'); // Redirect to a relevant route or page
    }
    

    res.render('listings/index.ejs', { allListings: filteredListings });
  };
  




// new route

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
  };

//show route

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path:"reviews",
      populate: {
        path:"author",
      },
    }).populate("owner");
    if (!listing) {
      req.flash("error", "The listing you requested does not exist!!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  };

  //create route

  module.exports.createListing = async (req, res, next) => {
  
    const categories = [
      "Trending", "Rooms", "Iconic Cities", "Mountains", "Castles",
      "Amazing Pools", "Camping", "Farms", "Arctic", "Domes", "Boats"
    ];

    let response = await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1
    })
      .send();

   let url =req.file.path;
   let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};

    newListing.geometry = response.body.features[0].geometry;

    newListing.geometry.category  = categories[Math.floor(Math.random() * categories.length)] // Random category if missing

   let savedListing = await newListing.save();
   console.log(savedListing);

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  };



  
  



  //edit form

  module.exports.renderEditForm  = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "The listing you requested does not exist!!");
      res.redirect("/listings");
    }
   let originalImageUrl = listing.image.url;
   originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", { listing,originalImageUrl });
  };





  

  //update listing

  module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

   let listing =  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  
   
  console.log(listing);
//while editing image uploading new image is file exist or not , if not add previous image
   if(typeof req.file !=="undefined"){
    //image update
   let url =req.file.path;
   let filename = req.file.filename;
   listing.image = {url,filename};
   await listing.save();
   }


    req.flash("success", "Listing Updated !");
    res.redirect(`/listings/${id}`);
  };

 
  
  //delete listing or Destroy

  module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id, {
      ...req.body.listing,
    });
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  };