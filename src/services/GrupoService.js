import http from "../http-common"

const all = (page, token, paginate = true) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    return http.get(`/security/group?paginate=${paginate}&page=${page}`, config)
}

const save = (data, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    return http.post(`/security/group/`, JSON.stringify(data), config)
}

const update = (data, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    return http.patch(`/security/group/${data.id}`, JSON.stringify(data), config)
}

const destroy = (id, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    return http.delete(`/security/group/${id}`, config)
}

const permisos = (data, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    return http.post(`/security/group_permission`, JSON.stringify(data), config)
}

const GrupoService = { all, save, update, destroy, permisos }
export default GrupoService;