import * as reservationRepository from "../repositories/reservationRepository.js";
import * as userRepository from "../repositories/userRepository.js";
import dayjs from "dayjs";

export async function getReservationsByEmail(email: string) {
    const reservations = await reservationRepository.getByEmail(email);

    const filteredReservations = getRecentReservations(reservations);

    return filteredReservations;
}

export async function remove(email: string, reservationId: number) {
    return await reservationRepository.remove(email, reservationId);
}

function getRecentReservations(reservations: any[]) {
    const today = dayjs();

    return reservations.filter((value) => dayjs(value.endTime).isAfter(today));
}
