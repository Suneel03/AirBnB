const express = require("express");
const router = express.Router();
const wrapASync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer = require("multer");
const{storage} = require("../cloudconfig.js")
const upload = multer({ storage });




//refer route.route in express
router
  .route("/")
  .get(wrapASync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapASync(listingController.createListing)
  );

    // Add a route to filter by category using query parameters
    router.get("/filter", wrapASync(listingController.filterByCategory));



router.get("/new", isLoggedIn, listingController.renderNewForm);



//Search

// Search Listings by title

// SHOW -UPDATE- Destroy ROUTE

router
  .route("/:id")
  .get(wrapASync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapASync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapASync(listingController.destroyListing));

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapASync(listingController.renderEditForm)
);


module.exports = router;
