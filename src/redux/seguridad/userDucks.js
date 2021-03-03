import UserService from "../../services/UserService";

const dataInicial = {
    save: true,
    loading: false,
    data: null,
    error: null,
    process: null
}

const LOADING = 'LOADING_USER'
const ADD_USER = 'ADD_USER'
const PROCESS_USER = 'PROCESS_USER'
const STATUS_FORM = 'STATUS_FORM'
const ERROR = 'ERROR'
const RESET_USER_FORM = 'RESET_USER_FORM'

export default function usuarioReducer(state = dataInicial, action) {
    switch (action.type) {
        case LOADING:
            return { ...state, loading: true }
        case ERROR:
            return { ...state, loading: false, error: action.payload.error, process: null }
        case ADD_USER:
            return { ...state, data: action.payload.data }
        case PROCESS_USER:
            return { ...state, loading: false, error: null, process: action.payload.process }
        case STATUS_FORM:
            return { ...state, save: action.payload.save }
        case RESET_USER_FORM:
            return { ...state, loading: false, error: null, process: null, data: null }
        default:
            return { ...state }
    }
}

export const resetModal = () => async (dispatch) => {
    dispatch({
        type: RESET_USER_FORM
    });
}

export const changeStatusForm = (status) => async (dispatch) => {
    dispatch({
        type: STATUS_FORM, payload: { save: status }
    });
}

export const dataUser = (user) => async (dispatch) => {
    dispatch({
        type: ADD_USER,
        payload: {
            data: user
        }
    })
}

export const saveUser = () => async (dispatch, getState) => {
    const _token = getState().auth.user._token
    const user = getState().user.data

    if (user) {
        dispatch({ type: LOADING })
        return UserService.save(user, _token)
            .then(response => {
                dispatch({
                    type: PROCESS_USER, payload: {
                        process: response.data
                    }
                })
                return true;
            }).catch((error) => {
                dispatch({
                    type: ERROR,
                    payload: { error: error.response.data }
                });
                return false;
            })
    }

    return false;

}

export const updateUser = () => async (dispatch, getState) => {
    const _token = getState().auth.user._token
    const user = getState().user.data

    if (user) {
        dispatch({ type: LOADING })
        return UserService.update(user, _token)
            .then(response => {
                dispatch({ type: PROCESS_USER, payload: { process: response.data } })
                return true;
            }).catch((error) => {
                dispatch({
                    type: ERROR,
                    payload: { error: error.response.data }
                });
                return false;
            })
    }

    return false;
}

export const deleteUser = (id) => async (dispatch, getState) => {
    const _token = getState().auth.user._token

    return UserService.destroy(id, _token)
        .then(response => {
            dispatch({ type: PROCESS_USER, payload: { process: response.data } })
            return true;
        }).catch((error) => {
            console.log(error.response.data);
            return false;
        })

}