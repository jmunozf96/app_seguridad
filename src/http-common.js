import axios from "axios";
import * as constants from "./helpers/constants";

export default axios.create({
    baseURL: `${constants.API_SERVER}`,
    headers: {
        "Content-type": "application/json"
    }
});
