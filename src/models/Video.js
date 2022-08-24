import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {type: String, trim: true},
    description: {type: String, trim: true},
    createdAt: {type: Date, required: true, default: Date.now}, // Date.now()라고 적으면 db에 저장되기 전 시간이 기록된다
    hashtags: [{type:String, trim: true}],
    meta: {
        views: {type: Number, default: 0},
        rating: {type: Number, default: 0},
    }
});

videoSchema.static("formatHashTags", function(hashtags){
    return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));s
});

const movieModel = mongoose.model("Video", videoSchema);
export default movieModel;