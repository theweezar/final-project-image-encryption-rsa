import _ from "lodash";
import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { BsKey } from "react-icons/bs";
import { randomString } from "../scripts/randomHelpers";
import { useState } from "react";

export const Navigator = () => {
  const [pathname, setPathname] = useState(window.location.pathname);

  const links = [
    {pathname: "/", icon: <AiOutlineHome />, text: "Landing"},
    {pathname: "/keypair", icon: <BsKey />, text: "Keys"}
  ];

  return (
    <div>
      <ul className="flex flex-row">
        {_.map(links, (link) => {
          return (
            <li className="list-item" key={randomString(4)}>
              <Link to={link.pathname} onClick={() => setPathname(link.pathname)}
              className={"flex items-center justify-center w-36 py-2 " + (pathname === link.pathname ? "border-b-4 border-black":"")}>
                <span>{link.icon}</span>
                <span className="pl-2">{link.text}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};