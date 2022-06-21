import { db } from "../database.js";

export async function getScheduleByWeekId(weekId: number) {
  return await db.collection("week").findOne({ weekId });
}

export async function editByWeekId(weekId: number, schedule: string[]) {
  return await db.collection("week").updateOne(
    {
      weekId,
    },
    {
      $set: { schedule: schedule },
    }
  );
}
