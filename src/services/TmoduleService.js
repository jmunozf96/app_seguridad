import http from "../http-common"

const all = (page, token, paginate = true) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    return http.get(`/security/typeModule?paginate=${paginate}&page=${page}`, config)
}


const TmoduleService = { all }
export default TmoduleService;