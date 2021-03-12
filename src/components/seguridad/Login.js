import React from "react";
import {useDispatch, useSelector} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {accederAccion} from '../../redux/seguridad/authDucks'

const Login = (props) => {
    const [credentials, setCredentials] = React.useState({
        email: '',
        password: ''
    });

    const dispatch = useDispatch();
    const loading = useSelector(store => store.auth.loading);
    const activo = useSelector(store => store.auth.activo);
    const error = useSelector(store => store.auth.error);
    const sesion_expirada = useSelector(store => store.auth.session_expired);

    React.useEffect(() => {
        if (activo) {
            props.history.push('/home')
        }
    }, [activo, props]);

    const login = (e) => {
        e.preventDefault();
        dispatch(accederAccion(credentials))
    };

    const validate_error_form = (field) => {
        return error !== null && error.type === 'VALIDATION' && error.message[field] &&
            <small className="text-danger">{error.message[field]}</small>

    };

    return (
        <div className="row justify-content-center justify-content-lg-end mt-5">
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mr-lg-5 ml-xl-5">
                <div className="card">
                    <div className="card-body">
                        <h5>Entrada al Sistema</h5>
                        <hr/>
                        {sesion_expirada &&
                        <div className="alert alert-danger">
                            <i className="fas fa-times"/> Su sesión ha expirado, vuelva a ingresar.
                        </div>}
                        {error !== null && error.type === 'LOGIN_INCORRECT' &&
                        <div className="alert alert-danger">
                            <i className="fas fa-times"/> {error.message}
                        </div>}
                        <form onSubmit={(e) => login(e)}>
                            <div className="form-group">
                                <label>Usuario:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ingrese su usuario..."
                                    autoComplete="on"
                                    value={credentials.email}
                                    onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                                />
                                {validate_error_form('email')}
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Ingrese la contraseña..."
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                                />
                                {validate_error_form('password')}
                            </div>
                            <hr/>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}>
                                {loading ? <i className="fas fa-spinner fa-pulse"/> :
                                    <i className="fas fa-sign-in-alt"/>} Entrar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Login);
