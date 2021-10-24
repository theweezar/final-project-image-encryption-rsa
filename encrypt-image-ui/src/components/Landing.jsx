import _ from "lodash";
import axios from "axios";
import configs from "../configs/configs.json";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { randomString } from "../scripts/randomHelpers";
import { setActionCheckFiles, setActionCheckAllFiles, setActionPreviewFiles } from "../scripts/redux/actions/actions";


const convertKbToMb = size => {
  return (parseInt(size, 10) / 1024 / 1024);
}

const FileItem = ({ fileObject, index }) => {

  const [checked, setChecked] = useState(fileObject.checked)
  const dispatch = useDispatch();

  const onChange = () => {
    dispatch(setActionCheckFiles(index, !checked));
    setChecked(!checked);
  }

  const onPreviewImage = () => {
    dispatch(setActionPreviewFiles(fileObject.file));
  }

  return (
    <tr className={"border-b border-gray-300 hover:bg-gray-200 " + (checked ? "bg-gray-100":"")}>
      <td className="py-2.5 text-center">
        <input type="checkbox" name="selected" id={"file_" + index}
        checked={checked ? "checked":""} onChange={onChange} />
      </td>
      <td className="cursor-pointer py-2.5" onClick={onPreviewImage}>
        {fileObject.file.name}
      </td>
      <td className="cursor-pointer text-right py-2.5 pr-4" onClick={onPreviewImage}>
        {convertKbToMb(fileObject.file.size).toFixed(2) + "MB"}
      </td>
    </tr>
  );
};

const PreviewAction = () => {
  const stateFileObjects = useSelector(state => state.files);

  var totalSize = 0;
  _.forEach(stateFileObjects, stateFileObj => {
    totalSize += convertKbToMb(stateFileObj.file.size)
  });

  const onUploadEncrypt = () => {
    const form = new FormData();
    _.forEach(stateFileObjects, stateFileObj => {
      form.append('file[]', stateFileObj.file);
    });
    axios.post(
      configs.API_HOST + '/upload_encrypt',
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*"
        }
      }
    ).then(res => {
      console.log(res);
    }).catch(error => {
      console.error(error);
    });
  };

  return (
    <div className="flex mt-4">
      <div className="preview">
        <span className="font-bold">File count: </span>
        {stateFileObjects.length}
        <span className="font-bold ml-4">Total size: </span>
        {totalSize.toFixed(2) + 'MB'}
      </div>
      <div className="ml-auto">
        <div>
          <button className="bg-gray-500 text-white px-4 py-1.5 rounded border border-solid
          border-gray-500 flex items-center hover:bg-gray-700 transition duration-200 cursor-pointer"
          onClick={onUploadEncrypt}>
            Encrypt
          </button>
        </div>
        <div>
          <button className="bg-gray-500 text-white px-4 py-1.5 rounded border border-solid mt-2
          border-gray-500 flex items-center hover:bg-gray-700 transition duration-200 cursor-pointer">
            Decrypt
          </button>
        </div>
      </div>
    </div>
  );
}

export const Landing = () => {

  const [checkedAll, setCheckedAll] = useState(false);
  const stateFileObjects = useSelector(state => state.files);
  const dispatch = useDispatch();
  // console.log(stateFileObjects);

  const onCheckAll = () => {
    setCheckedAll(!checkedAll);
    dispatch(setActionCheckAllFiles(!checkedAll));
  }

  return (
    <div className="body">
      <div>
        <h1 className="text-4xl mb-2 font-bold">Files</h1>
      </div>
      <div className="file-list flex flex-wrap h-4/6 overflow-y-auto">
        <div className="table-container">
          <table className="table-fixed w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="w-12 py-2.5">
                  <input type="checkbox" name="selected-all" id="selected-all"
                  onChange={onCheckAll} />
                </th>
                <th className="w-4/5 text-left py-2.5">File name</th>
                <th className="w-auto text-right py-2.5 pr-4">Size</th>
              </tr>
            </thead>
            <tbody>
              {_.map(stateFileObjects, (stateFileObj, index) => {
                return (
                  <FileItem key={randomString(4)} fileObject={stateFileObj} index={index} />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <PreviewAction />
    </div>
  );
};
