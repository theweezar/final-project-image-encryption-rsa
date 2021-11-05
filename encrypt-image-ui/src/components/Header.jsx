import _ from 'lodash';
import axios from "axios";
import configs from "../configs/configs.json";
import { FiUpload } from 'react-icons/fi';
import { AiOutlineDelete, AiOutlineDownload } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { setActionAddFiles, setActionDeleteCheckedFiles } from '../scripts/redux/actions/actions';
import { Navigator } from './Navigator';
import { useState } from 'react';
import { randomString } from '../scripts/randomHelpers';
import { useDetectClickOutside } from 'react-detect-click-outside';

const SelectKeyLength = () => {

  const [isDropDown, setIsDropDown] = useState(false);

  const keyLengths = [
    {length: 1024, text: "1024 bits"},
    {length: 2048, text: "2048 bits"},
    {length: 3072, text: "3072 bits"},
    {length: 4096, text: "4096 bits"},
  ]

  const ref = useDetectClickOutside({ onTriggered: () => {
    setIsDropDown(false);
  } });

  const onClickGenerateAndDownloadKeyPair = (keyLength) => {
    console.log("Select key length to generate:", keyLength);
    setIsDropDown(!isDropDown);
    axios.post(configs.API_HOST + "/getkey", null, {
      params: {
        key_length: keyLength
      },
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      responseType: "blob"
    }).then(res => {
      console.log(res);
      if (res.data) {
        var keyFileLink = document.createElement("a");
        const url = URL.createObjectURL(new Blob([res.data]));
        keyFileLink.href = url;
        keyFileLink.download = `keypair_${randomString(8)}.zip`;
        keyFileLink.click();
      }
    }).catch(error => {
      alert("error")
      console.log(error);
    });
  }

  return (
    <div className="mr-4" ref={ref}>
      <button className="bg-yellow-500 text-white px-4 py-1.5 rounded border border-solid
      border-yellow-500 flex items-center hover:bg-yellow-700 transition duration-200 cursor-pointer"
      onClick={() => setIsDropDown(!isDropDown)}>
        <span>
          <AiOutlineDownload />
        </span>
        <span className="ml-2">Generate keypair</span>
      </button>
      <div className={"relative " + (isDropDown ? "" : "hidden")}>
        <div className="absolute w-full mt-1">
          <ul className="flex flex-col list-none w-full bg-white z-30 border border-gray-500 rounded">
            {_.map(keyLengths, (keyLength) => {
              return (
                <li className="list-item" key={randomString(4)}>
                  <div className="text-center px-4 py-1.5 cursor-pointer" 
                  onClick={() => onClickGenerateAndDownloadKeyPair(keyLength.length)}>
                    {keyLength.text}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

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

  return (
    <header>
      <div className="header flex items-center">
        <Navigator />
        <div className="ml-auto flex">

          <SelectKeyLength />

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
