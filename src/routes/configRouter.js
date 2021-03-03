import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { routes } from "../routes/listRouter";
import { useSelector } from 'react-redux'

import Login from "../components/seguridad/Login";
import VerifyToken from "../components/seguridad/VerifyToken";

const ConfigRouter = () => {
    let auth = useSelector(store => store.auth.activo)
    return (
        <div className="container-fluid" style={{ marginTop: "1rem" }}>
            <Switch>
                <Route path='/login' component={Login} />
                {routes.map((route, i) => (
                    <PrivateRoute
                        key={i}
                        path={route.path}
                        exact={true}
                        route={route}
                        auth={auth}
                    />
                ))}
            </Switch>
        </div>
    );
}

const PrivateRoute = ({ component: Component, auth, route, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) => auth === true
                ? <VerifyToken><route.component {...props} routes={route.routes} /></VerifyToken>
                : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
        />
    )
}

export default ConfigRouter;