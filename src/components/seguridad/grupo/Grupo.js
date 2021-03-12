import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux";
import ModalComponent from "../../ModalComponent";
import GrupoForm from "./GrupoForm";
import GrupoList from "./GrupoList";
import GrupoPermisos from "./GrupoPermisos";
import {resetModal} from "../../../redux/seguridad/grupoDucks";
import GrupoService from "../../../services/GrupoService";
import TmoduleService from "../../../services/TmoduleService";

const Grupo = (props) => {
    const dispatch = useDispatch();
    const grupoRedux = useSelector(store => store.grupo);
    const [loadGrupos, setLoadGrupos] = useState(true);

    //Modal-Form
    const [show, setShow] = useState(false);
    //Modal-Permisos
    const [showPermisos, setShowPermisos] = useState(false);

    useEffect(() => {
        dispatch(resetModal());
        console.log(props.location.state);
        return (() => {
            setLoadGrupos(false);
            GrupoService.cancel_request().cancel("Se desmonto el componente.");
        });
    }, [dispatch, props]);

    useEffect(() => {
        if (grupoRedux.process)
            setLoadGrupos(true);
    }, [grupoRedux.process]);

    const closeActionModal = () => {
        setShow(false);
    };

    const closeActionModalPermisos = () => {
        setShowPermisos(false);
        TmoduleService.cancel_request().cancel("Se cancelan modulos para el grupo.")
    };

    const addGroup = () => {
        setShow(true)
    };

    return (
        <React.Fragment>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="#inicio">Inicio</a></li>
                    <li className="breadcrumb-item"><a href="#inicio">Seguridad</a></li>
                    <li className="breadcrumb-item active"><a href="#user">Grupo</a></li>
                </ol>
            </nav>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header p-2">
                            <h5 className="m-0"><i className="fas fa-users"/> Listado de Grupos</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-4">
                                    <div className="btn btn-primary" onClick={() => addGroup()}>
                                        <i className="fas fa-plus"/> Nuevo Grupo
                                    </div>
                                </div>
                                <div className="col-8 mb-3">
                                    <div className="row justify-content-end">
                                        <div className="col-xl-5 col-lg-6 col-md-12 col-12">
                                            <input type="text" className="form-control"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    {grupoRedux.error && grupoRedux.error['type'] === 'error_delete' &&
                                    <div className="alert alert-danger">
                                        <i className="fas fa-times"/> {grupoRedux.error['message']}
                                    </div>}
                                </div>
                                <GrupoList
                                    load={loadGrupos}
                                    setLoad={setLoadGrupos}
                                    setShowModal={setShow}
                                    setShowModalPermisos={setShowPermisos}
                                />
                                <div className="col-12">
                                    <ModalComponent
                                        icon="fas fa-users"
                                        title={`${grupoRedux.save ? 'Registrar' : 'Editar'} grupo`}
                                        show={show}
                                        handleClose={closeActionModal}
                                    >
                                        <div className="row">
                                            <div className="col-12">
                                                <GrupoForm/>
                                            </div>
                                        </div>
                                    </ModalComponent>
                                </div>
                                <div className="col-12">
                                    <ModalComponent
                                        size="lg"
                                        icon="fas fa-key"
                                        title={`Permisos - Modulos`}
                                        show={showPermisos}
                                        handleClose={closeActionModalPermisos}
                                    >
                                        <div className="row">
                                            <div className="col-12">
                                                <GrupoPermisos/>
                                            </div>
                                        </div>
                                    </ModalComponent>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Grupo;
