import dayjs from "dayjs";
import { PostDatabase } from "../data/PostDatabase";
import { Genre, Post, PostInputDTO } from "./entities/Post";
import { AuthenticationData } from "./entities/User";
import { CustomError } from "./error/CustomError";
import { Authenticator } from "./services/Authenticator";
import { IdGenerator } from "./services/IdGenerator";

export class PostBusiness {
    constructor (
        private idGenerator: IdGenerator,
        private authenticator: Authenticator,
        private postDatabse: PostDatabase
    ) { }

    async createPost(post: PostInputDTO, token: string){
        try{
            if(!post.album || !post.file || !post.genre || !post.title){
                throw new CustomError(422, 'Missing vital informations')                
            }

            const tokenData: AuthenticationData = this.authenticator.getData(token)

            if(!tokenData){
                throw new CustomError(422, 'Missing permission. Check your credentials')
            }

            const postId = this.idGenerator.generate()
            const genreId = this.idGenerator.generate()

            const date = dayjs().format('YYYY-MM-DD')

            const genre: Genre = {
                id: genreId,
                author_id: tokenData.id,
                genre: post.genre
            }

            const newPost: Post = new Post (
                postId,
                post.title,
                date,
                post.file,
                post.album,
                tokenData.id
            )

            await this.postDatabse.insertPost(newPost, genre)

        } catch(error){
            throw new CustomError(error.statusCode, error.message);
        }
    }
}