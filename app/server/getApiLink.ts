"use server"
import axios from 'axios';

export async function getSheetData() {
    const apiKey = 'YOUR_GOOGLE_API_KEY';
    const spreadsheetId = '1zuR1zmW2H6e868sRh4_iQH2vhUgRAPRo5cUIOk9v4FM';
    const range = 'Sheet1!A1:D100';

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

    try {
        const response = await axios.get(url);
        return response.data.values; 
    } catch (error) {
        console.error('Error fetching data from Google Sheets:', error);
        return [];
    }
}
