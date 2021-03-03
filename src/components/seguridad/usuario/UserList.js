import React, { memo, useCallback, useEffect, useState } from "react"

import UserService from "../../../services/UserService";
import { useSelector } from "react-redux";
import TableComponent from "../../TableComponent";
import UserItem from "./UserItem";
import ModalComponent from "../../ModalComponent";

import UserGrupos from "./UserGrupos";


const UserList = memo(({ load, setLoad, setShowModal }) => {
    const auth = useSelector(store => store.auth.user)

    const [page, setPage] = useState(1);
    const [users, setUsers] = useState(null);

    //Modal-Grupo
    const [showGrupo, setShowGrupo] = useState({
        show: false,
        user: null,
        perfil: []
    })

    const closeActionModalGrupo = () => {
        setShowGrupo({ show: false, user: null, perfil: [] });
        setLoad(true);
    }

    const listar = useCallback((page) => {
        (async => {
            UserService.all(page, auth._token)
                .then(response => {
                    const { data } = response
                    setUsers(data.response);
                }).catch(error => {
                    console.log(error);
                })
        })();
    }, [auth])

    useEffect(() => {
        if (load) {
            listar(page);
            setLoad(false);
        }
    }, [listar, page, load, setLoad]);

    const changePage = (e, page) => {
        setPage(page);
        setLoad(true);
    }

    return (
        <React.Fragment>
            <TableComponent
                cols={['Usuario', 'Correo', 'Grupo', 'Accion']}
                paginate={!!users}
                last_page={users && users.last_page}
                changePage={changePage}
            >
                {users && users.data.length > 0 && users.data.map((user, i) =>
                    <UserItem
                        key={i}
                        user={user}
                        setModal={setShowModal}
                        setModalGrupo={setShowGrupo}
                        setLoad={setLoad}
                    />
                )}
            </TableComponent>
            <div className="col-12">
                <ModalComponent
                    icon="fas fa-users"
                    title={`Perfil de Usuario`}
                    show={showGrupo.show}
                    handleClose={closeActionModalGrupo}
                >
                    <UserGrupos user={showGrupo.user} perfil={showGrupo.perfil} />
                </ModalComponent>
            </div>
        </React.Fragment>
    )
})

export default UserList