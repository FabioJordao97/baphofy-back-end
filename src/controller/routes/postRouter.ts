import express from 'express'
import { PostController } from '../PostController';


export const postRouter = express.Router();
const postController = new PostController();

postRouter.post('/music', postController.createPost)
postRouter.get('/music/all', postController.getPosts)
postRouter.get('/music/:id', postController.getPostById)