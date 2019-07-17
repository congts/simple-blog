export enum RoleType {
    ADMIN = 'admin',
    USER = 'user',
}

export interface User {
    uid: string;
    email: string;
    role: string;
    data?: any;
}
