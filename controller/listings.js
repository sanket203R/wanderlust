const listing = require('../Models/listing.js');
const review = require('../Models/review.js');

    module.exports.index = async (req, res) => {
    let { category, search } = req.query; 
    let filter = {};

    // 1. Handle Multi-Category Filter
    if (category) {
        const categoryList = Array.isArray(category) ? category : [category];
        filter.category = { $in: categoryList };
    }

    // 2. Handle Text Search (Title or Location)
    if (search && search.trim() !== "") {
        // 'i' makes it case-insensitive
        const searchRegex = new RegExp(search.trim(), 'i'); 
        filter.$or = [
            { title: searchRegex },
            { location: searchRegex },
            { country: searchRegex }
        ];
    }

    let allListings = await listing.find(filter);
    
    // Pass the search term back to the EJS to keep it in the input box
    res.render("./listing/index.ejs", { allListings, searchQuery: search });
};

    module.exports.renderNewForm = (req,res)=>{
        res.render("./listing/new.ejs");
    };

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    //here we use populate to get all reviews related to that listing. like in listing schema we have array of reviews id's so to get all details of those reviews we use populate method. means basically using review object id populate will expand to whole review object.
    const oneListing = await listing.findById(id).populate({path: 'reviews', populate: {path: 'author'}}).populate('owner');
    // console.log(review.author);
    if(!oneListing){
        req.flash('error', "Cannot find that listing!");
        return res.redirect('/listings');
    }
    res.render('./listing/show.ejs',{oneListing});
};

module.exports.createListing = async (req, res) => {
    // 1. Extract file info (Multer puts this here)
    if (!req.file) {
        return res.status(400).send("No image file uploaded!");
    }
    const url = req.file.path;
    const filename = req.file.filename;

    const listingData = req.body.listing;

    // 2. Fix category logic
    if (!listingData.category) {
        listingData.category = [];
    } else if (!Array.isArray(listingData.category)) {
        listingData.category = [listingData.category];
    }

    // 3. Create the instance
    const newListing = new listing(listingData);
    newListing.owner = req.user._id;

    // 4. THE FIX: Assign the object directly to avoid "cannot read url of undefined"
    newListing.image = { url, filename }; 

    // 5. Save and Respond
    await newListing.save(); 
    req.flash('success', "New listing created!");
    res.redirect('/listings');
};

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const oneListing = await listing.findById(id);
    if(!oneListing){
        req.flash('error', "Cannot find that listing!");
        return res.redirect('/listings');
    }

    let originalUrl = oneListing.image.url;
    originalUrl = originalUrl.replace(/\/upload\//, '/upload/w_250/'); // Adjust the URL to request a smaller image
    oneListing.image.url = originalUrl;
    res.render("./listing/edit.ejs",{oneListing,originalUrl});
};

module.exports.updateListing = async (req,res)=>{
    let{id} = req.params;
    const listingData = req.body.listing;
    // Check if category is undefined and set it to an empty array if so
    if (!listingData.category) {
        listingData.category = [];
    } else if (listingData.category && !Array.isArray(listingData.category)) {
        listingData.category = [listingData.category];
    }
    let updatedListing = await listing.findByIdAndUpdate(id,{...listingData});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image.url = url;
        updatedListing.image.filename = filename;
        await updatedListing.save();
    }
    req.flash('success', "Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    req.flash('success', "Listing deleted!");
    res.redirect('/listings');
};
