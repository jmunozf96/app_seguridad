import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import authDucks, { leerUsuarioAccion } from "./seguridad/authDucks"
import userDucks from "./seguridad/userDucks"
import grupoDucks from "./seguridad/grupoDucks"
import GrupoPermisosDucks from "./seguridad/grupoPermisoDucks"

const rootReducer = combineReducers({
    auth: authDucks,
    user: userDucks,
    grupo: grupoDucks,
    gpermiso: GrupoPermisosDucks
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function generateStore() {
    const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))
    leerUsuarioAccion()(store.dispatch)
    return store
}

