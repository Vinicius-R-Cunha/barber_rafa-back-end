import { google } from "googleapis";

export async function getEvents() {
    const calendar = getCalendar();

    try {
        const res = await calendar.events.list({
            calendarId: "primary",
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: "startTime",
        });
        const events = res.data.items;

        return events;
    } catch (err) {
        throw {
            type: "bad_request",
            message: "The API returned an error: " + err,
        };
    }
}

function getCalendar() {
    const oAuth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET
    );

    oAuth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN,
    });

    return google.calendar({
        version: "v3",
        auth: oAuth2Client,
    });
}
