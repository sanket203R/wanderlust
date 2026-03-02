const mongoose = require('mongoose');
const mongo_URL = 'mongodb://127.0.0.1:27017/wanderlust'
const initData = require("./data.js");
const listing = require("../Models/listing.js");
const { init } = require('../Models/user.js');


async function main(){
    await mongoose.connect(mongo_URL);
}

main()
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log(err);
});


const  initDB = async () =>{
    await listing.deleteMany({});
    initData.data = initData.data.map(listing=>{
        return {
            ...listing,
            owner: "698f66eb4809ef537b992e0d" // Hardcoded owner ID for initialization
        };
    });
    await listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();
