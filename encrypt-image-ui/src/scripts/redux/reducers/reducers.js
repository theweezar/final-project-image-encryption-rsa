import { combineReducers } from "redux";
import _ from "lodash";

const filesReducer = (state = [], action) => {
  var fileList = action.type;
  state = _.isArray(fileList) && !_.isEmpty(fileList) ? state.concat(fileList) : state;
  return state;
}

export const allReducers = combineReducers({
  files: filesReducer
});

