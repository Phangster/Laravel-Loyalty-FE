import { User } from "./User";

export interface Item {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    user: User
    user_id: number
}