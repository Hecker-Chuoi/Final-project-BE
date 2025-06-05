import express from "express";
import User from "../db/userModel.js";
import Photo from "../db/photoModel.js";
import { UserMapper } from "../mapper/Mapper.js";
import bodyParser from "body-parser";
const jsonParser = bodyParser.json();

const router = express.Router();

router.get("/list", jsonParser, async (req, res) => {
    try {
        const users = await User.find();
        const response = UserMapper.toResponses(users);
        console.log(users);
        res.status(200).send(response);
    }
    catch (error) {
        res.status(400).send({ message: "Error" });
        console.log(error);
    }
});

router.get("/:id", jsonParser, async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findOne({ _id: id })
        if (!user)
            res.status(400).send({ message: "User not found" });
        res.status(200).send(user);
    }
    catch (error) {
        res.status(400).send({ message: "Error" });
        console.log(error);
    }
});

export default router;