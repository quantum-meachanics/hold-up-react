import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { callGetReportDetailAPI, callUpdateReportAPI } from '../../apis/ReportAPICall';

function ReportUpdateForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { reportDetail, error } = useSelector(state => state.reportDetailReducer);

    // 기존 이미지를 저장할 state
    const [images, setImages] = useState([{
        imageUrl: '',
        imageId: ''
    }]);

    // 삭제할 이미지 ID들을 관리할 새로운 state
    const [deletedImageIds, setDeletedImageIds] = useState([]);

    // 파일 리스트 저장할 state
    const [imageFiles, setImageFiles] = useState([]);

    const [showImages, setShowImages] = useState([]);
    const [inputModify, setInputModify] = useState({
        title: '',
        content: '',
    });


    useEffect(() => {
        dispatch(callGetReportDetailAPI(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (reportDetail) {
            setImages(
                Array.isArray(reportDetail.imageId)
                    ? reportDetail.imageId.map((id, index) => ({
                        imageUrl: Array.isArray(reportDetail.imageUrl) ? reportDetail.imageUrl[index] : reportDetail.imageUrl,
                        imageId: id
                    }))
                    : [{
                        imageUrl: reportDetail.imageUrl || '',
                        imageId: reportDetail.imageId || ''
                    }]
            );

            setInputModify({
                title: reportDetail.title || '',
                content: reportDetail.content || '',
            });

        }
    }, [reportDetail]);

    const handleGoBack = () => {
        navigate('/holdup/reports');
    };

    const handleUpdate = (e) => {
        dispatch(callUpdateReportAPI(id, inputModify, imageFiles, deletedImageIds));
        navigate(`/holdup/reports/${id}`)
    };

    const onChangeHandler = e => {
        setInputModify({
            ...inputModify,
            [e.target.name]: e.target.value
        })
    };


    // 이미지 업로드 처리 메소드
    const fileChangeHandler = (e) => {
        const imageLists = e.target.files;
        let imageUrlLists = [...showImages];
        let fileLists = [...imageFiles];

        for (let i = 0; i < imageLists.length; i++) {
            const currentImageUrl = URL.createObjectURL(imageLists[i]);
            imageUrlLists.push(currentImageUrl);
            fileLists.push(imageLists[i]);
        };

        if (imageUrlLists.length > 10) {
            imageUrlLists = imageUrlLists.slice(0, 10);
            fileLists = fileLists.slice(0, 10);
        }

        setShowImages(imageUrlLists);
        setImageFiles(fileLists);
    };

    // 추가한 이미지 삭제 처리 메소드
    const deleteimageFiles = (id) => {
        URL.revokeObjectURL(showImages[id]);
        setShowImages(showImages.filter((_, index) => index !== id));
        setImageFiles(imageFiles.filter((_, index) => index !== id));
    };

    const deleteImages = (imageId) => {
        // 삭제할 이미지 찾기
        const imageToDelete = images.find(img => img.imageId === imageId);

        if (imageToDelete) {
            // URL 객체 해제
            URL.revokeObjectURL(imageToDelete.imageUrl);

            // 이미지 ID로 필터링하여 새 배열 생성
            setImages(images.filter(img => img.imageId !== imageId));
            // 삭제할 이미지 ID 목록에 추가
            setDeletedImageIds(prev => [...prev, imageId]);
            console.log("Deleted image ID:", imageId);
        } else {
            console.log("Image not found:", imageId);
        }
    }



    if (error) return <div>에러 발생: {error}</div>;

    return (
        <div>
            <div>
                {reportDetail ? (
                    <>
                        <span>제목: </span>
                        <input type='text' name='title' placeholder={inputModify.title} onChange={onChangeHandler} />

                        <span>내용:</span>
                        <input type='textarea' name='content' placeholder={inputModify.content} onChange={onChangeHandler} />

                        <div>
                            <span>이미지 : </span>
                            <input type="file" multiple accept="image/*" onChange={fileChangeHandler} />
                            <div>
                                {images.map((image) => (
                                    <div key={image.imageId}>
                                        <img src={image.imageUrl} alt={`업로드된 이미지 ${image.imageId}`} />
                                        <button type="button" onClick={() => deleteImages(image.imageId)}>X</button>
                                    </div>
                                ))}

                                {showImages.map((image, id) => (
                                    <div key={id}>
                                        <img src={image} alt={`${image}-${id}`} />
                                        <button type="button" onClick={() => deleteimageFiles(id)}>X</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <h2>게시글이 존재 하지 않습니다.</h2>
                )}


            </div>
            <button onClick={handleGoBack}>돌아가기</button>
            <button onClick={handleUpdate}>작성하기</button>
        </div>
    );
}

export default ReportUpdateForm;