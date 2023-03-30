export interface User {
    _id: string;
    first_name: string,
    last_name: string,
    email: string;
    password: string;
    permissions: string;
    approved: string;
    experiments: any;
}

export const Permissions = [-1, 1, 2, 3]