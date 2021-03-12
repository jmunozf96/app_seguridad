import React from "react"
import { useDispatch } from "react-redux";
import { changeStatusForm, dataGrupo, deleteGrupo } from "../../../redux/seguridad/grupoDucks";
import { dataGPermiso, reset } from "../../../redux/seguridad/grupoPermisoDucks";
import { styleItemCenter } from "../../../helpers/constants"

const GrupoItem = (props) => {
    const { grupo, setModal, setModalPermisos, setLoad } = props;
    const dispatch = useDispatch();

    const updateGrupo = grupo => {
        dispatch(changeStatusForm(false))//Para editar -> cambia estado de save a false
        dispatch(dataGrupo(grupo));
        setModal(true)
    };

    const permisosGrupo = _ => {
        dispatch(reset());
        dispatch(dataGPermiso({
            idGrupo: grupo.id, //Se obtiene el id del grupo
            permisos: grupo.permisos
        }));
        setModalPermisos(true)
    };

    const destroyGrupo = id => {
        let response = false;
        if (window.confirm(`¿Esta seguro de eliminar el usuario ${grupo.nombre}?`)) {
            (async () => {
                response = await Promise.resolve(dispatch(deleteGrupo(id)));
                if (response) {
                    alert("Registro eliminado con éxito!!!");
                    setLoad(true)
                }
            })();
        }

    };

    return (
        <tr>
            <td className="text-center" style={styleItemCenter.table.textMiddle}><b>{grupo.nombre}</b></td>
            <td className="text-center" style={styleItemCenter.table.textMiddle} width="5%">
                <button className="btn btn-success"
                    onClick={() => permisosGrupo()}
                >
                    <i className="fas fa-shield-alt" />
                </button>
            </td>
            <td style={styleItemCenter.table.textMiddle}>{'\u00A0'}{grupo.descripcion}</td>
            <td className="text-center" width="15%">
                <button className="btn btn-primary m-1"
                    onClick={() => updateGrupo(grupo)}
                >
                    <i className="fas fa-sync" />
                </button>
                <button className="btn btn-danger m-1"
                    onClick={() => destroyGrupo(grupo.id)}
                >
                    <i className="fas fa-trash" />
                </button>
            </td>
        </tr>
    );
}

export default GrupoItem;
