import { User } from "./User";

export interface Reward {
    id: number;
    name: string;
    description: string;
    points_required: number;
    stock_quantity: number;
    user_id: string;
    user: User;
    created_at: string;
    updated_at: string;
}