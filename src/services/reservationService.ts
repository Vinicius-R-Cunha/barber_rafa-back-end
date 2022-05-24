import * as reservationRepository from "../repositories/reservationRepository.js";
import dayjs from "dayjs";

export async function getReservationsByEmail(email: string) {
    const reservations = await reservationRepository.getByEmail(email);

    const filteredReservations = getRecentReservations(reservations);

    return filteredReservations;
}

function getRecentReservations(reservations: any[]) {
    const today = dayjs();

    return reservations.filter((value) => dayjs(value.endTime).isAfter(today));
}
