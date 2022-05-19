import { google } from "googleapis";

export interface CalendarData {
    summary: string;
    description: string;
    startTime: string;
    endTime: string;
}

export async function create(body: CalendarData) {
    try {
        const event = {
            summary: body.summary,
            description: body.description,
            colorId: "7",
            start: {
                dateTime: "2022-05-19T14:35:00.000Z",
                timeZone: "America/Sao_Paulo",
            },
            end: {
                dateTime: "2022-05-19T14:55:00.000Z",
                timeZone: "America/Sao_Paulo",
            },
        };

        const calendar = getCalendar();

        calendar.events.insert({
            calendarId: "primary",
            requestBody: event,
        });

        return;
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
        process.env.CLIENT_SECRET,
        "http://localhost"
    );

    oAuth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN,
    });

    return google.calendar({
        version: "v3",
        auth: oAuth2Client,
    });
}
