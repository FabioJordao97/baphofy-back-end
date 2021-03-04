export class Post {
    constructor (
        public readonly id: string,
        public readonly title: string,
        public readonly date: string,
        public readonly file: string,
        public readonly album: string,
        public readonly author_id: string
    ) {}
}

export class PostModel {
    constructor (
        public readonly id: string,
        public readonly title: string,
        public readonly date: string,
        public readonly file: string,
        public readonly album: string,
        public readonly genre: string[],
        public readonly author_id: string,
        public readonly nickname: string,
        public readonly profilePicture: string
    ) { }
}

export interface PostInputDTO {
    title: string,
    file: string,
    genre: string[],
    album: string
}

export interface Genre {
    id: string,
    author_id: string,
    genre: string[]
}

export interface PostIdDTO {
    id: string
}

export interface PostFeed {
    id: string,
    title: string,
    file: string,
    genre: string[],
    author_id: string,
    nickname: string,
    profilePicture: string
}