import * as scheduleRepository from "../repositories/scheduleRepository.js";
import dayjs from "dayjs";

export interface ScheduleData {
  startTime: string;
  endTime: string;
  isOpen: boolean;
}

export async function edit(body: ScheduleData, weekId: number) {
  if (body.isOpen) {
    const schedule = createSchedulesArray(body.startTime, body.endTime);

    await scheduleRepository.editByWeekId(weekId, true, schedule);
    return;
  }

  await scheduleRepository.editByWeekId(weekId, false, []);
  return;
}

export async function getAll() {
  return await scheduleRepository.getAll();
}

function stringTimeToDayjs(time: string) {
  return dayjs(`01/01/2000 ${time}`, "MM/DD/YYYY H:mm");
}

function createSchedulesArray(startTime: string, endTime: string) {
  const dayjsStart = stringTimeToDayjs(startTime);
  const dayjsEnd = stringTimeToDayjs(endTime);
  const arr = [dayjsStart];

  while (dayjsEnd.diff(arr[arr.length - 1]) !== 0) {
    const lastDate = arr[arr.length - 1];
    arr.push(lastDate.add(15, "m"));
  }

  return arr.map((date) => date.format("HH:mm"));
}
