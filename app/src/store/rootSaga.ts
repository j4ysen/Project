import { all } from 'redux-saga/effects';

// import postsBySubreddit from './postsBySubreddit/sagas';
// import subreddits from './subreddits/sagas';
import timetables from './timetables/sagas';
import {loginHelper, signupHelper} from './auth/sagas';

export default function* rootSaga() {
    yield all([
        // postsBySubreddit(),
        // subreddits(),
        loginHelper(),
        signupHelper(),
        timetables()
        // some more
    ]);
}
