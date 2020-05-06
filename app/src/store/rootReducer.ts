import { combineReducers } from 'redux';

// import selectedSubreddit from './selectedSubreddit/reducers';
// import subreddits from './subreddits/reducers';
// import postsBySubreddit from './postsBySubreddit/reducers';
import timetables from './timetables/reducers';

const rootReducer = combineReducers({
    // selectedSubreddit,
    // subreddits,
    // postsBySubreddit,
    timetables
});

export default rootReducer;
