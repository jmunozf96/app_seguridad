import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {changeStatusForm, dataUser, resetModal, saveUser, updateUser}
    from "../../../redux/seguridad/userDucks"
import InputFieldComponent from "../../InputFieldComponent";

const UserForm = () => {
    const dispatch = useDispatch();
    const userRedux = useSelector(store => store.user);

    const [loadForm, setLoadForm] = useState(true);
    const [getUser, setGetUSer] = useState(!userRedux.save);
    const [user, setUser] = useState({
        name: "", email: "", password: "", password_confirmation: ""
    });

    useEffect(() => {
        return () => {
            dispatch(changeStatusForm(true))//Para editar -> cambia estado de save a true
        }
    }, [dispatch]);

    useEffect(() => {
        if (loadForm) {
            dispatch(resetModal());
            setLoadForm(false)
        }

    }, [loadForm, dispatch]);

    useEffect(() => {
        if (getUser) {
            setUser({
                ...user,
                name: userRedux.data.name,
                email: userRedux.data.email,
                id: userRedux.data.id
            });

            setGetUSer(false);
        }
    }, [getUser, userRedux, user]);

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    };

    const submitForm = (e) => {
        e.preventDefault();

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
    };

    const resetForm = () => {
        setUser({
            name: "", email: "", password: "", password_confirmation: ""
        })
    };


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
                <i className="fas fa-check-circle"/> {userRedux.process.message}
            </div>
            }
            <InputFieldComponent
                label="Usuario"
                name="name"
                value={user.name}
                icon="fas fa-user"
                eventChange={handleChange}
                error={userRedux.error}
                required={false}
            />
            <InputFieldComponent
                label="Correo"
                name="email"
                type="email"
                value={user.email}
                icon="fas fa-at"
                eventChange={handleChange}
                error={userRedux.error}
                required={false}
            />
            <InputFieldComponent
                label="Contraseña"
                name="password"
                type="password"
                value={user.password}
                icon="fas fa-lock"
                eventChange={handleChange}
                error={userRedux.error}
                required={false}
            />
            <InputFieldComponent
                label="Confirmar Contraseña"
                name="password_confirmation"
                type="password"
                value={user.password_confirmation}
                icon="fas fa-lock"
                eventChange={handleChange}
                error={userRedux.error}
                required={false}
                readOnly={!user.password}
            />
            <button className="btn btn-success"
                    disabled={userRedux.loading || !user.password_confirmation}>
                {userRedux.loading ? <i className="fas fa-spinner fa-pulse"/> : <i className="fas fa-save"/>}
                {" "}Guardar
            </button>
        </form>
    )
};

export default UserForm
