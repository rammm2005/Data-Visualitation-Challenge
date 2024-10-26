type SpreadsheetData = {
    spreadsheetId: string;
    range: string;
} | null;

export const getSpreadsheetIdAndRange = (link: string, defaultRange: string = ''): SpreadsheetData => {
    const spreadsheetIdMatch = link.match(/\/d\/(.*?)\//);

    if (spreadsheetIdMatch) {
        const spreadsheetId = spreadsheetIdMatch[1];
        return { spreadsheetId, range: defaultRange };
    }

    return null;
};
