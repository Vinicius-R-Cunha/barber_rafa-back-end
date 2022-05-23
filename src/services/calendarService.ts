import { google } from "googleapis";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import * as scheduleRepository from "../repositories/scheduleRepository.js";
import * as reservationRepository from "../repositories/reservationRepository.js";

export interface CalendarData {
    summary: string;
    description: string;
    startTime: string;
    duration: string;
}

export interface CheckAvailabilityData {
    startTime: string;
    endTime: string;
    duration: string;
}

export async function create(body: CalendarData, email: string) {
    try {
        let startTime: string;
        if (body.startTime[body.startTime.length - 1] === "Z") {
            startTime = body.startTime.slice(0, -1);
        }

        const endTime = getEndTime(body.startTime, body.duration).slice(0, -1);

        const event = {
            summary: body.summary,
            description: body.description,
            colorId: "7",
            start: {
                dateTime: startTime,
                timeZone: "America/Sao_Paulo",
            },
            end: {
                dateTime: endTime,
                timeZone: "America/Sao_Paulo",
            },
        };

        const calendar = getCalendar();

        calendar.events.insert({
            calendarId: "primary",
            requestBody: event,
        });

        await reservationRepository.insertOnUserByEmail(
            email,
            body.summary,
            body.startTime,
            endTime
        );

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
        const busy = resp.data.calendars.primary.busy;

        const weekday = await scheduleRepository.getScheduleByWeekId(
            dayjs(body.startTime).day()
        );
        const schedule = weekday.schedule;

        return showAvailableTimes(schedule, busy, body.duration);
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

function showAvailableTimes(
    schedule: string[],
    freeBusy: any[],
    duration: string
) {
    for (let i = 0; i < freeBusy.length; i++) {
        const startTime = dayjs(freeBusy[i].start).format("HH:mm");
        let range: number;
        if (
            dayjs(freeBusy[i].end).diff(dayjs(freeBusy[i].start), "m") % 15 ===
            0
        ) {
            range =
                dayjs(freeBusy[i].end).diff(dayjs(freeBusy[i].start), "m") / 15;
        } else {
            range =
                dayjs(freeBusy[i].end).diff(dayjs(freeBusy[i].start), "m") /
                    15 +
                1;
        }
        schedule.splice(schedule.indexOf(startTime) + 1, range - 1);
    }

    return checkIfDurationFits(schedule, duration);
}

function checkIfDurationFits(schedule: string[], duration: string) {
    const { durationInMinutes, range } = getDeleteRangeFromDuration(duration);

    const dayjsSchedule = schedule.map((time) =>
        dayjs(`01/01/2000 ${time} -03:00`, "DD/MM/YYYY H:mm Z")
    );

    const filteredSchedule = [];
    for (let i = 0; i < dayjsSchedule.length - range; i++) {
        if (
            dayjsSchedule[i + range].diff(dayjsSchedule[i], "m") ===
            durationInMinutes
        ) {
            filteredSchedule.push(schedule[i]);
        }
    }

    return filteredSchedule;
}

function getDeleteRangeFromDuration(duration: string) {
    const neutralDate = dayjs()
        .set("hour", -3)
        .set("minute", 0)
        .set("second", 0);
    let range: number;
    if (duration.includes("min") && duration.includes("h")) {
        const hour = duration.slice(0, -3).split("h")[0];
        const minute = duration.slice(0, -3).split("h")[1];
        const attDate = dayjs(neutralDate)
            .add(+hour, "h")
            .add(+minute, "m");

        range = attDate.diff(neutralDate, "m");
    } else if (duration.includes("min")) {
        const minute = duration.slice(0, -3);
        const attDate = dayjs(neutralDate).add(+minute, "m");

        range = attDate.diff(neutralDate, "m");
    } else {
        const hour = duration.slice(0, -1);
        const attDate = dayjs(neutralDate).add(+hour, "h");

        range = attDate.diff(neutralDate, "m");
    }

    const durationInMinutes = range;
    if (range % 15 === 0) range = range / 15;
    else range = range / 15 + 1;
    return { durationInMinutes, range };
}

function getEndTime(startTime: string, duration: string) {
    let endTime: any;
    if (duration.includes("min") && duration.includes("h")) {
        const hour = duration.slice(0, -3).split("h")[0];
        const minute = duration.slice(0, -3).split("h")[1];
        endTime = dayjs(startTime)
            .add(+hour, "h")
            .add(+minute, "m");
    } else if (duration.includes("min")) {
        const minute = duration.slice(0, -3);
        endTime = dayjs(startTime).add(+minute, "m");
    } else {
        const hour = duration.slice(0, -1);
        endTime = dayjs(startTime).add(+hour, "h");
    }

    return endTime.toDate().toISOString();
}
