import { FiUpload } from 'react-icons/fi';

export const Header = () => {
  return (
    <header>
      <div className="header flex justify-end items-center">
        <button className="bg-blue-600 text-white px-4 py-1.5 rounded border border-solid 
        border-blue-600 flex items-center hover:bg-blue-700 transition duration-200">
          <span>
            <FiUpload />
          </span>
          <span className="ml-2">Upload</span>
        </button>
      </div>
    </header>
  );
};