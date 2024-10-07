import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { callGetReportDetailAPI } from '../../apis/ReportAPICall';

function ReportDetailForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { reportDetail, error } = useSelector(state => state.reportDetailReducer);

    useEffect(() => {
        dispatch(callGetReportDetailAPI(id));
        console.log('Fetching review for id:', id);
    }, []);

    const handleGoBack = () => {
        navigate('/holdup/reports');
    };

    const handleUpdate = () => {
        navigate(`/holdup/reports/update/${id}`);
    };

    if (error) return <div>에러 발생: {error}</div>;

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
        const hour = String(dateArray.length > 3 ? dateArray[3] : 0).padStart(2, '0'); // 시를 두 자리로 포맷
        const minute = String(dateArray.length > 4 ? dateArray[4] : 0).padStart(2, '0'); // 분을 두 자리로 포맷
        const second = String(dateArray.length > 5 ? dateArray[5] : 0).padStart(2, '0'); // 초를 두 자리로 포맷

        // "년월일 시:분:초" 형식으로 문자열 생성
        return `${year}년 ${month}월 ${day}일 ${hour}:${minute}:${second}`;
    };

    return (
        <div>
            <h1>신고 상세</h1>
            <div>
                {reportDetail ? (
                    <>
                        <h2>{reportDetail.title}</h2>
                        <p>작성자: {reportDetail.nickname}</p>
                        <p>등록날짜: {formatDateTime(reportDetail.createDate)}</p>
                        <p>내용: {reportDetail.content}</p>
                        <div>
                            <h3>이미지</h3>
                            <div>
                                {reportDetail.imageUrl && reportDetail.imageUrl.length > 0 ? (
                                    reportDetail.imageUrl.map((url, index) => (
                                        <img key={index} src={url} alt={`리뷰 이미지 ${index + 1}`} />
                                    ))
                                ) : (
                                    <p>이미지가 없습니다.</p>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <h2>게시글이 존재 하지 않습니다.</h2>
                )}
                


            </div>
            <button onClick={handleGoBack}>목록으로 돌아가기</button>
            <button onClick={handleUpdate}>수정</button>
        </div>
    
    );
}

export default ReportDetailForm;