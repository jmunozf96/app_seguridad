import React, {useEffect, useState} from "react";
import $ from "jquery"
import GrupoService from "../../../services/GrupoService";
import {useSelector} from "react-redux";
import UserService from "../../../services/UserService";

const UserGrupos = ({user, perfil}) => {
    const auth = useSelector(store => store.auth.user);

    const [grupos, setGrupos] = useState([]);
    const [selectGrupos, setSelectGrupos] = useState(perfil);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);

    useEffect(() => {
        (async => {
            GrupoService.all(0, auth._token, false)
                .then(response => {
                    const {data} = response;
                    setGrupos(data.response);
                    $('#add_tag').selectpicker()
                }).catch(error => {
                console.log(error);
            })
        })();
    }, [auth]);

    const onHandleChange = (e) => {
        let value = Array.from(e.target.selectedOptions, option => option.value);
        setSelectGrupos(value)
    };

    const savePerfil = () => {
        setResponse(null);
        const data = {
            idUsuario: user.id,
            grupos: selectGrupos.map(grupo => {
                return {idGrupo: grupo}
            })
        };

        setLoading(true);
        (async () => {
            await UserService.saveProfile(data, auth._token)
                .then(response => {
                    const {data} = response;
                    setResponse(data);
                    setLoading(false);
                }).catch(error => {
                    console.log(error);
                })
        })();
    };

    if(grupos.length === 0){
        return(
            <div className="text-center mt-5 mb-5">
                <i className="fas fa-spinner fa-pulse fa-5x"/>
            </div>
        )
    }


    return (
        <React.Fragment>
            {grupos.length > 0 &&
            <div className="row">
                <div className="col-12">
                    {response && response.type === "success" &&
                    <div className="alert alert-success">
                        <i className="fas fa-check-circle"/> {response.message}
                    </div>
                    }
                </div>
                <div className="col-12">
                    <h5>Preferencias de configuración</h5>
                    <hr/>
                    <p className="text-center">
                        <i className="fas fa-users fa-10x"/>
                    </p>
                    <p>
                        Cuando la persona inicia una sesión en un sistema con su perfil de usuario, se
                        cargan los modulos ya establecidos.
                    </p>
                    <hr/>
                </div>
                <div className="col-12">
                    <select
                        id="add_tag"
                        className="form-control"
                        title="Seleccione el grupo de usuario..."
                        multiple
                        value={selectGrupos}
                        onChange={(e) => onHandleChange(e)}
                    >
                        {grupos.map(grupo =>
                            <option
                                key={grupo.id}
                                value={grupo.id}
                                data-subtext={grupo.descripcion}
                            >{grupo.nombre}</option>
                        )}
                    </select>
                </div>
                <div className="col-12">
                    <hr/>
                    <button
                        className="btn btn-success"
                        onClick={() => savePerfil()}
                        disabled={loading}
                    >
                        {loading ? <i className="fas fa-spinner fa-pulse"/> : <i className="fas fa-save"/>}
                        {" "}Guardar
                    </button>
                </div>
            </div>

            }
        </React.Fragment>
    )
}

export default UserGrupos
