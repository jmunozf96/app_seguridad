import React, { useEffect } from "react"
import { useState } from "react";
import { Tabs, Tab } from 'react-bootstrap'
import { useDispatch, useSelector } from "react-redux";
import TmoduleService from "../../../services/TmoduleService";
import { dataGPermiso, saveGPermiso } from "../../../redux/seguridad/grupoPermisoDucks";
import { data } from "jquery";

const model_acceso = { "idModulo": null, "view": false, "read": false, "save": false, "update": false, "delete": false }

const GrupoPermisos = ({ grupo }) => {
    const dispatch = useDispatch()
    const auth = useSelector(store => store.auth.user)
    const gpermisoRedux = useSelector(store => store.gpermiso)

    const [tmodule, setTModule] = useState('');
    const [permisos, setPermisos] = useState([]);
    const [acceso, setAcceso] = useState(gpermisoRedux.data.permisos.length > 0 ? gpermisoRedux.data.permisos : []);

    useEffect(() => {
        (async => {
            TmoduleService.all(0, auth._token, false)
                .then(response => {
                    const { data } = response
                    setPermisos(data.response);
                    if (data.response.length > 0) {
                        setTModule(data.response[0].id)
                    }
                }).catch(error => {
                    console.log(error);
                })
        })();
    }, [auth]);

    const savePermisos = () => {
        const have_one_access = (data) => (data.view || data.read || data.update || data.delete)
        const data = acceso.filter(data => have_one_access(data))

        dispatch(dataGPermiso({
            idGrupo: gpermisoRedux.data.idGrupo, //Se obtiene el id del grupo
            permisos: data
        }));
        dispatch(saveGPermiso())
    }

    return (
        <React.Fragment>
            {permisos && permisos.length > 0 &&
                <React.Fragment>
                    <div className="row">
                        <div className="col-12">
                            {gpermisoRedux.process &&
                                <div className="alert alert-success">
                                    <i className="fas fa-check-circle" /> {gpermisoRedux.process.message}
                                </div>
                            }
                        </div>
                        <div className="col-12">
                            <Tabs
                                id="controlled-tab-example"
                                activeKey={tmodule}
                                onSelect={(k) => setTModule(k)}
                            >
                                {permisos.map((permiso, i) =>
                                    <Tab key={i} eventKey={permiso.id} title={permiso.nombre}>
                                        <FormPermisos>
                                            {permiso.modules.map((module, i) =>
                                                <Permisos
                                                    key={i}
                                                    module={module}
                                                    permiso={acceso}
                                                    setPermiso={setAcceso}
                                                />
                                            )}
                                        </FormPermisos>
                                    </Tab>
                                )}
                            </Tabs>
                        </div>
                        <div className="col-12">
                            <hr />
                            <div className="btn btn-success" onClick={() => savePermisos()}>
                                {gpermisoRedux.loading ? <i className="fas fa-spinner fa-pulse" /> : <i className="fas fa-save" />}
                                {" "}Guardar
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            }
        </React.Fragment>
    );
}

const FormPermisos = ({ children }) => {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 table-responsive">
                    <table className="table table-hovered mt-3">
                        <tbody>
                            {children}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const Permisos = ({ module, permiso, setPermiso }) => {
    const gpermisoRedux = useSelector(store => store.gpermiso)

    const [acceso, setAcceso] = useState(model_acceso)
    const [addPermiso, setAddPermiso] = useState(false)
    const [loadData, setLoadData] = useState(true)
    const [config, setConfig] = useState([
        { name: "view", traduccion: 'Ver', check: false },
        { name: "read", traduccion: 'Leer', check: false },
        { name: "write", traduccion: 'Guardar', check: false },
        { name: "update", traduccion: 'Actualizar', check: false },
        { name: "delete", traduccion: 'Eliminar', check: false }
    ])

    useEffect(() => {
        if (loadData) {
            if (gpermisoRedux.data.permisos.length > 0) {
                const permisos = gpermisoRedux.data.permisos.filter(data => data.idModulo === module.id)
                if (permisos.length === 1) {
                    setConfig([
                        { name: "view", traduccion: 'Ver', check: permisos[0].view },
                        { name: "read", traduccion: 'Leer', check: permisos[0].read },
                        { name: "write", traduccion: 'Guardar', check: permisos[0].write },
                        { name: "update", traduccion: 'Actualizar', check: permisos[0].update },
                        { name: "delete", traduccion: 'Eliminar', check: permisos[0].delete }
                    ])

                    setAcceso({
                        "idModulo": module.id,
                        "view": permisos[0].view,
                        "read": permisos[0].read,
                        "save": permisos[0].write,
                        "update": permisos[0].update,
                        "delete": permisos[0].delete
                    })
                }
            }
            setLoadData(false);
        }
    }, [loadData, gpermisoRedux, module]);

    useEffect(() => {
        let existe = false
        if (addPermiso) {
            const search_item_in_permisos = (item) => {
                if (permiso.length > 0) {
                    const filter = permiso.filter((data) => data.idModulo === item.id)
                    return filter.length > 0
                }
                return false
            }

            if (acceso.view || acceso.read || acceso.save || acceso.update || acceso.delete) {
                if (search_item_in_permisos(module)) {
                    existe = true
                    const nw_permisos = permiso.map((permiso) => permiso.idModulo === module.id ? acceso : { ...permiso })
                    setPermiso(nw_permisos);
                }

                if (!existe)
                    setPermiso([...permiso, acceso])

            } else {
                if (search_item_in_permisos(module)) {
                    const nw_permisos = permiso.filter((permiso) => permiso.idModulo !== module.id)
                    setPermiso(nw_permisos);
                }
            }

            setAddPermiso(false)
        }
    }, [addPermiso, acceso, permiso, setPermiso, module])

    const onHandleChange = (e, module) => {
        setAcceso({
            ...acceso,
            idModulo: module.id,
            [e.target.name]: e.target.checked
        })

        setConfig(config.map(data => data.name === e.target.name ? { ...data, check: e.target.checked } : data))
        setAddPermiso(true);
    }

    return (
        <tr>
            <td>{module.nombre}</td>
            {config.map((item, i) =>
                <CheckPermisos
                    key={i}
                    module={module}
                    descripcion={item}
                    onChange={onHandleChange}
                    value={item.check}
                />
            )}
        </tr>
    );
}

const CheckPermisos = ({ module, descripcion, value, onChange }) => {

    return (
        <td width="16%">
            <div className="custom-control custom-checkbox">
                <input
                    type="checkbox"
                    className="custom-control-input"
                    id={`${module.id}-${descripcion.name}`}
                    name={descripcion.name}
                    onChange={(e) => onChange(e, module)}
                    checked={value}
                />
                <label
                    className="custom-control-label"
                    htmlFor={`${module.id}-${descripcion.name}`}>
                    {descripcion.traduccion}
                </label>
            </div>
        </td>
    )
}

export default GrupoPermisos