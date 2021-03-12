import React, { memo, useCallback, useEffect, useState } from "react"

import GrupoService from "../../../services/GrupoService";
import { useSelector } from "react-redux";
import TableComponent from "../../TableComponent";
import GrupoItem from "./GrupoItem";


const GrupoList = memo(({ load, setLoad, setShowModal, setShowModalPermisos }) => {
    const auth = useSelector(store => store.auth.user);
    const gpermisoRedux = useSelector(store => store.gpermiso);

    const [page, setPage] = useState(1);
    const [grupos, setGrupos] = useState(null);

    const listar = useCallback((page) => {
        (async => {
            GrupoService.all(page, auth._token)
                .then(response => {
                    const { data } = response;
                    setGrupos(data.response);
                }).catch(error => {
                    console.log(error);
                })
        })();
    }, [auth]);

    useEffect(() => {
        if (load) {
            listar(page);
            setLoad(false);
        }
    }, [listar, page, load, setLoad]);

    useEffect(() => {
        if (gpermisoRedux.process) {
            setLoad(true);
        }
    }, [gpermisoRedux, setLoad]);

    const changePage = (e, page) => {
        setPage(page);
        setLoad(true);
    };

    return (
        <TableComponent
            cols={['Nombre', 'Acceso', 'Descripcion', 'Accion']}
            paginate={!!grupos}
            last_page={grupos && grupos.last_page}
            changePage={changePage}
        >
            {grupos && grupos.data.length > 0 && grupos.data.map((grupo, i) =>
                <GrupoItem
                    key={i}
                    grupo={grupo}
                    setModal={setShowModal}
                    setModalPermisos={setShowModalPermisos}
                    setLoad={setLoad}
                />
            )}
        </TableComponent>
    )
});

export default GrupoList
