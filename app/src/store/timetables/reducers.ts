import {
    REFRESH,
    RECEIVE_TIMETABLES,
    FAIL_RECEIVE_TIMETABLES,
    SELECT
} from './actions';


const init: TimetablesState = {
    isFetching: false,
    items: [    
        // {
        // title: 'redux',
        // latitude: "number",
        // longitude: "number",
        // start: "string",
        // end: "string",
        // json: "any", // details?
        // identifier: "string",
        // radius: "number",
        // },
],
    error: null,
    lastUpdated: 0,
    selected: null
};



const timetables = (
    state = init,
    action: TimetablesActionTypes_I,
): TimetablesState => {
    switch (action.type) {
        case RECEIVE_TIMETABLES:
            return {
                ...state,
                isFetching: false,
                error: null,
                lastUpdated: action.receivedAt,
                items: action.posts,
            };
        case FAIL_RECEIVE_TIMETABLES:
            return {
                ...state,
                isFetching: false,
                error: action.error,
                lastUpdated: action.receivedAt,
            };
        case SELECT:
            return {
                ...state,
                isFetching: false,
                error: null,
                lastUpdated: action.receivedAt,
                selected: action.word
                };
        case REFRESH:
            return {
                ...state,
                isFetching: true,
                error: null,
                lastUpdated: action.receivedAt,
            };

        default:
          return state;
      }
};

export default timetables;