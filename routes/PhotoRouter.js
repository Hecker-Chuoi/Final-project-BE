import express from "express";
import User from "../db/userModel.js";
import Photo from "../db/photoModel.js";
import { UserMapper } from "../mapper/Mapper.js";
import bodyParser from "body-parser";
const jsonParser = bodyParser.json();
const router = express.Router();

router.get("/photosOfUser/:id", jsonParser, async (req, res) => {
    try {
        const id = req.params.id;
        const userId = await User.findById(id).select("_id");
        if (!userId) return res.status(400).send({ message: "Invalid user id" });

        const photos = await Photo.find({ user_id: userId }).lean();
        for (const photo of photos) {
            for (const comment of photo.comments) {
                const user = await User.findById(comment.user_id);
                comment.user = UserMapper.toResponse(user);
            }
        }
        res.status(200).send(photos);
    }
    catch (error) {
        res.status(400).send({ message: "Error" });
        console.log(error);
    }
});

router.post("/commentsOfPhoto/:photo_id", async (req, res) => {
    const { comment } = req.body;
    const { photo_id } = req.params;
    const { userId } = req.query;

    if (!comment || comment.trim() === "") {
        return res.status(400).send({ message: "Comment cannot be empty" });
    }

    try {
        const photo = await Photo.findById(photo_id);
        if (!photo) return res.status(404).send({ message: "Photo not found" });

        const newComment = {
            comment: comment.trim(),
            user_id: userId,
            date_time: new Date(),
        };

        photo.comments.push(newComment);
        await photo.save();

        // Populate lại user để trả về thông tin đầy đủ cho frontend
        // .populate("comments.user", "first_name last_name")
        const updatedPhoto = await Photo.findById(photo_id).lean();

        for (const comment of updatedPhoto.comments) {
            const user = await User.findById(comment.user_id);
            comment.user = UserMapper.toResponse(user);
        }

        res.send(updatedPhoto);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Server error" });
    }
});

export default router;
