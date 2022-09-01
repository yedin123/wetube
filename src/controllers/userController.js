import User from "../models/User";
import Video from "../models/Video";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
    res.render("join", {pageTitle: "Join"});
}
export const postJoin = async (req, res) => {
    const pageTitle = "Join";
    const {name, email, username, password, location} = req.body;
    const userNameExists = await User.exists({username});
    if(userNameExists) 
        return res.status(400).render("join", {pageTitle: pageTitle, errorMessage:"This username is already taken."}); 
    const emailNameExists = await User.exists({email});
    if(emailNameExists) 
        return res.status(400).render("join", {pageTitle: pageTitle, errorMessage:"This email is already taken."});
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
export const getEdit = (req, res) =>{
    res.render("edit-profile", {pageTitle:"Edit Profile"});
}
export const postEdit = async (req, res) =>{
    const pageTitle = "Edit Profile"; 
    const {
        session: { user: { _id, email:sessionEmail, username:sessionUsername, avatarUrl } },
        body: { name, email, username, location },
        file
    } = req;
    console.log(file);
    //email, username 중복체크
    if(sessionEmail != email && await User.exists({ email })){
        return res.status(400).render("edit-profile", { pageTitle: pageTitle, errorMessage: "This email is already taken." });
    }
    if(sessionUsername != username && await User.exists({ username })){
        return res.status(400).render("edit-profile", { pageTitle: pageTitle, errorMessage: "This username is already taken." });
    }
    const updateUser = await User.findByIdAndUpdate(
        _id, 
        { 
            avatarUrl: file ? file.path : avatarUrl,
            name,
            email,
            username,
            location
        }, 
        {new:true}
    );
    req.session.user = updateUser;
    res.redirect("/users/edit");
}
export const getLogin = (req, res) =>{
    res.render("login", { pageTitle: "Login" });
}
export const postLogin = async (req, res) =>{
    const { username, password } = req.body;
    const user = await User.findOne({username, socialOnly:false});
    if(!user)
        return res.status(400).render("/login", { pageTitle: "Login", errorMessage: "An account with this username does not exist." });
    const ok = await bcrypt.compare(password, user.password);
    if(!ok)
        return res.status(400).render("/login", { pageTitle: "Login", errorMessage: "Wrong password" });
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
}
export const startGithubLogin = (req, res) => {
    const baseUrl = `https://github.com/login/oauth/authorize`;
    const config = {
        client_id: process.env.GH_CLIENT_ID,
        allow_signup: false,
        scope: "read:user user:email"   
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};
export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT_ID,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
    ).json();
    if("access_token" in tokenRequest){
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await (
            await fetch(`${apiUrl}/user`, {
              headers: {
                Authorization: `token ${access_token}`,
              },
            })
        ).json();
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
              headers: {
                Authorization: `token ${access_token}`,
              },
            })
        ).json();
        
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
          );
        if(!emailObj){
            return res.redirect("/login");
        }
        const existingUser = await User.findOne({ email: emailObj.email });
        if (existingUser) {
            req.session.loggedIn = true;
            req.session.user = existingUser;
            return res.redirect("/");
        } else {
            const user = await User.create({
                name: userData.name,
                username: userData.login,
                email: emailObj.email,
                password: "",
                socialOnly: true,
                location: userData.location,
            });
            req.session.loggedIn = true;
            req.session.user = user;
            return res.redirect("/");
        }
    } else {
        return res.redirect("/login");
    }

};
export const logout = (req, res) =>{
    req.session.destroy();
    return res.redirect("/");
}
export const getChangePassword = (req, res) =>{
    return res.render("change-password", {pageTitle:"Change Password"});
}
export const postChangePassword = async (req, res) => {
    const {
      session: {
        user: { _id },
      },
      body: { oldPassword, newPassword, confirmationPassword },
    } = req;
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) {
      return res.status(400).render("change-password", {
        pageTitle: "Change Password",
        errorMessage: "The current password is incorrect",
      });
    }
    if (newPassword !== confirmationPassword) {
      return res.status(400).render("change-password", {
        pageTitle: "Change Password",
        errorMessage: "The password does not match the confirmation",
      });
    }
    user.password = newPassword;
    await user.save();
    return res.redirect("/users/logout");
  };
  export const see = async (req, res) =>{
    const { id } = req.params;
    const user = await User.findById(id);
    if(!user)
        return res.status(400).render("404", { pageTitle:"User not found" });
    const videos = await Video.find({ owner: user._id });
    res.render("profile", {pageTitle: user.name, user, videos});
};
export const remove = (req, res) =>{
    res.send("Remove User");
};


