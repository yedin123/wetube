import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
    res.render("join", {pageTitle: "Join"});
}
export const postJoin = async (req, res) => {
    const pageTitle = "Join";
    const {name, email, username, password, location} = req.body;
    const userNameExists = await User.exists({username});
    if(userNameExists) 
        return res.status(400).render("/join", {pageTitle: pageTitle, errorMessage:"This username is already taken."}); 
    const emailNameExists = await User.exists({email});
    if(emailNameExists) 
        return res.status(400).render("/join", {pageTitle: pageTitle, errorMessage:"This email is already taken."});
    try{
        await User.create({
            name,
            email,
            username,
            password,
            location,
        });
        return res.redirect("/login");
    } catch(error){
        return res.status(400).render("join", {pageTitle: pageTitle, errorMessage: error.message} );
    }
}
export const edit = (req, res) =>{
    res.send("Edit User");
}
export const remove = (req, res) =>{
    res.send("Remove User");
}
export const getLogin = (req, res) =>{
    res.render("login", { pageTitle: "Login" });
}
export const postLogin = async (req, res) =>{
    const { username, password } = req.body;
    const user = await User.findOne({username});
    console.log(password);
    console.log(user.password);
    if(!user)
        return res.status(400).render("/login", { pageTitle: "Login", errorMessage: "An account with this username does not exist." });
    const ok = await bcrypt.compare(password, user.password);
    if(!ok)
        return res.status(400).render("/login", { pageTitle: "Login", errorMessage: "Wrong password" });
    return res.redirect("/");
}
export const logout = (req, res) =>{
    res.send("Logout");
}
export const see = (req, res) =>{
    res.send("See");
}


