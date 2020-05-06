export const REFRESH = 'REFRESH';
export const SELECT = 'SELECT';
export const RECEIVE_TIMETABLES = 'RECEIVE_TIMETABLES';
export const FAIL_RECEIVE_TIMETABLES = 'FAIL_RECEIVE_TIMETABLES';

export const refresh = (
    word: string,
): RefreshAction => ({
    type: REFRESH,
    word,
});

export const select = (
    word: string,
): SelectAction => ({
    type: SELECT,
    word,
});


export const receiveTimetables = (
    posts: any,
): ReceiveTimetablesAction => ({
    type: RECEIVE_TIMETABLES,
    posts: posts,//[{title: 'hello'}], //json.data.children.map((child: any) => child.data),
    receivedAt: Date.now(),
});

export const failReceiveTimetables = (
    error: Error,
): FailReceiveTimetablesAction => ({
    type: FAIL_RECEIVE_TIMETABLES,
    error,
    receivedAt: Date.now(),
});
