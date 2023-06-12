import CommentModel from "../models/Comment.js";
import PostModel from '../models/Post.js';

export const create = async (req, res) => {
    try {
        const { postId, comment } = req.body

        if (!comment)
            return res.json({ message: 'Комментарий не может быть пустым' })

        const newComment = new CommentModel({ comment, user: req.userId, })
        await newComment.save()

        try {
            await PostModel.findByIdAndUpdate(postId, {
                $push: { comments: newComment._id },
            }).populate('user')
        } catch (error) {
            console.log(error)
        }

        res.json(newComment)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' })
    }
}