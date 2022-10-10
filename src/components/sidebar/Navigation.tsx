import React from "react";
import { Link } from "react-router-dom";
import { NAV_ITEMS } from "../../constants/Nav";
import { useRouter } from "../../hooks/useRouter";

const Navigation = () => {
  const router = useRouter();
  const current_path = router.pathname;

  return (
    <section className="w-full">
      <ul className="w-full flex flex-col gap-1">
        {NAV_ITEMS.map((items: any, idx: any) => {
          return items.ishyperlink ? (
            <a href={items.link} target={"_blank"} rel="noreferrer">
              <li
                key={idx}
                className={`flex gap-8 px-5 pl-12  w-full  py-3 items-center  ${
                  !items.active && "cursor-default"
                } ${
                  current_path === items.link
                    ? "bg-bg_secondary bg-opacity-40 cursor-default rounded-xl"
                    : "hover:bg-bg_secondary hover:bg-opacity-40 cursor-pointer hover:rounded-xl"
                }`}
              >
                <img
                  src={items.image}
                  alt={items.placeholder}
                  className="object-contain w-6 h-6 "
                />
                <span className="text-primary font-semibold text-lg">
                  {items.placeholder}
                </span>
                {!items.active && (
                  <div className="-ml-3 mt-1 bg-[#4081FE] w-[100px] text-xs text-center flex items-center justify-center h-[19px] rounded">
                    <span className="text-primary font-medium">
                      Coming Soon
                    </span>
                  </div>
                )}
              </li>
            </a>
          ) : (
            <Link to={items.link}>
              <li
                key={idx}
                className={`flex gap-8 px-5 pl-12  w-full  py-3 items-center  ${
                  !items.active && "cursor-default"
                } ${
                  current_path === items.link
                    ? "bg-bg_secondary bg-opacity-40 cursor-default rounded-xl"
                    : "hover:bg-bg_secondary hover:bg-opacity-40 cursor-pointer hover:rounded-xl"
                }`}
              >
                <img
                  src={items.image}
                  alt={items.placeholder}
                  className="object-contain w-6 h-6 "
                />
                <span className="text-primary font-semibold text-lg">
                  {items.placeholder}
                </span>
                {!items.active && (
                  <div className="-ml-3 mt-1 bg-[#4081FE] w-[100px] text-xs text-center flex items-center justify-center h-[19px] rounded">
                    <span className="text-primary font-medium">
                      Coming Soon
                    </span>
                  </div>
                )}
              </li>
            </Link>
          );
        })}
        ;
      </ul>
    </section>
  );
};

export default Navigation;
