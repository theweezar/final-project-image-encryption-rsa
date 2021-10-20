import { Navigator } from "./Navigator";
import { Main } from "./Main";

export const Landing = () => {
  return (
    <div className="body">
      <div className="flex flex-row h-full">
        <Navigator />
        <Main />
      </div>
    </div>
  );
};