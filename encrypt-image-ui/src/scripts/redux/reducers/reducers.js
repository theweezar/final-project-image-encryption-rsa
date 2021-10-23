import { combineReducers } from "redux";
import _ from "lodash";

/**
 * File reducer
 * @param {Array} state State of file array
 * @param {Object} action Action type to determine what action to the state
 * @returns New state
 */
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
  } else if (type.deleteFiles) {
    state = _.filter(state, stateFileObj => {
      return !stateFileObj.checked;
    })
  }
  
  return state;
};

/**
 * Image preview reducer
 * @param {File} state State of current preview file
 * @param {*} action Action to preview file
 * @returns New state
 */
const previewImageReducer = (state = null, action) => {
  var type = action.type;
  state = (type && type.preview && type.image) ? type.image : null;
  return state;
}

export const allReducers = combineReducers({
  files: filesReducer,
  previewImage: previewImageReducer
});
