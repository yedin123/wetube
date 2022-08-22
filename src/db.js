import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/wetube", { useNewUrlParser: true, useUnifiedTopology: true }); //url + db이름

const handleOpen = () => console.log("Connected to DB");
const hadleError = (error) => console.log("DB error", error);

const db = mongoose.connection;
db.on("error", hadleError);
db.once("open", handleOpen); // on: 여러번 일어남 / once: 한번만 일어남 