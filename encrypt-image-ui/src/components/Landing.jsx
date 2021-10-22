import _ from "lodash";
import { useSelector } from "react-redux";
import { randomString } from "../scripts/randomHelpers";


export const Landing = () => {

  const files = useSelector(state => state.files);

  return (
    <div className="body">
      <div className="flex flex-wrap h-full overflow-y-scroll">
        <div>
          <ul className="flex flex-col w-full">
            {_.map(files, file => {
              return (
                <li key={randomString(4)} className="list-item">
                  {file.name}
                </li>
              )
            })}
          </ul>
        </div>
        <div className="image-preview">

        </div>
      </div>
    </div>
  );
};