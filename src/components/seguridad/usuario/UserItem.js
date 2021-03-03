import React from "react"
import { useDispatch } from "react-redux";
import { changeStatusForm, dataUser, deleteUser } from "../../../redux/seguridad/userDucks";
import { styleItemCenter } from "../../../helpers/constants"

const UserItem = (props) => {
    const { user, setModal, setModalGrupo, setLoad } = props;
    const dispatch = useDispatch()

    const updateUser = user => {
        dispatch(changeStatusForm(false))//Para editar -> cambia estado de save a false
        dispatch(dataUser(user))
        setModal(true)
    }

    const grupo = () => {
        let perfil = [];
        if (user.perfil.length > 0)
            perfil = user.perfil.map(item => item.grupo.id)

        setModalGrupo({
            show: true,
            perfil,
            user
        }
        )
    }

    const destroyUser = id => {
        let response = false
        if (window.confirm(`¿Esta seguro de eliminar el usuario ${user.name}?`)) {
            (async () => {
                response = await Promise.resolve(dispatch(deleteUser(id)))
                if (response) {
                    alert("Registro eliminado con éxito!!!")
                    setLoad(true)
                }
            })();
        }

    }

    return (
        <tr>
            <td className="text-center" style={styleItemCenter.table.textMiddle}>{user.name}</td>
            <td className="text-center" style={styleItemCenter.table.textMiddle}>{user.email}</td>
            <td className="text-center" width="30%" style={styleItemCenter.table.textMiddle}>
                {user.perfil.length > 0 && user.perfil.map(perfil =>
                    <React.Fragment key={perfil.id}>
                        <span className="badge badge-primary">
                            {perfil.grupo.nombre}
                        </span>{'\u00A0'}
                    </React.Fragment>
                )}
            </td>
            <td className="text-center" width="20%">
                <button
                    className="btn btn-success m-1"
                    data-toggle="tooltip"
                    data-placement="top"
                    onClick={() => grupo()}
                >
                    <i className="fas fa-users-cog" />
                </button>
                <button className="btn btn-primary m-1"
                    onClick={() => updateUser(user)}
                >
                    <i className="fas fa-sync" />
                </button>
                <button className="btn btn-danger m-1"
                    onClick={() => destroyUser(user.id)}
                >
                    <i className="fas fa-trash" />
                </button>
            </td>
        </tr>
    );
}

export default UserItem;