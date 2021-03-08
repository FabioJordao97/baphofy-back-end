import dayjs from "dayjs";
import { Genre, Post, PostModel } from "../business/entities/Post";
import { CustomError } from "../business/error/CustomError";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
    private static FirstTable = 'baphofy_musics'
    private static SecondeTable = 'baphofy_genres'
    private static ThirdTable = 'baphofy_Post'

    private static toPostModel(post: any): PostModel {
        return new PostModel(
            post.id,
            post.title,
            dayjs(post.date).format('DD/MM/YYYY'),
            post.file,
            post.album,
            post.genre,
            post.author_id,
            post.nickname,
            post.profilePicture
        )
    }

    public async insertPost(post: Post, genre: Genre){
        try {
            await BaseDatabase.connection(PostDatabase.FirstTable)
            .insert({
                id: post.id,
                title: post.title,
                date: post.date,
                file: post.file,
                album: post.album,
                author_id: post.author_id
            })

            await BaseDatabase.connection(PostDatabase.SecondeTable)
            .insert({
                id: genre.id,
                author_id: genre.author_id,
                genre: genre.genre
            })

            await BaseDatabase.connection(PostDatabase.ThirdTable)
            .insert({
                music_id: post.id,
                genre_id: genre.id
            })
        } catch(error){
            throw new CustomError(error.statusCode, error.sqlMessage);
        }
    }

    public async selectAll(): Promise<any> {
        try {
           const result = await BaseDatabase.connection.raw(`
                SELECT music.id, 
                music.title,
                music.date,
                music.file,
                music.album,
                genre.genre,
                music.author_id, 
                users.nickname,
                users.profilePicture FROM baphofy_musics music
                RIGHT JOIN baphofy_users users
                ON music.author_id =  users.id
                LEFT JOIN baphofy_genres genre
                ON genre.author_id = music.author_id
                JOIN baphofy_Post post
                ON post.music_id = music.id
                AND post.genre_id = genre.id
                ORDER BY date DESC;
            `)

            let postArray: PostModel[] = []
            for (let item of result[0]) {
                postArray.push(PostDatabase.toPostModel(item))
            }
            return postArray
        } catch(error){
            throw new CustomError(error.statusCode, error.sqlMessage);
        }
    }
    public async selectById(id: string): Promise<any>{
        try {
            const result = await BaseDatabase.connection.raw(`
                SELECT music.id, 
                music.title,
                music.date,
                music.file,
                music.album,
                genre.genre,
                music.author_id, 
                users.nickname,
                users.profilePicture FROM baphofy_musics music
                RIGHT JOIN baphofy_users users
                ON music.author_id =  users.id
                LEFT JOIN baphofy_genres genre
                ON genre.author_id = music.author_id
                JOIN baphofy_Post post
                ON post.music_id = music.id
                AND post.genre_id = genre.id
                WHERE music.id = "${id}"
                ORDER BY date DESC;
            `)

            return PostDatabase.toPostModel(result[0][0])
        } catch (error) {
            
        }
    }
}