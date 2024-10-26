"use server";

import { google } from "googleapis";

type SheetData = string[][] | null;

export async function fetchSheetData(
    spreadsheetId: string,
    range: string
): Promise<SheetData> {
    const sheets = google.sheets({ version: "v4", auth: process.env.GOOGLE_API_KEY });

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    });

    return response.data.values ?? null;
}
