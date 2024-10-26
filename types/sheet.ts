import { z } from "zod";

export const FormSchema = z.object({
    link: z
        .string()
        .min(1, { message: "Link cannot be empty." })
        .regex(
            /https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9-_]+/,
            { message: "Please provide a valid Google Spreadsheet link." }
        ),
    range: z
        .string()
        .min(1, { message: "Range cannot be empty." })
        .regex(
            /^[A-Za-z0-9!:_-]+(?![A-Za-z0-9!:_-])/,
            { message: "Please provide a valid range format (e.g., 'Sheet1!A1:D100')." }
        ),
});
