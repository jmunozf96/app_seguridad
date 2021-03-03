import LoginService from "../../services/LoginService";
import jwt from "jsonwebtoken"
import { Redirect } from "react-router-dom";

const dataInicial = {
    loading: false,
    activo: false,
    error: null,
    grupoSelect: null
}

const LOADING = 'LOADING'
const USER_EXITO = 'USER_EXITO'
const USER_ERROR = 'USER_ERROR'
const SELECT_GROUP = 'SELECT_USER_GROUP'
const CERRAR_SESION = 'CERRAR_SESION'

export default function authReducer(state = dataInicial, action) {

    switch (action.type) {
        case LOADING:
            return { ...state, loading: true }
        case USER_ERROR:
            return { ...state, error: action.payload.error }
        case USER_EXITO:
            return {
                ...state,
                loading: false,
                activo: true,
                token: action.payload.token,
                user: action.payload.user,
                error: null
            }
        case SELECT_GROUP:
            return { ...state, grupoSelect: action.payload.grupoSelect }
        case CERRAR_SESION:
            return { ...dataInicial }
        default:
            return { ...state }
    }

}

export const accederAccion = (data) => async (dispatch) => {
    dispatch({ type: LOADING })

    LoginService.login(JSON.stringify(data))
        .then(response => {
            const decode_token = jwt.decode(response.data.access_token, { complete: true })

            dispatch({
                type: USER_EXITO, payload: {
                    user: {
                        id: decode_token.payload.sub,
                        name: decode_token.payload.name,
                        email: decode_token.payload.email,
                        permisos: decode_token.payload.permisos,
                        _token: response.data.access_token
                    }
                }
            })

            localStorage.setItem('_token', JSON.stringify(response.data.access_token))

            //Siempre enviar el primer grupo
            dispatch(grupoUserSelect(decode_token.payload.permisos[0]))
        }).catch(e => {
            console.error(e)
            dispatch({
                type: USER_ERROR,
                payload: { error: "No se puede iniciar sesión." }
            });

        });
}

export const grupoUserSelect = (permiso) => (dispatch) => {
    dispatch({type: SELECT_GROUP,payload: { grupoSelect: permiso }});
}

export const leerUsuarioAccion = () => async (dispatch) => {
    if (localStorage.getItem('_token')) {
        const _token = JSON.parse(localStorage.getItem('_token'))
        const decode_token = jwt.decode(_token, { complete: true })

        var dateNow = new Date();
        //console.log(dateNow.getTime()/1000); divide it by 1000 milliseconds and you'll get time in seconds
        if (decode_token.payload.exp > (dateNow.getTime() / 1000)) {
            dispatch({
                type: USER_EXITO, payload: {
                    user: {
                        id: decode_token.payload.sub,
                        name: decode_token.payload.name,
                        email: decode_token.payload.email,
                        permisos: decode_token.payload.permisos,
                        _token
                    }
                }
            })

            //Siempre enviar el primer grupo
            dispatch(grupoUserSelect(decode_token.payload.permisos[0]))

            return;
        }
    }

    dispatch(cerrarSesionAccion())
}

export const cerrarSesionAccion = () => async (dispatch, getState) => {
    const user = getState().auth.user;
    if (user !== undefined) {
        return LoginService.logout(user._token)
            .then(_ => {
                dispatch({ type: CERRAR_SESION })
                localStorage.removeItem('_token')
                return <Redirect to={'/login'} />
            })
            .catch(error => {
                console.error(error)
                return false;
            })
    }

    return false
}