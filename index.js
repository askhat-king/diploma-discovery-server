import express from 'express';
import multer from 'multer';
import cors from 'cors'
import mongoose from 'mongoose';

import {registerValidation, loginValidation, postCreateValidation} from './validations.js';
import {checkAuth, handleValidationErrors} from './utils/index.js'
import {UserController, PostController, CommentController} from './controlers/index.js'
mongoose.connect('mongodb+srv://admin:admin@cluster0.wncism3.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));


const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb)=>{
        cb(null, 'uploads')
    },
    filename:(_, file, cb)=>{
        cb(null, file.originalname);
    },
})

const upload = multer({storage});

app.use(express.json());
app.use(cors())
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation,handleValidationErrors, UserController.login)
app.post('/auth/register',registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me' , checkAuth, UserController.getMe);

app.post('/upload',checkAuth, upload.single('image'), (req, res)=>{
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
})
app.get('/tags' , PostController.getLastTags);
app.get('/posts' , PostController.getAll);
app.get('/posts/teacher' , PostController.getAllByTeacher);
app.get('/tags/:tag', PostController.getPostsBySearch);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.post('/posts' , checkAuth, postCreateValidation ,handleValidationErrors , PostController.create);
app.patch('/posts/:id' , checkAuth, postCreateValidation , handleValidationErrors, PostController.update);

app.post('/comments/:id' , checkAuth, CommentController.create);
app.get('/posts/comments/:id' , checkAuth, PostController.getPostComments);
app.get('/users', UserController.getUsers);
app.get('/user/:id', UserController.getUserOne);
app.patch('/user/:id', checkAuth, UserController.userUpdate);


app.listen(4444, (err) =>{
    if(err){
        return console.log(err);
    }

    console.log('Server working');
});