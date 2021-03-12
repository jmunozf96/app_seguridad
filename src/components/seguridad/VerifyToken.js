import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import jwt from "jsonwebtoken"
import { cerrarSesionAccion } from "../../redux/seguridad/authDucks";

const VerifyToken = ({ children }) => {
    const dispatch = useDispatch();
    const [loadingComponent, setLoadingComponent] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('_token')) {
            const _token = JSON.parse(localStorage.getItem('_token'));
            const decode_token = jwt.decode(_token, { complete: true });
            let dateNow = new Date();

            if (decode_token.payload.exp > (dateNow.getTime() / 1000)) {
                setLoadingComponent(true);
                return;
            }
        }

        (async () => {
            const response = dispatch(cerrarSesionAccion());
            await response.catch(error => {
                console.log(error);
                setLoadingComponent(true);
            })
        })();

    }, [dispatch]);

    if (!loadingComponent) {
        return (
            <div className="row">
                <div className="col-12 text-center mt-5">
                    <div className="spinner-grow text-primary" role="status" />
                </div>
            </div>
        )
    } else {
        return children
    }

};

export default VerifyToken
