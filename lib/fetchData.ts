"use server";

import { google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';

type SheetData = string[][] | null;

export async function fetchSheetData(spreadsheetId: string, range: string): Promise<SheetData> {
    const sheets = google.sheets({ version: 'v4', auth: process.env.GOOGLE_API_KEY });

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
    });

    return response.data.values ?? null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { spreadsheetId, range } = req.query;

        if (!spreadsheetId || !range) {
            return res.status(400).json({ error: 'Missing spreadsheetId or range' });
        }

        const sheetData = await fetchSheetData(spreadsheetId as string, range as string);

        return res.status(200).json({ data: sheetData });
    } catch (error) {
        console.error('Error fetching sheet data:', error);
        return res.status(500).json({ error: 'Failed to fetch data from Google Sheets' });
    }
}
