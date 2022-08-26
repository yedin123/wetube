import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev")
app.set("views", process.cwd() + "/src/views");
app.set("view engine", "pug");
app.use(logger);
app.use(express.urlencoded({extended:true})) // form data 받아올 수 있게 함

app.use(
    session({ // route 위에 있어야함
        secret: "Hello",
        resave: false,
        saveUninitialized: false, // 세션 수정할때만 db에 저장
        store: MongoStore.create({mongoUrl: "mongodb://127.0.0.1:27017/wetube"})
    })
);
app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;

