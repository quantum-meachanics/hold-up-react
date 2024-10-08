import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { callGetReviewListAPI } from '../../apis/ReviewAPICall';
import style from "../../css/ReviewForm.module.css";
import Pagination from './Pagination';

function ReviewForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { reviewList, totalPages, error } = useSelector(state => state.reviewReducer);
    const [currentPage, setCurrentPage] = useState(1);

    // 날짜 형식 포맷
    const formatDateTime = (dateArray) => {
        // dateArray가 유효한지 확인
        if (!Array.isArray(dateArray) || dateArray.length < 5) {
            console.error("Invalid date array:", dateArray);
            return "유효하지 않은 날짜";
        }

        // Date 객체 생성
        const year = dateArray[0];
        const month = String(dateArray[1]).padStart(2, '0'); // 월을 두 자리로 포맷
        const day = String(dateArray[2]).padStart(2, '0'); // 일을 두 자리로 포맷

        // "년월일 시:분:초" 형식으로 문자열 생성
        return `${year}-${month}-${day}`;
    };

    // 컴포넌트가 마운트되거나 currentPage가 변경될 때 리뷰 목록 가져오기
    useEffect(() => {
        console.log('Fetching reviews for page:', currentPage);
        dispatch(callGetReviewListAPI(currentPage));
    }, [dispatch, currentPage]);

    // 페이지 변경 핸들러
    const handlePageChange = (newPage) => {
        console.log('Changing to page:', newPage);
        setCurrentPage(newPage);
    };

    const handleClick = (id) => {
        navigate(`/holdup/reviews/${id}`);
    };


    // 에러 발생 시 에러 메시지 표시
    if (error) {
        return <div>에러 발생: {error.message || '알 수 없는 오류'}</div>;
    }

    console.log('Current state:', { reviewList, totalPages, error });
    console.log("리뷰 컴포넌트 재랜더링됨");

    return (
        <div className={style.main}>
            <span className={style.title}>리뷰 게시판</span>
            {reviewList && reviewList.length > 0 ? (
                <div className={style.reviewSection}>
                    <table className={style.table}>
                        <thead className={style.thead}>
                            <tr>
                                <th className={style.th}>등록날짜</th>
                                <th className={style.th}>제목</th>
                                <th className={style.th}>별점</th>
                                <th className={style.th}>닉네임</th>
                            </tr>
                        </thead>
                        <tbody className={style.reviewRow}>
                            {reviewList.map(reviewList => (
                                <tr key={reviewList.id} onClick={() => handleClick(reviewList.id)} className={style.reviewRow}>
                                    <td className={style.td}>{formatDateTime(reviewList.createDate)}</td>
                                    <td className={style.td}>{reviewList.title}</td>
                                    <td className={style.td}>{reviewList.rating}</td>
                                    <td className={style.td}>{reviewList.nickname}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>리뷰가 없습니다.</p>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}

export default ReviewForm;