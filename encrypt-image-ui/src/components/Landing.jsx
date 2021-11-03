import _ from "lodash";
import axios from "axios";
import configs from "../configs/configs.json";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { randomString } from "../scripts/randomHelpers";
import { setActionCheckFiles, setActionCheckAllFiles, setActionPreviewFiles } from "../scripts/redux/actions/actions";

const endPoint = {
  1: "/upload_encrypt",
  2: "/upload_decrypt"
};

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
  const [status, setStatus] = useState({
    success: undefined,
    message: undefined
  });
  const [resultFile, setResultFile] = useState();
  const [typeDownload, setTypeDownload] = useState();

  var totalSize = 0;
  _.forEach(stateFileObjects, stateFileObj => {
    totalSize += convertKbToMb(stateFileObj.file.size)
  });

  const setStatusMessage = (success, message) => {
    setStatus({
      success: success,
      message: message
    });
  }

  const onUpload = (endPointIndex) => {
    setStatusMessage(false, "")
    setResultFile(null)
    if (stateFileObjects.length === 0) {
      setStatusMessage(false, "File not found")
      return;
    }
    const form = new FormData();
    _.forEach(stateFileObjects, stateFileObj => {
      form.append('file[]', stateFileObj.file);
    });
    // Validate files
    // Call API to upload all files
    axios.post(
      configs.API_HOST + endPoint[endPointIndex],
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*"
        }
      }
    ).then(res => {
      console.log(res);
      var resMessage;
      var success = true;
      if (res.data) {
        setResultFile(new Blob([res.data]));
        setTypeDownload(endPointIndex);
        resMessage = endPointIndex === 1 ? "Encrypt successfully" : "Decrypt successfully";
      } else {
        success = false;
        resMessage = endPointIndex === 1 ? "Encrypt failed" : "Decrypt failed";
      }
      setStatusMessage(success, resMessage);
    }).catch(error => {
      var errorMessage = "An error has occurred in the server";
      if (error.response) {
        errorMessage = error.response.data
      }
      setStatusMessage(false, errorMessage);
    });
  };

  const onDownloadResultFile = () => {
    console.log(resultFile)
    const url = URL.createObjectURL(resultFile);
    const a = document.createElement("a");
    a.href = url;
    if (typeDownload === 1) {
      a.download = `encrypted_packet_${randomString(8)}.cry`
    } else if (typeDownload === 2) {
      a.download = `image_packet_${randomString(8)}.zip`
    }
    a.click();
  }

  return (
    <div className="flex mt-4">
      <div className="preview">
        <div>
          <span className="font-bold">File count: </span>
          {stateFileObjects.length}
          <span className="font-bold ml-4">Total size: </span>
          {totalSize.toFixed(2) + 'MB'}
        </div>
        <div className="flex items-center mt-2 text-xl font-bold">
          <span className={status.success ? "text-green-500":"text-red-600"}>
            {status.message}
          </span>
          <span onClick={onDownloadResultFile}
          className={"cursor-pointer ml-2 underline text-blue-700 " + (resultFile ? "":"hidden")}>
            Click here to download file
          </span>
        </div>
      </div>
      <div className="ml-auto">
        <div>
          <button className="bg-gray-500 text-white px-4 py-1.5 rounded border border-solid
          border-gray-500 flex items-center hover:bg-gray-700 transition duration-200 cursor-pointer"
          onClick={() => onUpload(1)}>
            Encrypt
          </button>
        </div>
        <div>
          <button className="bg-gray-500 text-white px-4 py-1.5 rounded border border-solid mt-2
          border-gray-500 flex items-center hover:bg-gray-700 transition duration-200 cursor-pointer"
          onClick={() => onUpload(2)}>
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
