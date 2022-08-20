let videos = [
    {
        title:"First video",
        rating:5,
        comments:2,
        createdAt:"50 minutes ago",
        views:10032,
        id:1
    },
    {
        title:"Second video",
        rating:5,
        comments:2,
        createdAt:"10 minutes ago",
        views:10032,
        id:2
    },{
        title:"Third video",
        rating:5,
        comments:2,
        createdAt:"2 minutes ago",
        views:10032,
        id:3
    }
]

export const trending = (req, res) => {
    return res.render("home", {pageTitle: "Home", videos})
};

export const watch = (req, res) => {
    const { id } = req.params;
    const video = videos[id-1]
    return res.render("watch", {pageTitle: `Watching ${video.title}`, video})
};

export const getEdit = (req, res) => {
    const { id } = req.params;
    const video = videos[id-1]
    return res.render("edit", {pageTitle: `Editing: ${video.title}`, video})
};
export const postEdit = (req, res) => {
    const { id } = req.params;
    const { newTitle } = req.body;
    videos[id-1].title = newTitle;
    return res.redirect(`/videos/${id}`);
}
export const search = (req, res) =>{
    res.send("Search");
}
export const upload = (req, res) =>{
    res.send("Upload");
}
export const deleteVideo = (req, res) =>{
    res.send("Delete Video");
}