import dayjs from "dayjs";
import { PostDatabase } from "../data/PostDatabase";
import { Genre, Post, PostInputDTO, PostModel, PostFeed } from "./entities/Post";
import { AuthenticationData } from "./entities/User";
import { CustomError } from "./error/CustomError";
import { Authenticator } from "./services/Authenticator";
import { IdGenerator } from "./services/IdGenerator";

export class PostBusiness {
    constructor (
        private idGenerator: IdGenerator,
        private authenticator: Authenticator,
        private postDatabase: PostDatabase
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

            await this.postDatabase.insertPost(newPost, genre)

        } catch(error){
            throw new CustomError(error.statusCode, error.message);
        }
    }

    async getPosts(token: string): Promise<PostModel[]>{
        try {          

            if (!token){
                throw new CustomError(422, 'Missing property')
            }
            const tokenData: AuthenticationData = this.authenticator.getData(token)

            if (!tokenData){
                throw new CustomError(422, 'Missing property')
            }
            const postResult = await this.postDatabase.selectAll()

            if(!postResult){
                throw new CustomError(404, 'Not found')
            }     
            
            const result = postResult.map((item: PostFeed) => {
                return {id: item.id, 
                    title: item.title, 
                    file: item.file, 
                    genre: item.genre, 
                    author_id: item.author_id, 
                    nickname: item.nickname, 
                    profilePicture: item.profilePicture}
            })

            return result
        } catch(error){
            throw new CustomError(error.statusCode, error.message);
        }
    }

    async getPostById(id: string, token: string){
        try {
            if (!token){
                throw new CustomError(422, 'Missing property')
            }
            const tokenData: AuthenticationData = this.authenticator.getData(token)

            if (!tokenData){
                throw new CustomError(422, 'Missing property')
            }

            if(!id){
                throw new CustomError(404, 'User not found')
            }

            const result = await this.postDatabase.selectById(id)
            if(!result){
                throw new CustomError(404, "Not Found");
            }

            return result
            
        } catch (error) {
            throw new CustomError(error.statusCode, error.message);
        }
    }
}