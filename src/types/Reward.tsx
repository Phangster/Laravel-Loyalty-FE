import { User } from "./User";

export interface Reward {
    id: number;
    name: string;
    points_required: number;
    description: string;
    stock_quantity: number;
    user: User
    created_at: string;
    updated_at: string;
}