import { CheckAvailabilityData } from "../services/calendarService.js";
import * as scheduleRepository from "../repositories/scheduleRepository.js";
import dayjs from "dayjs";

export async function edit(body: CheckAvailabilityData, weekId: number) {
    const dayjsStart = dayjs(body.startTime);
    const dayjsEnd = dayjs(body.endTime);
    const arr = [dayjsStart];

    while (dayjsEnd.diff(arr[arr.length - 1]) !== 0) {
        const lastDate = arr[arr.length - 1];
        arr.push(lastDate.add(15, "m"));
    }

    const schedule = arr.map((date) => date.format("HH:mm"));
    const resp = await scheduleRepository.editByWeekId(weekId, schedule);
    console.log(resp);
    return;
}
