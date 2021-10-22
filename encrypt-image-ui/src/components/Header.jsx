import _ from 'lodash';
import { FiUpload } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { setActionTypeDefault } from '../scripts/redux/actions/actions';
import { Navigator } from './Navigator';

export const Header = () => {

  const dispatch = useDispatch();
  const stateFiles = useSelector(state => state.files);

  const onUploadImage = (e) => {
    var uploadedfiles = [...e.target.files];
    _.forEach(uploadedfiles, uploadedFile => {
      var found = _.find(stateFiles, stateFile => {
        return stateFile.name === uploadedFile.name
      });
      if (found) {
        alert('Duplicate image');
      }
    });
    dispatch(setActionTypeDefault(uploadedfiles));
  };

  return (
    <header>
      <div className="header flex items-center">
        <Navigator />
        <div className="ml-auto">
          <label htmlFor="upload-images"
          className="bg-blue-600 text-white px-4 py-1.5 rounded border border-solid 
          border-blue-600 flex items-center hover:bg-blue-700 transition duration-200 cursor-pointer">
            <span>
              <FiUpload />
            </span>
            <span className="ml-2">Upload</span>
          </label>
          <input type="file" name="upload-images" id="upload-images" className="hidden"
          accept="image/png, image/jpg, image/jpeg, image/gif, .crypt" 
          multiple="multiple" onChange={onUploadImage} />
        </div>
      </div>
    </header>
  );
};