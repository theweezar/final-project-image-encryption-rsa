import _ from "lodash";
import axios from "axios";
import configs from "../configs/configs.json";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { randomString } from "../scripts/randomHelpers";
import { convertKbToMb, isImageFile } from "../scripts/fileHelpers";
import { setActionCheckFiles, setActionCheckAllFiles, setActionPreviewFiles, setActionUploadFilesToProcess } from "../scripts/redux/actions/actions";

const endPoint = {
  1: "/upload_encrypt",
  2: "/upload_decrypt"
};

const FileItem = ({ fileObject, index }) => {

  const [checked, setChecked] = useState(fileObject.checked)
  const dispatch = useDispatch();

  const onChange = () => {
    dispatch(setActionCheckFiles(index, !checked));
    setChecked(!checked);
  }

  const onPreviewImage = () => {
    if (fileObject.file) {
      var fileName = fileObject.file.name;
      if (isImageFile(fileName)) {
        dispatch(setActionPreviewFiles(fileObject.file));
      } else {
        alert("Only preview image file");
      }
    }
  }

  return (
    <tr className={"border-b border-gray-300 hover:bg-gray-200 " + (checked ? "bg-gray-100":"")}>
      <td className="py-2.5 text-center">
        <input type="checkbox" name="selected" id={"file_" + index}
        checked={checked ? "checked":""} onChange={onChange} />
      </td>
      <td className="cursor-pointer py-2.5 truncate" onClick={onPreviewImage}>
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
  const publicKeyFileState = useSelector(state => state.publicKeyFile);
  const privateKeyFileState = useSelector(state => state.privateKeyFile);

  const [status, setStatus] = useState({
    success: undefined,
    message: undefined
  });
  const [resultFile, setResultFile] = useState();
  const [typeDownload, setTypeDownload] = useState();
  const dispatch = useDispatch();

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
    const form = new FormData();
    
    // Validate empty images
    if (stateFileObjects.length === 0) {
      setStatusMessage(false, "File not found");
      return;
    }

    // Validate empty key
    if (endPointIndex === 1 && !publicKeyFileState) {
      setStatusMessage(false, "Public key file not found");
      return;
    } else {
      form.append("public-key", publicKeyFileState)
    }

    if (endPointIndex === 2 && !privateKeyFileState) {
      setStatusMessage(false, "Private key file not found");
      return;
    } else {
      form.append("private-key", privateKeyFileState)
    }

    // Validate uploaded file to correct crypt mode
    var conflictFile = _.find(stateFileObjects, stateFileObj => {
      return (isImageFile(stateFileObj.file.name) && endPointIndex === 2)
      || (!isImageFile(stateFileObj.file.name) && endPointIndex === 1);
    })
    if (conflictFile) {
      endPointIndex === 1 ? setStatusMessage(false, "Only encrypt image files") : setStatusMessage(false, "Only decrypt CRY files");
      return;
    }

    // This action is used to trigger the loading spinner
    dispatch(setActionUploadFilesToProcess(true));
    // Add images to form data
    _.forEach(stateFileObjects, stateFileObj => {
      if (stateFileObj.file) {
        form.append('file[]', stateFileObj.file);
      } else {
        return;
      }
    });
    
    // Call API to upload all files
    axios.post(
      configs.API_HOST + endPoint[endPointIndex],
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*"
        },
        responseType: "blob"
      }
    ).then(res => {
      // console.log(res);
      var resMessage;
      var success = true;
      if (res.data) {
        setResultFile(new Blob([res.data]));
        setTypeDownload(endPointIndex);
        resMessage = endPointIndex === 1 ? "Encrypt successfully." : "Decrypt successfully.";
      } else {
        success = false;
        resMessage = endPointIndex === 1 ? "Encrypt failed." : "Decrypt failed.";
      }
      setStatusMessage(success, resMessage);
      dispatch(setActionUploadFilesToProcess(false));
    }).catch(error => {
      console.log(error.response);
      var errorMessage = "An error has occurred in the server.";
      // Blob of JSON
      if (error.response) {
        if (error.response.data instanceof Blob) {
          errorMessage = error.response.data;
          const parseErrorMessage = async () => {
            var errorResponse = JSON.parse(await error.response.data.text());
            if (errorResponse.message) {
              setStatusMessage(false, errorResponse.message);
            } else {
              setStatusMessage(false, errorMessage);
            }
          }
          parseErrorMessage();
        } else {
          setStatusMessage(false, errorMessage);
        }
      } else {
        setStatusMessage(false, errorMessage);
      }
      
      dispatch(setActionUploadFilesToProcess(false));
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
          border-gray-500 flex items-center active:bg-gray-700 cursor-pointer"
          onClick={() => onUpload(1)}>
            Encrypt
          </button>
        </div>
        <div>
          <button className="bg-gray-500 text-white px-4 py-1.5 rounded border border-solid mt-2
          border-gray-500 flex items-center active:bg-gray-700 cursor-pointer"
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
                  {/* <div onClick={onCheckAll}
                  className={"w-4 h-4 border border-black flex items-center justify-center cursor-pointer mx-auto " + (checkedAll ? 'bg-blue-700':'')}>
                    <BiCheck className={checkedAll ? 'text-white':'text-transparent'} />
                  </div> */}
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
