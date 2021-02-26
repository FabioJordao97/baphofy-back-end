import { Genre, Post } from "../business/entities/Post";
import { CustomError } from "../business/error/CustomError";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
    private static FirstTable = 'baphofy_musics'
    private static SecondeTable = 'baphofy_genres'
    private static ThirdTable = 'baphofy_Post'

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
}