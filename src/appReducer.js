import {authApi, userApi, followApi, profileApi} from './api/api';

const ADD_CREATED_USER = 'ADD-CREATED-USERS';
const SET_USERS = 'SET-USERS';
const ADD_AUTH_USER = 'ADD-AUTH_USER';
const ADD_SUBSCRIPTION = 'ADD-SUBSCRIPTION';
const ADD_POST = 'ADD-POST';

let initial_state = {
    users: [],
    auth_users: [],
    subscriptions: [],
    posts: [],
    created_users: [],
};

let appReducer = (state = initial_state, action) => {

    switch(action.type){
        case ADD_CREATED_USER:
            return {
                ...state,
                created_users: state.created_users.concat(action.user),
            }
        case SET_USERS:
            return {
                ...initial_state,
                users: action.users,
            };
        case ADD_AUTH_USER: 
            return {
                ...state,
                auth_users: state.auth_users.concat(action.user),
            }
        case ADD_SUBSCRIPTION:
            return {
                ...state,
                subscriptions: state.subscriptions.concat(action.subscription),
            }
        case ADD_POST:
            return {
                ...state,
                posts: state.posts.concat(action.post),
            }
        default: 
            return state;
    };
};

// ACTIONS

export let setUsers = users => ({ type: SET_USERS, users });
export let addAuthUsers = user => ({ type: ADD_AUTH_USER, user });
export let addSubscription = subscription => ({ type: ADD_SUBSCRIPTION, subscription });
export let addPost = post => ({ type: ADD_POST, post });
export let addCreatedUsers = user => ({ type: ADD_CREATED_USER, user});

// THUNKS

export let createUser = options => dispatch => {

    authApi.signUp(options)
        .then(data => {
            if(data.result_code == 0) {
                dispatch(addCreatedUsers(data.message));
            }else{
                console.log(data.message);
            }
        });
};

export let getUsers = () => dispatch => {
    userApi.getUsersNoData()
        .then(data => {
            console.log(
                `-------------------------------\n
                ---GETING USERS SUCCESSFULLY---\n
                -------------------------------`);
            dispatch(setUsers(data.items));
        });
};

export let authUser = options => dispatch => {
    authApi.signIn(options)
        .then(data => {
            if(data.result_code == 0){
                console.log(data.message);
                dispatch(addAuthUsers(data.data));
            }else{
            };
        });
};

export let posted = options => dispatch => {
    profileApi.createPost(options)
        .then((data) => {
            if(data.result_code == 0) {
                dispatch(addPost(data.massage));
            }else{
                console.log(`missed`);
            };
            return Promise.resolve();
        });
}

export let subscribed = options => dispatch => {
    followApi.follow(options)
        .then(resolve => {
            if(resolve.result_code == 0){
                dispatch(addSubscription(resolve.message));
            }else{
                console.log(resolve.message);
            };
        });
};
 

export default appReducer;

