import http from "../http-common"
import axios from "axios";

let abort = axios.CancelToken.source();

const all = (page, token, paginate = true) => {
    abort = axios.CancelToken.source();
    const config = {
        headers: {Authorization: `Bearer ${token}`},
        cancelToken: abort.token
    };
    return http.get(`/security/typeModule?paginate=${paginate}&page=${page}`, config)
};

const cancel_request = () => {
    return abort;
};

const TmoduleService = {all, cancel_request};
export default TmoduleService;
