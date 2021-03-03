import http from "../http-common"

const all = (page, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    return http.get(`/security/user?page=${page}`, config)
}

const save = (data, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    return http.post(`/security/user/`, JSON.stringify(data), config)
}

const update = (data, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    return http.patch(`/security/user/${data.id}`, JSON.stringify(data), config)
}

const destroy = (id, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    return http.delete(`/security/user/${id}`, config)
}

const saveProfile = (data, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    return http.post(`/security/user_profile`, JSON.stringify(data), config)
}

const UserService = { all, save, update, destroy, saveProfile }
export default UserService;
