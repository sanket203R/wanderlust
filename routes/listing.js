const express = require('express');
const router = express.Router();

const listing = require("../Models/listing.js");
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema,reviewSchema} = require('../schema.js');
const  {isLoggedIn,isOwner} = require('../middleware.js');
const review = require('../Models/review.js');
const { validateListing } = require('../middleware.js');
const listingController = require('../controller/listings.js');
const multer  = require('multer');
const { storage } = require('../cloudConfig.js');
// const upload = multer({ storage });
// const upload = multer({ dest: 'uploads/' });

const upload = multer({ dest: 'uploads/' });

router
    .route('/')
        .get(wrapAsync(listingController.index))
        .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));
       
        // .post(upload.single('listing[image][url]'),(req,res)=>{
        //     console.log(req.file);
        //     res.send("File uploaded successfully!");
        // }); 


//add new listing
router.get('/new',isLoggedIn,listingController.renderNewForm);

router
    .route('/:id')
        .get(wrapAsync(listingController.showListing))
        .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
        .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


//edit listing
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


module.exports = router;
