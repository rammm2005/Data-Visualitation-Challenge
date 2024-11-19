import { UUID } from "crypto";

export type Sheet = {
    id: UUID;
    spreadsheetId: string;
    link: string;
    rangeId: string;
}