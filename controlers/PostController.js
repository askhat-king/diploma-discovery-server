import Post from "../models/Post.js";
import PostModel from '../models/Post.js';
import Comment from '../models/Comment.js'
import UserModel from '../models/User.js';
export const getLastTags = async(req, res) => {
  try{
      const posts = await PostModel.find().limit(5).exec();
      const tags = posts.map(obj=> obj.tags).flat().slice(0,5);
      res.json(tags);
  } catch(err){
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить статьи',
      });
  }
}

export const getAll = async(req, res) => {
  try{
    const posts = await PostModel.find().populate('user').exec();

    res.json(posts);
} catch(err){
    console.log(err);
    res.status(500).json({
      message: 'Can not get post',
    });
}
}
export const getAllByTeacher = async(req, res) => {
  try {
      const instructors = [];
      const users = await UserModel.find({ role: "instructor" });
      users.map(u => {
          instructors.push(u._id);
      });
      const posts = await PostModel.find({ user: {$in: instructors} }).populate('user').exec();
      
      res.json(posts);
  } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить статьи',
      });
  }   
}
export const getOne= async(req, res) => {
    try{
        const postId = req.params.id;

        PostModel.findOneAndUpdate(
            {
            _id: postId,
        }, {
            $inc: {viewsCount:1},
        },
        {
            returnDocument: 'after'
        },
        (err, doc) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                  message: 'Не удалось вернуть статью',
                });
            }

            if (!doc){
                return res.status(404).json({
                    message: 'Статья не найдена'
                })
            }

            res.json(doc);
        },
        ).populate('user');
    } catch(err){
        console.log(err);
        res.status(500).json({
          message: 'Не удалось получить статью',
        });
    }
}


export const remove = async (req, res) => {
    try {
      const postId = req.params.id;
  
      PostModel.findOneAndDelete(
        {
          _id: postId,
        },
        (err, doc) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              message: 'Не удалось удалить статью',
            });
          }
  
          if (!doc) {
            return res.status(404).json({
              message: 'Статья не найдена',
            });
          }
  
          res.json({
            success: true,
          });
        },
      );
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить статьи',
      });
    }
  };

export const create = async(req, res) =>{
    try{
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
        });

        const post = await doc.save();
        
        res.json(post);
    } 
    catch(err){
        console.log(err);
        res.status(500).json({
          message: 'Не удалось создать пост',
        });
    }
}

export const update = async (req, res) => {
    try {
      const postId = req.params.id;
  
      await PostModel.updateOne(
        {
          _id: postId,
        },
        {
          title: req.body.title,
          text: req.body.text,
          imageUrl: req.body.imageUrl,
          user: req.userId,
          tags: req.body.tags.split(','),
        },
      );
  
      res.json({
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось обновить статью',
      });
    }
  };

  export const getPostsBySearch = async (req, res) =>{
    try {
        const tag = req.params.tag;

        PostModel.find({ tags: tag },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удалось вернуть статью'
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message: "Статья не найдена"
                    });
                }
                res.json(doc);
            }
        ).populate('user');

        
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
  export const getPostComments = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        const list = await Promise.all(
            post.comments.map((comment) => {
                return Comment.findById(comment).populate('user')
            }),
        )
        res.json(list)
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' })
    }
}

