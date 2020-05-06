import {
    LOGIN, REGISTER
} from './actions';

const initialStatePostsBySubreddit: PostsBySubredditState = {};
const initialStatePosts: PostsState = {
    isFetching: false,
    items: [],
    error: null,
    lastUpdated: 0,
};

const auth = (
    state = initialStatePosts,
    action: AuthActionTypes_I,
): AuthState => {
    switch (action.type) {
        case LOGIN:

        case REGISTER:
            // return {
            //     ...state,
            //     isFetching: false,
            //     error: null,
            //     items: [],
            //     lastUpdated: action.receivedAt,
            // };
        default:
            return state;
    }
};

export default auth;
