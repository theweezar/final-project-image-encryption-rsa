import _ from "lodash";
import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { BsKey } from "react-icons/bs";
import { randomString } from "../scripts/randomHelpers";
import { useState } from "react";

export const Navigator = () => {
  const [selected, setSelected] = useState(0);

  const links = [
    {to: "/", icon: <AiOutlineHome />, text: "Landing"},
    {to: "/keypair", icon: <BsKey />, text: "Keys"},
  ];

  const f =_.find(links, (link, index) => {
    return link.to === window.location.pathname;
  });

  console.log(f);

  return (
    <div className="navigator h-full">
      <div className="w-full h-4/5 p-4 shadow rounded-lg">
        <ul className="flex flex-col">
          {_.map(links, (link, index) => {
            return (
              <li className="list-item" key={randomString(4)}>
                <Link to={link.to} onClick={() => setSelected(index)}
                className={"py-1.5 px-3.5 text-blue-600 flex items-center text-base rounded-lg " + 
                (selected === index ? "bg-blue-50" : "")}>
                  <span>
                    {link.icon}
                  </span>
                  <span className="ml-3.5">
                    {link.text}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  );
};