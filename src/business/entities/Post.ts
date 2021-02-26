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