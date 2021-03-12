import React from "react";

const InputFieldComponent = (props) => {
    const {label, name, type = "text", value, icon, eventChange, required = true, error, readOnly = false} = props;

    const validate_error_field = (field) => {
        return error !== null && error.type === 'VALIDATION' && error.message[field] &&
            <small className="text-danger">{error.message[field]}</small>
    };

    return (
        <div className="form-group">
            <label>{label}</label>
            <div className="input-group">
                <div className="input-group-prepend">
                    <div className="input-group-text">
                        <i className={icon}/>
                    </div>
                </div>
                <input name={name} value={value} onChange={e => eventChange(e)}
                       type={type} className="form-control" required={required} readOnly={readOnly}/>
            </div>
            {validate_error_field(name)}
        </div>
    );
};

export default InputFieldComponent;
