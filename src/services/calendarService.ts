import { google } from "googleapis";
import dayjs from "dayjs";
import * as scheduleRepository from "../repositories/scheduleRepository.js";

export interface CalendarData {
    summary: string;
    description: string;
    startTime: string;
    endTime: string;
}

export type CheckAvailabilityData = Omit<
    CalendarData,
    "summary" | "description"
>;

export async function create(body: CalendarData) {
    try {
        const event = {
            summary: body.summary,
            description: body.description,
            colorId: "7",
            start: {
                dateTime: body.startTime,
                timeZone: "America/Sao_Paulo",
            },
            end: {
                dateTime: body.endTime,
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

export async function checkAvailability(body: CheckAvailabilityData) {
    try {
        const event = {
            timeMin: body.startTime,
            timeMax: body.endTime,
            timeZone: "America/Sao_Paulo",
            items: [{ id: "primary" }],
        };

        const calendar = getCalendar();

        const resp = await calendar.freebusy.query({
            requestBody: event,
        });

        const weekday = await scheduleRepository.getScheduleByWeekId(
            dayjs(body.startTime).day()
        );
        const schedule = weekday.schedule;

        return showAvailableTimes(schedule, resp.data.calendars.primary.busy);
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

function showAvailableTimes(schedule: string[], freeBusy: any) {
    for (let i = 0; i < freeBusy.length; i++) {
        const startTime = dayjs(freeBusy[i].start).format("HH:mm");
        const range =
            dayjs(freeBusy[i].end).diff(dayjs(freeBusy[i].start), "m") / 15;
        schedule.splice(schedule.indexOf(startTime), range);
    }
    return schedule;
}
