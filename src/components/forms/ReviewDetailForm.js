import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { callGetReviewDetailAPI } from '../../apis/ReviewAPICall';

function ReviewDetailForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { reviewDetail, error } = useSelector(state => state.reviewDetailReducer);

    useEffect(() => {
        dispatch(callGetReviewDetailAPI(id));
        console.log('Fetching review for id:', id);
    }, []);

    const handleGoBack = () => {
        navigate('/holdup/reviews');
    };

    const handleUpdate = () => {
        navigate(`/holdup/reviews/update/${id}`);
    };

    if (error) return <div>에러 발생: {error}</div>;



    return (
        <div>
            <h1>리뷰 상세</h1>
            <div>
                {reviewDetail ? (
                    <>
                        <h2>{reviewDetail.title}</h2>
                        <p>작성자: {reviewDetail.nickname}</p>
                        <p>등록날짜: {reviewDetail.createDate}</p>
                        <p>평점: {reviewDetail.rating}</p>
                        <p>예약 ID: {reviewDetail.reservationId}</p>
                        <p>내용: {reviewDetail.content}</p>
                        <div>
                            <h3>이미지</h3>
                            <div>
                                {reviewDetail.imageUrl && reviewDetail.imageUrl.length > 0 ? (
                                    reviewDetail.imageUrl.map((url, index) => (
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

export default ReviewDetailForm;