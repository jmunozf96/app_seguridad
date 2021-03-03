import React, { useEffect, useState } from "react";
import { Navbar, Nav, NavDropdown, ButtonGroup, Dropdown, DropdownButton, Form } from "react-bootstrap";
import * as constants from "../../helpers/constants";
import { useDispatch, useSelector } from 'react-redux'
import { cerrarSesionAccion, grupoUserSelect } from "../../redux/seguridad/authDucks";
import { Link, withRouter } from 'react-router-dom'

const NavbarComponent = (props) => {
    const dispatch = useDispatch()
    const user = useSelector(store => store.auth.user)
    const activo = useSelector(store => store.auth.activo)
    const grupoSelect = useSelector(store => store.auth.grupoSelect)

    const [modules, setModules] = useState([]);
    const [loadModules, setLoadModules] = useState(true);

    useEffect(() => {
        if (grupoSelect && grupoSelect.access.length > 0 && loadModules) {
            setModules(grupoSelect.access)
            setLoadModules(false)
        }
    }, [loadModules, grupoSelect])

    const handleChangeGroup = (permiso) => {
        setModules([])
        dispatch(grupoUserSelect(permiso))
        setLoadModules(true)
    }

    const logout = () => {
        dispatch(cerrarSesionAccion())
    }

    return (
        <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
            <Navbar.Brand as={Link} to="/home">
                <i className="fas fa-cube" /> {constants.APP_NAME}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                {activo &&
                    <React.Fragment>
                        <Nav>
                            <Nav.Link as={Link} to="/home">Inicio</Nav.Link>
                            {modules.length > 0 &&
                                modules.map((data) =>
                                    <NavDropdown key={data.id} title={data.nombre} id="collasible-nav-dropdown">
                                        {data.modules && data.modules.map((module) =>
                                            <NavDropdown.Item key={module.id}
                                                as={Link} to={module.url}>
                                                {module.nombre}
                                            </NavDropdown.Item>
                                        )}
                                    </NavDropdown>
                                )}
                        </Nav>
                        <Nav className="ml-auto">
                            {user &&
                                <React.Fragment>
                                    {user.permisos.length > 0 && grupoSelect &&
                                        <Form inline>
                                            <DropdownButton
                                                disabled={user.permisos.length === 1}
                                                as={ButtonGroup}
                                                drop="left"
                                                title={`Grupo: ${grupoSelect.grupo.nombre}`}
                                                id="bg-vertical-dropdown-3"
                                            >
                                                {user.permisos.length > 1 && user.permisos.map((permiso) =>
                                                    <Dropdown.Item
                                                        key={permiso.grupo.id}
                                                        eventKey={permiso.grupo.id}
                                                        onClick={() => handleChangeGroup(permiso)}
                                                    >
                                                        {permiso.grupo.nombre}
                                                    </Dropdown.Item>
                                                )}
                                            </DropdownButton>
                                        </Form>}
                                    <NavDropdown title={user.name} id="collasible-nav-dropdown" drop="left">
                                        <NavDropdown.Item disabled>
                                            <i className="fas fa-user-check" /> {user.email}
                                        </NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item href="#action/3.1">Perfil</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item onClick={() => logout()} >Cerrar Sesión </NavDropdown.Item>
                                    </NavDropdown>
                                </React.Fragment>
                            }
                        </Nav>
                    </React.Fragment>
                }
            </Navbar.Collapse>
        </Navbar>
    );
}

export default withRouter(NavbarComponent);