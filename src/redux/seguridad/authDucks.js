import React from "react";
import LoginService from "../../services/LoginService";
import jwt from "jsonwebtoken"
import {Redirect} from "react-router-dom";

const dataInicial = {
    loading: false,
    activo: false,
    error: null,
    grupoSelect: null,
    time_session: null,
    session_expired: false
};

const LOADING = 'LOADING';
const USER_EXITO = 'EXITO_AUTH';
const USER_ERROR = 'ERROR_AUTH';
const SELECT_GROUP = 'SELECT_USER_GROUP';
const CERRAR_SESION = 'CERRAR_SESION';
const TIEMPO_SESION = 'TIEMPO_SESION';
const SESION_EXPIRADA = 'SESION_EXPIRADA';

export default function authReducer(state = dataInicial, action) {

    switch (action.type) {
        case LOADING:
            return {...state, loading: true, error: null, session_expired: false};
        case USER_ERROR:
            return {...state, loading: false, error: action.payload.error};
        case USER_EXITO:
            return {
                ...state,
                loading: false,
                activo: true,
                token: action.payload.token,
                user: action.payload.user,
                error: null
            };
        case SELECT_GROUP:
            return {...state, grupoSelect: action.payload.grupoSelect};
        case CERRAR_SESION:
            return {...state, loading: false, activo: false, error: null, grupoSelect: null};
        case TIEMPO_SESION:
            return {...state, time_session: action.payload};
        case SESION_EXPIRADA:
            return {...dataInicial, session_expired: true};
        default:
            return {...state};
    }

}

export const accederAccion = (data) => async (dispatch) => {
    dispatch({type: LOADING});

    LoginService.login(JSON.stringify(data))
        .then(response => {
            const decode_token = jwt.decode(response.data.access_token, {complete: true});
            const access_modules = response.data.access_modules;

            dispatch({
                type: USER_EXITO, payload: {
                    user: {
                        id: decode_token.payload.sub,
                        name: decode_token.payload.name,
                        email: decode_token.payload.email,
                        permisos: access_modules,
                        _token: response.data.access_token
                    }
                }
            });

            localStorage.setItem('_token', JSON.stringify(response.data.access_token));
            localStorage.setItem('_modules', JSON.stringify(response.data.access_modules));
            let dateNow = new Date();

            dispatch({type: TIEMPO_SESION, payload: logout_atomatic(decode_token, dateNow, dispatch)});
            //Siempre enviar el primer grupo
            dispatch(grupoUserSelect(access_modules[0]))
        }).catch(e => {
        if (e.response) {
            dispatch({
                type: USER_ERROR,
                payload: {error: e.response.data}
            });
        } else if (e.request) {
            console.error(e.request);
        }
    });
};

export const grupoUserSelect = (permiso) => (dispatch) => {
    dispatch({type: SELECT_GROUP, payload: {grupoSelect: permiso}});
};

export const leerUsuarioAccion = () => async (dispatch) => {
    const token = localStorage.getItem('_token');
    const modules = localStorage.getItem('_modules');

    if (token && modules) {
        const _token = JSON.parse(token);
        const _modules = JSON.parse(modules);
        const decode_token = jwt.decode(_token, {complete: true});

        let dateNow = new Date();

        dispatch({type: TIEMPO_SESION, payload: logout_atomatic(decode_token, dateNow, dispatch)});

        //console.log(dateNow.getTime()/1000); divide it by 1000 milliseconds and you'll get time in seconds
        if (decode_token.payload.exp > (dateNow.getTime() / 1000)) {
            dispatch({
                type: USER_EXITO, payload: {
                    user: {
                        id: decode_token.payload.sub,
                        name: decode_token.payload.name,
                        email: decode_token.payload.email,
                        permisos: _modules,
                        _token
                    }
                }
            });

            //Siempre enviar el primer grupo
            dispatch(grupoUserSelect(_modules[0]));
            return;
        }
    } else {
        localStorage.removeItem('_token');
        localStorage.removeItem('_modules');
        return;
    }

    dispatch(cerrarSesionAccion());
};

export const cerrarSesionAccion = () => async (dispatch, getState) => {
    const user = getState().auth.user;
    if (user !== undefined) {
        return LoginService.logout(user._token)
            .then(_ => {
                dispatch({type: CERRAR_SESION});
                localStorage.removeItem('_token');
                localStorage.removeItem('_modules');
                clearInterval(getState().auth.time_session);
                return <Redirect to={'/login'}/>
            })
            .catch(error => {
                console.error(error);
                return false;
            })
    }

    return false
};

const logout_atomatic = (decode_token, dateNow, dispatch) => {
    return setTimeout(() => {
        const _token = localStorage.getItem('_token');
        const _modules = localStorage.getItem('_modules');

        if (_token && _modules) {
            (async () => {
                const response = dispatch(cerrarSesionAccion());
                await response.then(_ => dispatch({type: SESION_EXPIRADA})).catch(error => {
                    console.log(error);
                })
            })();
        }
    }, ((decode_token.payload.exp - (dateNow.getTime() / 1000)) - 5) * 1000);
};
