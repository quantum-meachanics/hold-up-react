import { createActions, handleActions } from "redux-actions";

const initialState = {
    spaceInfo: null,
    error: null
};

export const CREATE_SPACE_SUCCESS = "spaces/CREATE_SPACE_SUCCESS";
export const CREATE_SPACE_FAIL = "spaces/CREATE_SPACE_FAIL";

// 액션 생성
export const { spaces: {
    createSpaceSuccess,
    createSpaceFail
} } = createActions({
    [CREATE_SPACE_SUCCESS]: (spaceInfo) => ({ spaceInfo }),
    [CREATE_SPACE_FAIL]: (error) => ({ error })
});

// 리듀서
const spaceReducer = handleActions({
    [CREATE_SPACE_SUCCESS]: (state, { payload: { spaceInfo } }) => {
        return {
            ...state,
            error: null
        };
    },

    [CREATE_SPACE_FAIL]: (state, { payload: { spaceInfo } }) => {
        return {
            ...state,
            error
        }
    }
}, initialState);

// 기능 구현 브랜치 푸쉬 테스트

export default spaceReducer;