import { FiUpload } from 'react-icons/fi';
import { Navigator } from './Navigator';

export const Header = () => {

  const onUploadImage = () => {

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
          onChange={onUploadImage} />
        </div>
      </div>
    </header>
  );
};