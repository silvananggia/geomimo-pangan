import {
  GET_HOTSPOT_INFO,
  GET_LOCATION_LOOKUP,
} from "../actions/types";

const initialState = {
  hotspotInfo: null,
  locationLookup: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_HOTSPOT_INFO:
      return {
        ...state,
        hotspotInfo: action.payload,
      };
    case GET_LOCATION_LOOKUP:
      return {
        ...state,
        locationLookup: action.payload,
      };
    default:
      return state;
  }
} 