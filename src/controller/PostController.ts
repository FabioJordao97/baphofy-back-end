import { Request, Response } from "express";
import { PostInputDTO } from "../business/entities/Post";
import { PostBusiness } from "../business/PostBusiness";
import { Authenticator } from "../business/services/Authenticator";
import { IdGenerator } from "../business/services/IdGenerator";
import { PostDatabase } from "../data/PostDatabase";

const postBusiness = new PostBusiness (
    new IdGenerator(),
    new Authenticator(),
    new PostDatabase()
)

export class PostController{
    async createPost(req: Request, res: Response){
        try{
            const token: string = req.headers.authorization as string

            const {title, file, genre, album} = req.body

            const postInput: PostInputDTO = {
                title,
                file,
                genre,
                album
            }

            await postBusiness.createPost(postInput, token)

            res.status(200).send('Post successfully created')
        } catch(error){
            res.status(error.statusCode || 400).send(error.message)
        }
    }

    async getPosts(req: Request, res: Response):Promise<void>{
        try {
            const token: string = req.headers.authorization as string

            const result = await postBusiness.getPosts(token)

            res.status(200).send(result)
        } catch (error) {
            res.status(error.statusCode || 400).send(error.message)
        }
    }

    async getPostById(req: Request, res: Response): Promise<void>{
        try {
            const token: string = req.headers.authorization as string
            const id = req.params.id

            const result = await postBusiness.getPostById(id, token)

            res.status(200).send(result)
        } catch (error) {
            res.status(error.statusCode || 400).send(error.message)       
        }
    }
}