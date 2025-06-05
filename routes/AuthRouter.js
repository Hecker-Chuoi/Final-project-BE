import express from "express";
import bcrypt from "bcrypt";
import User from "../db/userModel.js";
import { UserMapper } from "../mapper/Mapper.js";
import bodyParser from "body-parser";
const jsonParser = bodyParser.json();

const router = express.Router();

router.post("/log-in", jsonParser, async (req, res) => {
    try {
        const { user_name, password } = req.body;
        const user = await User.findOne({ user_name: user_name });

        if (!user)
            res.status(400).send({ message: "Wrong username or password" });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).send({ message: "Sai tài khoản hoặc mật khẩu" });
        }

        // req.session.user = { _id: user._id, login_name: user.login_name };
        res.send(UserMapper.toResponse(user));
    }
    catch (error) {
        res.status(400).send({ message: "Error" });
        console.log(error);
    }
});

router.post('/log-out', (req, res) => {
    if (!req.session.user) {
        return res.status(400).send({ message: "Not logged in" });
    }

    // req.session.destroy();
    res.send({ message: "Logged out" });
});

const SALT_ROUNDS = 10;

router.post("/sign-up", jsonParser, async (req, res) => {
    try {
        const { user_name, first_name, last_name, password, location, description, occupation } = req.body;

        if (!user_name || !password) {
            return res.status(400).send({ message: "Thiếu thông tin" });
        }

        const existingUser = await User.findOne({ user_name });
        if (existingUser) {
            return res.status(400).send({ message: "Tài khoản đã tồn tại" });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const newUser = new User({
            user_name,
            password: hashedPassword,
            first_name,
            last_name,
            location,
            description,
            occupation
        });

        await newUser.save();
        res.status(201).send({ message: "Đăng ký thành công" });
    }
    catch (error) { }
});


export default router;