import GrupoService from "../../services/GrupoService";

const dataInicial = {
    save: true,
    loading: false,
    data: null,
    error: null,
    process: null
};

const LOADING = 'LOADING_GRUPO';
const ADD_GRUPO = 'ADD_GRUPO';
const PROCESS_GRUPO = 'PROCESS_GRUPO';
const STATUS_FORM = 'STATUS_FORM';
const ERROR = 'ERROR_GRUPO';
const RESET_GRUPO_FORM = 'RESET_GRUPO_FORM';

export default function grupoReducer(state = dataInicial, action) {
    switch (action.type) {
        case LOADING:
            return {...state, loading: true, error: null, process: null};
        case ERROR:
            return {...state, loading: false, error: action.payload.error, process: null};
        case ADD_GRUPO:
            return {...state, data: action.payload.data};
        case PROCESS_GRUPO:
            return {...state, loading: false, error: null, process: action.payload.process};
        case STATUS_FORM:
            return {...state, save: action.payload.save};
        case RESET_GRUPO_FORM:
            return {...state, loading: false, error: null, process: null, data: null};
        default:
            return {...state}
    }
}

export const resetModal = () => async (dispatch) => {
    dispatch({
        type: RESET_GRUPO_FORM
    });
};

export const changeStatusForm = (status) => async (dispatch) => {
    dispatch({
        type: STATUS_FORM, payload: {save: status}
    });
};

export const dataGrupo = (grupo) => async (dispatch) => {
    dispatch({
        type: ADD_GRUPO,
        payload: {
            data: grupo
        }
    })
};

export const saveGrupo = () => async (dispatch, getState) => {
    const _token = getState().auth.user._token;
    const grupo = getState().grupo.data;

    if (grupo) {
        dispatch({type: LOADING});
        return GrupoService.save(grupo, _token)
            .then(response => {
                dispatch({
                    type: PROCESS_GRUPO, payload: {
                        process: response.data
                    }
                });
                return true;
            }).catch((error) => {
                if (error.response) {
                    dispatch({
                        type: ERROR,
                        payload: {error: error.response.data}
                    });
                } else if (error.request) {
                    console.error(error.request);
                }
                return false;
            })
    }

    return false;

};

export const updateGrupo = () => async (dispatch, getState) => {
    const _token = getState().auth.user._token;
    const grupo = getState().grupo.data;

    if (grupo) {
        dispatch({type: LOADING});
        return GrupoService.update(grupo, _token)
            .then(response => {
                dispatch({type: PROCESS_GRUPO, payload: {process: response.data}})
                return true;
            }).catch((error) => {
                if (error.response) {
                    dispatch({
                        type: ERROR,
                        payload: {error: error.response.data}
                    });
                } else if (error.request) {
                    console.error(error.request);
                }
                return false;
            })
    }

    return false;
};

export const deleteGrupo = (id) => async (dispatch, getState) => {
    const _token = getState().auth.user._token;

    return GrupoService.destroy(id, _token)
        .then(response => {
            dispatch({type: PROCESS_GRUPO, payload: {process: response.data}})
            return true;
        }).catch((error) => {
            if (error.response) {
                dispatch({
                    type: ERROR,
                    payload: {error: error.response.data}
                });
            } else if (error.request) {
                console.error(error.request);
            }
            return false;
        })

}
