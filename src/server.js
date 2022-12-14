import express from "express";
import flash from "express-flash";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";
import apiRouter from "./routers/apiRouter";

const app = express();
const logger = morgan("dev")
app.set("views", process.cwd() + "/src/views");
app.set("view engine", "pug");
app.use((req, res, next) => {
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    next();
    });
app.use(logger);
app.use(express.urlencoded({extended:true})); // form data 받아올 수 있게 함
app.use(express.json());
app.use(
    session({ // route 위에 있어야함
        secret: "Hello",
        resave: false,
        saveUninitialized: false, // 세션 수정할때만 db에 저장
        store: MongoStore.create({mongoUrl: process.env.DB_URL})
    })
);
app.use(flash());
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app;

