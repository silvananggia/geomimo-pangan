import axios from "../api/axios";
import authHeader from "./auth-header";

const getHSInfo = (params) => {
    return axios.get(`/information/hotspot`, { 
        headers: authHeader(),
        params: params // Add filter parameters to the request
    });
};

const getLocationLookup = (query) => {
    return axios.get(`/information/location-lookup`, {
        headers: authHeader(),
        params: { query }
    });
};

const informationService = {
    getHSInfo,
    getLocationLookup,
};

export default informationService;