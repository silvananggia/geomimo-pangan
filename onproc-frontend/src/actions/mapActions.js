import { 
  ADD_WMS_LAYER,
  SET_COLLECTION,
} from "./types";


export const addWmsLayer = (layerName) => ({
  type: ADD_WMS_LAYER,
  payload: layerName,
});

export const selectCollection = (collection) => ({
  type: SET_COLLECTION,
  payload: collection,
});


