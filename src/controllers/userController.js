import User from "../models/User";

export const getJoin = (req, res) => {
    res.render("join", {pageTitle: "Join"});
}
export const postJoin = async (req, res) => {
    const {name, email, username, password, location} = req.body;
    const userNameExists = await User.exists({username});
    if(userNameExists) 
        return res.status(400).render("/join", {pageTitle:"Join", errorMessage:"This username is already taken."}); 
    const emailNameExists = await User.exists({email});
    if(emailNameExists) 
        return res.status(400).render("/join", {pageTitle:"Join", errorMessage:"This email is already taken."});
    await User.create({
        name,
        email,
        username,
        password,
        location,
    });

    return res.redirect("/login");
}
export const edit = (req, res) =>{
    res.send("Edit User");
}
export const remove = (req, res) =>{
    res.send("Remove User");
}
export const login = (req, res) =>{
    res.send("Login");
}
export const logout = (req, res) =>{
    res.send("Logout");
}
export const see = (req, res) =>{
    res.send("See");
}


