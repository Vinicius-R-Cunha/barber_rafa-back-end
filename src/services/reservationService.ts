import * as userRepository from "../repositories/userRepository.js";
import * as reservationRepository from "../repositories/reservationRepository.js";

export async function getReservationsByEmail(email: string) {
    const user = await userRepository.findByEmail(email);

    return user.reservations;
}
