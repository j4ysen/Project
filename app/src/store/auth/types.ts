// =================
// ACTIONS
// =================

interface LoginAction {
    type: string;
    username: string;
    email: string;
    password: string;
}

interface SignUpAction {
    type: string;
    username: string;
    email: string;
    password: string;
}

type AuthActionTypes_U = (
    LoginAction |
    SignUpAction
);

// Union Types

type AuthActionTypes_I = (
    LoginAction &
    SignUpAction 
);
// Intersection Types

// =================
// REDUCERS
// =================


interface AuthState {
    isFetching: boolean;
    items: any[];
    error: Error | null;
    lastUpdated: number;
}
