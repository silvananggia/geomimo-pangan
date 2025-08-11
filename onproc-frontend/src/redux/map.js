import {
  ADD_WMS_LAYER,
  SET_COLLECTION
} from "../actions/types";

const initialstate = {
  loading: true,
  maplist: [],
  mapobj: {},
  errmessage: "",
  collection: []
};

function mapReducer(map = initialstate, action) {
  const { type, payload } = action;

  switch (type) {

    case ADD_WMS_LAYER:
      return {
          ...map,
          wmsLayer: action.payload, // Store the WMS layer name
      };
      
    case SET_COLLECTION:
      return {
        ...map,
        collection: action.payload, // Update the collection in the state
      };

    default:
      return map;
  }
}

export default mapReducer;
