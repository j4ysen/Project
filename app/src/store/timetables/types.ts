// =================
// ACTIONS
// =================
// interface GetTimetableAction {
//     type: string;
//     // There's no actions
//     latitude: number;
//     longitude: number;
//     start: string;
//     end: string;
//     json: any, // details?
//     identifier: string,
//     radius: number;
// }

interface RefreshAction {
    type: string;
    word: string;
}

interface SelectAction {
    type: string;
    word: string;
}

interface ReceiveTimetablesAction {
    type: string;
    
    posts: any[];
    receivedAt: number;
}

interface FailReceiveTimetablesAction {
    type: string;
    
    error: Error | null;
    receivedAt: number;
}

type TimetablesActionTypes_U = (SelectAction | RefreshAction | ReceiveTimetablesAction | FailReceiveTimetablesAction); // Union Types
type TimetablesActionTypes_I = (SelectAction & RefreshAction & ReceiveTimetablesAction & FailReceiveTimetablesAction); // Intersection Types

// =================
// REDUCERS
// =================
// interface TimetableInfo {
//     title: string;
// }




interface TimetablesInfo {
    isFetching: boolean;
    items: any[];
    error: Error | null;
    lastUpdated: number;
    selected: string | null;
}

type TimetablesState = TimetablesInfo[];