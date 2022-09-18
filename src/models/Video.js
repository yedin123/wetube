import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {type: String, trim: true, required: true},
    description: {type: String, trim: true, required: true},
    fileUrl: {type: String, required: true},
    thumbUrl: {type: String, required: true},
    createdAt: {type: Date, required: true, default: Date.now}, // Date.now()라고 적으면 db에 저장되기 전 시간이 기록된다
    hashtags: [{type:String, trim: true}],
    comments: [{type:mongoose.Schema.Types.ObjectId, required:true, ref:"Comment"}],
    meta: {
        views: {type: Number, default: 0, required: true},
        rating: {type: Number, default: 0, required: true},
    },
    owner: {type:mongoose.Schema.Types.ObjectId, required:true, ref:"User"},
});

videoSchema.static("formatHashTags", function(hashtags){
    return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));s
});

const movieModel = mongoose.model("Video", videoSchema);
export default movieModel;