import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

export const home = async (req, res) => {
    try{
        const videos = await Video.find({}).sort({createdAt:"desc"}).populate("owner"); // await은 async 함수 안에서만 사용한다
        return res.render("home", {pageTitle: "Home", videos,})
    } catch(error) {
        return res.render("server_error", {error});
    }
};
export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner").populate("comments");
    if(!video)
        return res.render("404", {pageTitle: "Video Not Found"});  
    return res.render("watch", {pageTitle: `Watching ${video.title}`, video}); 
}; 

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video)
        return res.status(404).render("404", {pageTitle: "Video Not Found"});  
    if(String(video.owner) !== String(req.session.user._id)){
        req.flash("error", "Not authorized");
        return res.status(403).redirect("/");
    }
    return res.render("edit", {pageTitle: `Editing${video.title}`, video})
};
export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({_id:id});
    if(!video)
        return res.status(404).render("404", {pageTitle: "Video Not Found"});  
    if(String(video.owner) !== String(req.session.user._id)){
        return res.status(403).redirect("/");
     }
    await Video.findByIdAndUpdate(id, { // await 안쓰니까 작동을 안했음 꼭 쓰자
        title: title,
        description: description,
        hashtags: Video.formatHashTags(hashtags)
    });    
    return res.redirect(`/videos/${id}`);
}
export const search = async (req, res) =>{
    const { keyword } = req.query;
    let videos = [];
    if (keyword) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "i") // keyword 포함하는 모든 video 가져옴
            }
        }).populate("owner");

    }
    return res.render("search", {pageTitle:"Search", videos});
}
export const getUpload = (req, res) =>{
    return res.render("upload", {pageTitle: "Upload Video"});
}
export const postUpload = async (req, res) =>{
    const { user: { _id } } = req.session;
    const { video, thumb } = req.files;
    const { title, description, hashtags } = req.body;
    try{
    const newVideo = await Video.create({
        title,
        description,
        owner:_id,
        fileUrl: video[0].path, 
        thumbUrl: thumb[0].path.replace(/[\\]/g, "/"), 
        hashtags: Video.formatHashTags(hashtags)
    });
    const user = await User.findById(_id)
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
    } catch(error){
        return res.status(400).render("Upload", {pageTitle: "Upload Video", errorMessage: error.message} );
    }
}
export const deleteVideo = async (req, res) =>{
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video)
        return res.status(404).render("404", {pageTitle: "Video Not Found"});  
    if(String(video.owner) !== String(req.session.user._id)){
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);
    return res.redirect("/")
}
export const registerView = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.sendStatus(404);
    } 
    video.meta.views = video.meta.views + 1;
    video.save();
    return res.sendStatus(200);
    
}
export const createComment = async (req, res) => {
    const { 
        params: { id },
        body: { text },
        session: { user }
    } = req;
    const video = await Video.findById(id);
    if(!video){
        return res.sendStatus(404);
    }
    const comment = await Comment.create({
        text,
        owner: user._id,
        video: id,
    });
    console.log(video);
    video.comments.push(comment._id);
    video.save();
    return res.sendStatus(201);
}
