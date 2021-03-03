import GrupoService from "../../services/GrupoService";

const dataInicial = {
    loading: false,
    data: null,
    error: null,
    process: null,
}

const LOADING = 'LOADING_GPERMISO'
const ADD_GPERMISO = 'ADD_GPERMISO'
const PROCESS_GPERMISO = 'PROCESS_GPERMISO'
const RESET = 'RESET_GPERMISO'
const ERROR = 'ERROR_GPERMISO'

export default function grupoPermisoReducer(state = dataInicial, action) {
    switch (action.type) {
        case LOADING:
            return { ...state, loading: true }
        case ERROR:
            return { ...state, loading: false, error: action.payload.error, process: null }
        case ADD_GPERMISO:
            return { ...state, data: action.payload.data }
        case PROCESS_GPERMISO:
            return { ...state, loading: false, error: null, process: action.payload.process }
        case RESET:
            return { ...state, loading: false, error: null, process: null, data: null }
        default:
            return { ...state }
    }
}

export const reset = () => async (dispatch) => {
    dispatch({
        type: RESET
    });
}

export const dataGPermiso = (grupo) => async (dispatch) => {
    dispatch({
        type: ADD_GPERMISO,
        payload: {
            data: grupo
        }
    })
}

export const saveGPermiso = () => async (dispatch, getState) => {
    const _token = getState().auth.user._token
    const data = getState().gpermiso.data

    if (data) {
        dispatch({ type: LOADING })
        return GrupoService.permisos(data, _token)
            .then(response => {
                dispatch({
                    type: PROCESS_GPERMISO, payload: {
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