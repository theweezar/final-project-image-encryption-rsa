export function setActionTypeDefault(currentState) {
  return {
    type: currentState
  };
}

/**
 * Set action to add file to store
 * @param {Array} files Files array
 * @returns {Object} Type Object
 */
export const setActionAddFiles = files => {
  return {
    type: {
      addFile: true,
      files: files
    }
  };
};

/**
 * Set action to check or uncheck a file in store
 * @param {any} index File's index to check or uncheck
 * @param {boolean} checked Check or uncheck
 * @returns {Object} Type Object
 */
export const setActionCheckFiles = (index, checked) => {
  return {
    type: {
      checkFile: true,
      index: index,
      checked: checked
    }
  };
};

/**
 * Set action to check or uncheck all files
 * @param {boolean} checked Check or uncheck
 * @returns {Object} Type Object
 */
export const setActionCheckAllFiles = (checked) => {
  return {
    type: {
      checkFile: true,
      checkAll: true,
      checked: checked
    }
  };
};
