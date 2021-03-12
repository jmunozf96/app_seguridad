import React from "react"
import { Modal } from "react-bootstrap";

const ModalComponent = (props) => {
    const { icon, title, show, handleClose, size = "md", children } = props

    return (
        <Modal
            size={size}
            show={show}
            onHide={handleClose}
            backdrop="static"
        >
            <div>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className={icon} /> {title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {children}
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => handleClose()}>
                        Cerrar
                    </button>
                </Modal.Footer>
            </div>
        </Modal>
    );
};

export default ModalComponent;
