export const trending = (req, res) => {
    res.send("Home page Videos");
}
export const see = (req, res) => {
    res.send(`Watch Videos #${req.params.id}`);
}
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