import Video from "../models/Video";

export const home = async (req, res) => {
    try{
        const videos = await Video.find({}).sort({createdAt:"desc"}); // await은 async 함수 안에서만 사용한다
        return res.render("home", {pageTitle: "Home", videos})
    } catch(error) {
        return res.render("server_error", {error});
    }
};

export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video)
        return res.render("404", {pageTitle: "Video Not Found"});  
    return res.render("watch", {pageTitle: `Watching ${video.title}`, video}); 
};

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video)
        return res.status(404).render("404", {pageTitle: "Video Not Found"});  
    return res.render("edit", {pageTitle: `Editing${video.title}`, video})
};
export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({_id:id});
    if(!video)
        return res.status(404).render("404", {pageTitle: "Video Not Found"});  
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
        });

    }
    return res.render("search", {pageTitle:"Search", videos});
}
export const getUpload = (req, res) =>{
    return res.render("upload", {pageTitle: "Upload Video"});
}
export const postUpload = async (req, res) =>{
    const { title, description, hashtags } = req.body;
    try{
    await Video.create({
        title,
        description,
        hashtags: Video.formatHashTags(hashtags)
    });
    return res.redirect("/");
    } catch(error){
        return res.status(400).render("Upload", {pageTitle: "Upload Video", errorMessage: error.message} );
    }

}
export const deleteVideo = async (req, res) =>{
    const { id } = req.params;
    await Video.findByIdAndDelete(id);
    return res.redirect("/")
}