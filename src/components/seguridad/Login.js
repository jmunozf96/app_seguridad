import React from "react";
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { accederAccion } from '../../redux/seguridad/authDucks'

const Login = (props) => {
    const [credentials, setCredentials] = React.useState({
        email: '',
        password: ''
    });

    const dispatch = useDispatch()
    const loading = useSelector(store => store.auth.loading)
    const activo = useSelector(store => store.auth.activo)
    const error = useSelector(store => store.auth.error)

    React.useEffect(() => {
        if (activo) {
            props.history.push('/home')
        }
    }, [activo, props])

    const login = (e) => {
        e.preventDefault();
        dispatch(accederAccion(credentials))
    }

    return (
        <div className="row justify-content-center justify-content-lg-end mt-5">
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mr-lg-5 ml-xl-5">
                <div className="card">
                    <div className="card-body">
                        {error !== null && <div className="alert alert-danger">
                            <i className="fas fa-times" /> {error}</div>}
                        <h5>Entrada al Sistema</h5>
                        <hr />
                        <form onSubmit={(e) => login(e)}>
                            <div className="form-group">
                                <label>Usuario:</label>
                                <input
                                    className="form-control"
                                    placeholder="Ingrese su suario."
                                    value={credentials.email}
                                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Ingrese la contraseña."
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                />
                            </div>
                            <hr />
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}>
                                {loading ? <i className="fas fa-spinner fa-pulse" /> : <i className="fas fa-sign-in-alt" />} Entrar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default withRouter(Login);