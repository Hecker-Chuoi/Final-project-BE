import express from "express";
import cors from "cors";
import dbConnect from "./db/dbConnect.js";
import UserRouter from "./routes/UserRouter.js";
import PhotoRouter from "./routes/PhotoRouter.js";
import AuthRouter from "./routes/AuthRouter.js";
// import CommentRouter from "./routes/CommentRouter.js";
// import session from "express-session";

const app = express();
dbConnect();

// app.use(session({
//   secret: 'my-secret-123',
//   resave: false,
//   saveUninitialized: false,
//   cookie: { secure: false }
// }));

// app.use((req, res, next) => {
//   if (req.path.startsWith('/auth/log-in') || req.path.startsWith('/auth/log-out')) {
//     return next();
//   }
//   if (!req.session.user) {
//     return res.status(401).send({ message: "Unauthorized" });
//   }
//   next();
// });

app.use(cors());
app.use(express.json());
app.use("/user", UserRouter);
app.use("/photo", PhotoRouter);
app.use("/auth", AuthRouter);

app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.listen(8080, () => {
  console.log("server listening on port 8080");
});
