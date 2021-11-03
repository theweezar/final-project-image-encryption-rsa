import _ from 'lodash';
import { FiUpload } from 'react-icons/fi';
import { AiOutlineDelete } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { setActionAddFiles, setActionDeleteCheckedFiles } from '../scripts/redux/actions/actions';
import { Navigator } from './Navigator';

export const Header = () => {

  const dispatch = useDispatch();
  const stateFileObjects = useSelector(state => state.files);

  const onUploadImage = (e) => {
    var uploadedFiles = [...e.target.files];
    var uploadedFilesObjectArray = [];
    // Loop through to check if there is a duplicate image in the array
    _.forEach(uploadedFiles, uploadedFile => {
      var found = _.find(stateFileObjects, stateFileObj => {
        return stateFileObj.file.name === uploadedFile.name
      });
      if (!found) {
        // Push a image object into array
        uploadedFilesObjectArray.push({
          file: uploadedFile,
          checked: false
        });
      }
    });
    if (uploadedFiles.length !== uploadedFilesObjectArray.length) {
      alert('Duplicate images');
    }
    e.target.value = "";
    dispatch(setActionAddFiles(uploadedFilesObjectArray));
  };

  const onDeleteCheckedImage = () => {
    dispatch(setActionDeleteCheckedFiles());
  }

  // const onDownloadCheckedFile = () => {

  // }

  return (
    <header>
      <div className="header flex items-center">
        <Navigator />
        <div className="ml-auto flex">

          {/* <button className="bg-green-500 text-white px-4 py-1.5 rounded border border-solid mr-4
          border-green-500 flex items-center hover:bg-green-700 transition duration-200 cursor-pointer"
          onClick={onDownloadCheckedFile}>
            <span>
              <AiOutlineDelete />
            </span>
            <span className="ml-2">Download</span>
          </button> */}

          <button className="bg-red-500 text-white px-4 py-1.5 rounded border border-solid mr-4
          border-red-500 flex items-center hover:bg-red-700 transition duration-200 cursor-pointer"
          onClick={onDeleteCheckedImage}>
            <span>
              <AiOutlineDelete />
            </span>
            <span className="ml-2">Delete</span>
          </button>

          <label htmlFor="upload-images"
          className="bg-blue-600 text-white px-4 py-1.5 rounded border border-solid 
          border-blue-600 flex items-center hover:bg-blue-700 transition duration-200 cursor-pointer">
            <span>
              <FiUpload />
            </span>
            <span className="ml-2">Upload</span>
          </label>

          <input type="file" name="upload-images" id="upload-images" className="hidden"
          accept="image/png, image/jpg, image/jpeg, image/gif, .cry" 
          multiple="multiple" onChange={onUploadImage} />
        </div>
      </div>
    </header>
  );
};