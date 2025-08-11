import {
  GET_HOTSPOT_INFO,
  GET_LOCATION_LOOKUP,
} from "../actions/types";

const initialstate = {
  loading: true,
  hotspotInfo: null,
  locationLookup: [],
  errmessage: "",
};

function informationReducer(information = initialstate, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_HOTSPOT_INFO:
      return {
        ...information,
        loading: false,
        errmessage: "",
        hotspotInfo: payload,
      };

    case GET_LOCATION_LOOKUP:
      return {
        ...information,
        locationLookup: payload,
      };

    default:
      return information;
  }
}

export default informationReducer;
