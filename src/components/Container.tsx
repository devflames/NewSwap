import React from "react";
import Header from "./header";
import SideBar from "./sidebar";
import background from "../assets/background.svg";

const Container = ({ children }: { children: any }) => {
  return (
    <section
      className="relative w-full min-h-screen flex items-start bg-repeat bg-[#eff3fc] font-primary"
      style={{ backgroundImage: `url(${background})` }}
    >
      <SideBar />
      <main className=" relative flex flex-col items-start justify-start pt-10 flex-1 font-primary ml-[320px]">
        <Header />
        {children}
      </main>
    </section>
  );
};

export default Container;
