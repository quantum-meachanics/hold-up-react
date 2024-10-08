import React from 'react';
import styles from '../../css/SuccessScreen.module.css'

const SuccessScreen = () => {
    return (
        <div className={styles.successContainer}>
            <h1>회원가입 성공!</h1>
            <img src={`${process.env.PUBLIC_URL}/images/holdup_box.png`} alt="회원가입 성공 이미지" />
            <p>회원가입이 완료되었습니다. 5초 후에 로그인 페이지로 이동합니다.</p>
            <button >바로 로그인하기</button>
        </div>
    );
};

export default SuccessScreen;
