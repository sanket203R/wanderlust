const  mongoose  = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    rating:{
        type: Number,
        min:1,
        max:5
    },
    comment: String,
    createdAt:{
        type: Date,
        default: Date.now()
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
});

module.exports = mongoose.model("Review",ReviewSchema);