import http from "../http-common"

const login = (data) => {
    return http.post("/auth/login", data)
}

const logout = (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    return http.post("/auth/logout", null, config)
}

const service = { login, logout }
export default service;
