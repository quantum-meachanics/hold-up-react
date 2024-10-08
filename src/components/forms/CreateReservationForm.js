import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { callCreateReservationAPI } from "../../apis/ReservationAPICall";
import style from "../../css/CreateReservation.module.css";

function CreateReservationForm() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { reservationInfo, error } = useSelector(state => state.reservationReducer);
    const hours = Array.from({ length: 24 }, (_, index) => index);

    const [inputReservationInfo, setInputReservationInfo] = useState({
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        spaceId: location.state.spaceId
    });

    const inputChangeHandler = e => {
        setInputReservationInfo({
            ...inputReservationInfo,
            [e.target.name]: e.target.value
        })
    };

    const onClickHandler = () => {
        // 비어있는 입력 필드 검사
        if (!inputReservationInfo.startDate || !inputReservationInfo.endDate ||
            inputReservationInfo.startTime === '' || inputReservationInfo.endTime === '') {
            alert("모든 값을 입력해주세요.");
            return;
        }

        // 날짜와 시간을 합쳐 LocalDateTime 형식으로 변환
        const startDateTime = `${inputReservationInfo.startDate}T${inputReservationInfo.startTime.padStart(2, '0')}:00:00`;
        const endDateTime = `${inputReservationInfo.endDate}T${inputReservationInfo.endTime.padStart(2, '0')}:00:00`;

        // 종료일이 시작일보다 빠르지 않은지 검사
        if (startDateTime >= endDateTime) {
            alert("시작 날짜와 시간이 종료 날짜와 시간보다 앞서야 합니다.");
            return;
        }

        // 전송할 데이터 객체 구성
        const reservationData = {
            spaceId: inputReservationInfo.spaceId,
            startDateTime: startDateTime,
            endDateTime: endDateTime,
        };

        dispatch(callCreateReservationAPI(reservationData));
        navigate("/holdup/mypage/reservations");
    };

    useEffect(() => {
        if (error) {
            alert(error);

        } else if (reservationInfo) {
            navigate("/holdup/mypage/reservations")
        }
    }, [reservationInfo, error]);

    return (
        <div className={style.main}>
            <span className={style.title}>예약 신청하기</span>

            <span className={style.spaceId}>예약할 공간 ID : {location.state.spaceId}</span>

            <div className={style.startDate}>
                <span className={style.label}>보관 시작일</span>
                <input className={style.input} type="date" name="startDate" value={inputReservationInfo.startDate} onChange={inputChangeHandler} />
                <select name="startTime" value={inputReservationInfo.startTime} onChange={inputChangeHandler}>
                    <option className={style.time} value="">시간을 선택하세요</option>
                    {hours.map((hour) => (
                        <option key={hour} value={hour}>{hour}시</option>
                    ))}
                </select>
            </div>

            <div className={style.endDate}>
                <span className={style.label}>종료일</span>
                <input className={style.input} type="date" name="endDate" value={inputReservationInfo.endDate} onChange={inputChangeHandler} />
                <select name="endTime" value={inputReservationInfo.endTime} onChange={inputChangeHandler}>
                    <option className={style.time} value="">시간을 선택하세요</option>
                    {hours.map((hour) => (
                        <option key={hour} value={hour}>{hour}시</option>
                    ))}
                </select>
            </div>

            <button className={style.button} onClick={onClickHandler}>신청하기</button>
        </div>
    );
}

export default CreateReservationForm;