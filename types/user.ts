import { UUID } from "crypto";

export type user = {
    id: UUID
    name?: string;
    username: string;
    email: string;
    password: string;
    access_token: string;
    verification_token: string;
    is_online: boolean;
    created_at: Date;
    avatar?: string;
    updated_at: Date;
}