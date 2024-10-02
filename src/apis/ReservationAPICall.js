import { createReservationFail, createReservationSuccess } from "../modules/ReservationModule";
import { tokenRequest } from "./Api";

export function callCreateReservationAPI(reservationInfo) {
    return async (dispatch)=> {
        try {

            console.log("예약할 공간 아이디", reservationInfo.spaceId)
            console.log("요청할 예약 정보", reservationInfo)

            const response = await tokenRequest(
                sessionStorage.getItem("token"),
                "POST",
                "/reservations",
                reservationInfo
            );

            dispatch(createReservationSuccess(response.reservationInfo));

        } catch (error) {
            dispatch(createReservationFail(error.message || "예약 신청 API 호출 에러 발생"));
        }
    };
}