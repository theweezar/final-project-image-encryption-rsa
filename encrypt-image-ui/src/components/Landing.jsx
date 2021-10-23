import _ from "lodash";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { randomString } from "../scripts/randomHelpers";
import { setActionCheckFiles, setActionCheckAllFiles } from "../scripts/redux/actions/actions";

const convertKbToMb = size => {
  return (parseInt(size, 10) / 1024 / 1024).toFixed(2);
}

const FileItem = ({ fileObject, index }) => {

  const [checked, setChecked] = useState(fileObject.checked)
  const dispatch = useDispatch();

  const onChange = () => {
    dispatch(setActionCheckFiles(index, !checked));
    setChecked(!checked);
  }

  return (
    <tr className={"border-b border-gray-300 hover:bg-gray-200 " + (checked ? "bg-gray-100":"")}>
      <td className="py-2.5 text-center">
        <input type="checkbox" name="selected" id={"file_" + index}
        checked={checked ? "checked":""} onChange={onChange} />
      </td>
      <td className="cursor-pointer py-2.5">
        {fileObject.file.name}
      </td>
      <td className="text-center py-2.5">
        {convertKbToMb(fileObject.file.size) + "MB"}
      </td>
    </tr>
  );
};

export const Landing = () => {

  const [checkedAll, setCheckedAll] = useState(false);
  const stateFileObjects = useSelector(state => state.files);
  const dispatch = useDispatch();
  console.log(stateFileObjects);

  const onCheckAll = () => {
    setCheckedAll(!checkedAll);
    dispatch(setActionCheckAllFiles(!checkedAll));
  }

  return (
    <div className="body">
      <div className="file-list flex flex-wrap h-full overflow-y-auto">
        <div className="table-container">
          <table className="table-fixed w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="w-12 py-2.5">
                  <input type="checkbox" name="selected-all" id="selected-all"
                  onChange={onCheckAll} />
                </th>
                <th className="w-4/5 text-left py-2.5">File name</th>
                <th className="w-auto py-2.5">Size</th>
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
        <div className="image-preview">

        </div>
      </div>
    </div>
  );
};
