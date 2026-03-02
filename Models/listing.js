const  mongoose  = require("mongoose");
const review = require("./review");

const ListingSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description : String,
    image: {
        type: {
            url: String,
            filename: String
        },
        default: {
            //here we use default if user don't enter any string(url) then it will store as link
            url: "https://www.tourmyindia.com/states/goa/image/beaches-goa.webp",
            filename: "defaultimage"
        },
        //here we set value of image if user enter empty string means if user don't fill this image url in form.it will use when we work with ui means when actual user will insert data in  database. 
        set: (v) => {
            // If v is an empty string or null/undefined, return the default object
            if (!v || v === "" || (typeof v === 'object' && v.url === "")) {
                return {
                    url: "https://www.tourmyindia.com/states/goa/image/beaches-goa.webp",
                    filename: "defaultimage"
                };
            }
            return v;
        }
    },
    
    
    price:Number,
    location : String,
    country : String,
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    category: {
        type: [String],
        enum: ['Trending','Rooms','IconicCites','Mountains','Castles','AmazingPools','Camping','Farms','Arctic']
    },
});

ListingSchema.post("findOneAndDelete", async function(listing){
    if(listing){
        await review.deleteMany({_id:{ $in: listing.reviews}});
    }
});

const listing = mongoose.model("Listing",ListingSchema);
module.exports = listing;