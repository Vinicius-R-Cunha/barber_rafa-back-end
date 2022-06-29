import { db } from "../database.js";

export async function getScheduleByWeekId(weekId: number) {
  return await db.collection("week").findOne({ weekId });
}

export async function editByWeekId(
  weekId: number,
  isOpen: boolean,
  schedule: string[]
) {
  return await db.collection("week").updateOne(
    {
      weekId,
    },
    {
      $set: { schedule: schedule, isOpen: isOpen },
    }
  );
}

export async function getAll() {
  return await db.collection("week").find({}).sort({ weekId: 1 }).toArray();
}
