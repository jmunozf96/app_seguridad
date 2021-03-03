import React, { useState } from "react";
import UsersList from "./UserList";
import UserForm from "./UserForm";
import ModalComponent from "../../ModalComponent";
import { useSelector } from "react-redux";

const User = () => {
    const userRedux = useSelector(store => store.user)
    const [loadUsers, setLoadUsers] = useState(true)

    //Modal
    const [show, setShow] = useState(false);
    

    const closeActionModal = () => {
        setShow(false);

        if (userRedux.process)
            setLoadUsers(true);
    }

    const addUser = () => {
        setShow(true)
    }

    return (
        <React.Fragment>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="#inicio">Inicio</a></li>
                    <li className="breadcrumb-item"><a href="#inicio">Seguridad</a></li>
                    <li className="breadcrumb-item active"><a href="#user">Usuario</a></li>
                </ol>
            </nav>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header p-2">
                            <h5 className="m-0"><i className="fas fa-users" /> Listado de usuarios</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-4">
                                    <div className="btn btn-primary" onClick={() => addUser()}>
                                        <i className="fas fa-plus" /> Nuevo Usuario
                                </div>
                                </div>
                                <div className="col-8 mb-3">
                                    <div className="row justify-content-end">
                                        <div className="col-xl-5 col-lg-6 col-md-12 col-12">
                                            <input type="text" className="form-control" />
                                        </div>
                                    </div>
                                </div>
                                <UsersList
                                    load={loadUsers}
                                    setLoad={setLoadUsers}
                                    setShowModal={setShow}
                                />
                                <div className="col-12">
                                    <ModalComponent
                                        icon="fas fa-users"
                                        title={`${userRedux.save ? 'Registrar' : 'Editar'} usuario`}
                                        show={show}
                                        handleClose={closeActionModal}
                                    >
                                        <div className="row">
                                            <div className="col-12">
                                                <UserForm />
                                            </div>
                                        </div>
                                    </ModalComponent>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </React.Fragment>
    );
}

export default User