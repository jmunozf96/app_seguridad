import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { changeStatusForm, dataGrupo, resetModal, saveGrupo, updateGrupo }
    from "../../../redux/seguridad/grupoDucks"

const GrupoForm = () => {
    const dispatch = useDispatch()
    const grupoRedux = useSelector(store => store.grupo)

    const [loadForm, setLoadForm] = useState(true)
    const [getGrupo, setGetGrupo] = useState(!grupoRedux.save)
    const [grupo, setGrupo] = useState({
        nombre: "", descripcion: ""
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
        if (getGrupo) {
            setGrupo({
                ...grupo,
                nombre: grupoRedux.data.nombre,
                descripcion: grupoRedux.data.descripcion,
                id: grupoRedux.data.id
            })

            setGetGrupo(false);
        }
    }, [getGrupo, grupoRedux, grupo])

    const handleChange = (e) => {
        setGrupo({
            ...grupo,
            [e.target.name]: e.target.value
        })
    }

    const submitForm = (e) => {
        e.preventDefault();

        if (grupo.nombre.trim() === "") {
            alert("Ingresar un nombre");
            return;
        }

        if (grupo.descripcion.trim() === "") {
            alert("Ingresar un correo");
            return
        }

        dispatch(dataGrupo(grupo));
        let response = false;
        if (grupoRedux.save) {
            (async () => {
                response = await Promise.resolve(dispatch(saveGrupo()))
            })();
        } else {
            (async () => {
                response = await Promise.resolve(dispatch(updateGrupo()))
            })();
        }

        if (response)
            resetForm()
    }

    const resetForm = () => {
        setGrupo({
            nombre: "", descripcion: ""
        })
    }

    return (
        <form onSubmit={(e) => submitForm(e)}>
            {grupoRedux.error && Array.isArray(grupoRedux.error) &&
                <div className="alert alert-danger">
                    {grupoRedux.error.map((error, i) =>
                        <li key={i}>{error}</li>
                    )}
                </div>
            }
            {grupoRedux.process &&
                <div className="alert alert-success">
                    <i className="fas fa-check-circle" /> {grupoRedux.process.message}
                </div>
            }

            <div className="form-group">
                <label>Nombre</label>
                <div className="input-group mb-2">
                    <div className="input-group-prepend">
                        <div className="input-group-text">
                            <i className="fas fa-font" />
                        </div>
                    </div>
                    <input
                        name="nombre"
                        value={grupo.nombre} onChange={(e) => handleChange(e)}
                        type="text"
                        className="form-control"
                        required />
                </div>
            </div>
            <div className="form-group">
                <label>Descripcion</label>
                <div className="input-group mb-2">
                    <div className="input-group-prepend">
                        <div className="input-group-text">
                            <i className="fas fa-align-left" />
                        </div>
                    </div>
                    <textarea
                        name="descripcion"
                        value={grupo.descripcion}
                        onChange={(e) => handleChange(e)}
                        className="form-control" required />
                </div>
            </div>
            <button className="btn btn-success"
                disabled={grupoRedux.loading}>
                {grupoRedux.loading ? <i className="fas fa-spinner fa-pulse" /> : <i className="fas fa-save" />}
                {" "}Guardar
            </button>
        </form>
    );
}

export default GrupoForm;