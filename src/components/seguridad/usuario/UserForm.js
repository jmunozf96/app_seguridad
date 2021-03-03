import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { changeStatusForm, dataUser, resetModal, saveUser, updateUser }
    from "../../../redux/seguridad/userDucks"

const UserForm = () => {
    const dispatch = useDispatch()
    const userRedux = useSelector(store => store.user)

    const [loadForm, setLoadForm] = useState(true)
    const [getUser, setGetUSer] = useState(!userRedux.save)
    const [user, setUser] = useState({
        name: "", email: "", password: "", password_confirmation: ""
    })

    useEffect(() => {
        return () => {
            dispatch(changeStatusForm(true))//Para editar -> cambia estado de save a true
        }
    }, [dispatch])

    useEffect(() => {
        if (loadForm) {
            dispatch(resetModal())
            setLoadForm(false)
        }

    }, [loadForm, dispatch])

    useEffect(() => {
        if (getUser) {
            setUser({
                ...user,
                name: userRedux.data.name,
                email: userRedux.data.email,
                id: userRedux.data.id
            })

            setGetUSer(false);
        }
    }, [getUser, userRedux, user])

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const submitForm = (e) => {
        e.preventDefault();

        if (user.name.trim() === "") {
            alert("Ingresar un nombre");
            return;
        }

        if (user.email.trim() === "") {
            alert("Ingresar un correo");
            return
        }

        if (user.password.trim() === "") {
            alert("Ingresar una contraseña");
            return
        }

        if (user.password_confirmation.trim() === "") {
            alert("Confirmar la contraseña");
            return
        }


        dispatch(dataUser(user));
        let response = false;
        if (userRedux.save) {
            (async () => {
                response = await Promise.resolve(dispatch(saveUser()))
            })();
        } else {
            (async () => {
                response = await Promise.resolve(dispatch(updateUser()))
            })();
        }

        if (response)
            resetForm()
    }

    const resetForm = () => {
        setUser({
            name: "", email: "", password: "", password_confirmation: ""
        })
    }


    return (
        <form onSubmit={(e) => submitForm(e)}>
            {userRedux.error && Array.isArray(userRedux.error) &&
                <div className="alert alert-danger">
                    {userRedux.error.map((error, i) =>
                        <li key={i}>{error}</li>
                    )}
                </div>
            }
            {userRedux.process &&
                <div className="alert alert-success">
                    <i className="fas fa-check-circle" /> {userRedux.process.message}
                </div>
            }
            <div className="form-group">
                <label>Usuario</label>
                <div className="input-group mb-2">
                    <div className="input-group-prepend">
                        <div className="input-group-text">
                            <i className="fas fa-user" />
                        </div>
                    </div>
                    <input name="name" value={user.name} onChange={(e) => handleChange(e)}
                        type="text" className="form-control" required />
                </div>
            </div>
            <div className="form-group">
                <label>Correo</label>
                <div className="input-group mb-2">
                    <div className="input-group-prepend">
                        <div className="input-group-text">
                            <i className="fas fa-at" />
                        </div>
                    </div>
                    <input name="email" value={user.email} onChange={(e) => handleChange(e)}
                        type="email" className="form-control" required />
                </div>
            </div>
            <div className="form-group">
                <label>Contraseña</label>
                <div className="input-group mb-2">
                    <div className="input-group-prepend">
                        <div className="input-group-text">
                            <i className="fas fa-lock" />
                        </div>
                    </div>
                    <input name="password" value={user.password} onChange={(e) => handleChange(e)}
                        type="password" className="form-control" required autoComplete="new-password" />
                </div>
            </div>
            <div className="form-group">
                <label>Confirmar Contraseña</label>
                <div className="input-group mb-2">
                    <div className="input-group-prepend">
                        <div className="input-group-text">
                            <i className="fas fa-lock" />
                        </div>
                    </div>
                    <input name="password_confirmation" value={user.password_confirmation} onChange={(e) => handleChange(e)}
                        type="password" className="form-control" required />
                </div>
            </div>
            <button className="btn btn-success"
                disabled={userRedux.loading}>
                {userRedux.loading ? <i className="fas fa-spinner fa-pulse" /> : <i className="fas fa-save" />}
                {" "}Guardar
            </button>
        </form>
    )
}

export default UserForm