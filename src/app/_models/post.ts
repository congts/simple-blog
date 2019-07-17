export enum PostStatus {
    ENABLE = 1,
    DISABLE = 2
}

export class OrderBy {
    field: string;
    direction: 'desc' | 'asc';
}

export interface Post {
    uid?: string;
    title: string;
    content: string;
    status: number;
    createdAt?: string;
    updatedAt?: string;
    userUid: string;
}
