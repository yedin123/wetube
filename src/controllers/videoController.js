
export const trending = (req, res) => {
    const videos = [
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
    return res.render("home", {pageTitle: "Home", videos: videos})
};

export const see = (req, res) => res.render("watch", {pageTitle: "Watch"});

export const edit = (req, res) => {
    res.send("Edit Videos");
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