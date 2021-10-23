import { combineReducers } from "redux";
import _ from "lodash";

const filesReducer = (state = [], action) => {
  var type = action.type;

  if (type.addFile) {
    var files = type.files;
    state = _.isArray(files) && !_.isEmpty(files) ? state.concat(files) : state;
  } else if (type.checkFile) {
    if (type.checkAll) {
      _.forEach(state, stateFileObj => {
        stateFileObj.checked = type.checked;
      });
    } else {
      var index = type.index;
      state[index].checked = type.checked;
    }
  }
  
  return state;
}

export const allReducers = combineReducers({
  files: filesReducer
});

