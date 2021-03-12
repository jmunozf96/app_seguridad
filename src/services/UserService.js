import http from "../http-common"
import axios from "axios";

let abort = axios.CancelToken.source();

const all = (page, token) => {
    abort = axios.CancelToken.source();
    const config = {
        headers: {Authorization: `Bearer ${token}`},
        cancelToken: abort.token
    };
    return http.get(`/security/user?page=${page}`, config)
};

const save = (data, token) => {
    const config = {
        headers: {Authorization: `Bearer ${token}`}
    };

    return http.post(`/security/user/`, JSON.stringify(data), config)
};

const update = (data, token) => {
    const config = {
        headers: {Authorization: `Bearer ${token}`}
    };

    return http.patch(`/security/user/${data.id}`, JSON.stringify(data), config)
};

const destroy = (id, token) => {
    const config = {
        headers: {Authorization: `Bearer ${token}`}
    };

    return http.delete(`/security/user/${id}`, config)
};

const saveProfile = (data, token) => {
    const config = {
        headers: {Authorization: `Bearer ${token}`}
    };

    return http.post(`/security/user_profile`, JSON.stringify(data), config)
};

const cancel_request = () => {
    return abort;
};

const UserService = {all, save, update, destroy, saveProfile, cancel_request};
export default UserService;
