export const Types = {
    GET_STARRED_REPOSITORIES: 'github/GET_STARRED_REPOSITORIES',
    GET_STARRED_REPOSITORIES_SUCCESS: 'github/GET_STARRED_REPOSITORIES_SUCCESS',
    GET_STARRED_REPOSITORIES_ERROR: 'github/GET_STARRED_REPOSITORIES_ERROR',

    SET_FILTER: 'github/SET_FILTER',
    SET_FILTER_SUCCESS: 'github/SET_FILTER_SUCCESS',
};

const initialState = {
    repositories: [],
    isLoading: false,
    activeFilter: 'All',
};

//Reducers
export default function github(state = initialState, action) {
    switch (action.type) {
        case Types.SET_FILTER:
            return {
                ...state,
                isLoading: true,
            }
            case Types.SET_FILTER_SUCCESS:
            return {
                ...state,
                activeFilter: action.payload.filter,
                isLoading: false,
            }
        case Types.GET_STARRED_REPOSITORIES:
            return {
                ...state,
                isLoading: true,
            };
        case Types.GET_STARRED_REPOSITORIES_SUCCESS:
        return {
            ...state,
            isLoading: false,
            repositories:  action.payload.repositories 
        }
        default: return state;
    }
}

//Actions
export const Creators = {
    setFilter: filter => ({
        type: Types.SET_FILTER,
        payload: {
            filter,
        }
    }),

    setFilterSuccess: filter => ({
        type: Types.SET_FILTER_SUCCESS,
        payload: {
            filter,
        }
    }),

    getStarredRepositoriesRequest: username => ({
        type: Types.GET_STARRED_REPOSITORIES,
        payload: {
            username,
        },
    }),

    getStarredRepositoriesSuccess: repositories => ({
        type: Types.GET_STARRED_REPOSITORIES_SUCCESS,
        payload: {
            repositories,
        },
    }),

    getStarredRepositoriesError: message => ({
        type: Types.GET_STARRED_REPOSITORIES_ERROR,
        payload: {
            message,
        },
    }),
};