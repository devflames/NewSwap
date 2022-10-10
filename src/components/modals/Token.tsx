import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import close from "../../assets/cross.svg";
import { AiFillCheckCircle } from "react-icons/ai";
import { TOKENS } from "../../constants/Tokens";

const TokenModal = ({
  modal,
  toggleModal,
  valueMap,
  setter,
  value,
  meta,
}: {
  modal: boolean;
  toggleModal: any;
  valueMap: any;
  setter: any;
  value: any;
  meta: any;
}) => {
  const handle_click = (new_value: any) => {
    if (new_value === meta.value1 || new_value === meta.value2) {
      const val1 = meta.value1;
      const val2 = meta.value2;
      meta.setter1(val2);
      meta.setter2(val1);
    } else {
      setter(new_value);
    }
    toggleModal(!modal);
  };

  const [filteredArr, setFilteredArr] = useState([]);

  const filterTokens = (e: any) => {
    const foundTokens = TOKENS.filter(
      (token) =>
        token.symbol.includes(e.target.value.toUpperCase()) ||
        token.address.includes(e.target.value)
    );
    if (foundTokens.length > 0) setFilteredArr(foundTokens);
    else {
    }
  };

  return (
    <Transition appear show={modal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
        onClose={() => toggleModal(!modal)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-in"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-out"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto font-primary">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-in"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-out"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="min-w-[500px] pb-3 transform  bg-primary rounded-3xl transition-all">
                <Dialog.Title
                  as="div"
                  className="w-full flex items-center justify-between px-6 pt-5 pb-2"
                >
                  <h3 className="font-bold text-lg text-secondary">
                    Select a Token
                  </h3>
                  <button
                    type="button"
                    className="text-secondary"
                    onClick={() => toggleModal(!modal)}
                  >
                    <img
                      src={close}
                      alt="close"
                      height={15}
                      width={15}
                      className="cursor-pointer outline-none focus:outline-none border-none"
                    />
                  </button>
                </Dialog.Title>
                <section className="py-2 flex flex-col items-start gap-4 w-full">
                  <section className="w-full px-6">
                    <input
                      type="text"
                      placeholder="Search name or paste address"
                      className="text-secondary text-opacity-60 px-5 py-3 rounded-xl border w-full"
                      onChange={filterTokens}
                    />
                  </section>
                  <span className="text-gray-400 text-sm px-6">Token Name</span>
                  <section className="flex flex-col gap-2 w-full items-start overflow-scroll h-[400px] overflow-x-hidden px-6">
                    {filteredArr.length > 0
                      ? filteredArr.map((item: any, idx: any) => {
                          return (
                            <button
                              key={idx}
                              className={`flex w-full items-center justify-between font-medium py-3 px-2  ${
                                value === item ||
                                item === meta.value1 ||
                                item === meta.value2
                                  ? "opacity-50 cursor-pointer"
                                  : "hover:bg-bg_secondary hover:bg-opacity-40 hover:rounded-xl cursor-pointer"
                              }
                          ${value === item && "cursor-default"}
                          `}
                              onClick={() => {
                                handle_click(item);
                              }}
                              disabled={value === item}
                            >
                              <div className="flex items-center gap-2">
                                <img
                                  src={item.logoURI}
                                  alt="ethw"
                                  className="w-5 h-5"
                                />
                                <div className="flex gap-4 items-center">
                                  <span className="text-secondary">
                                    {item.symbol}
                                  </span>
                                  <Badges
                                    kyc={item?.kyc}
                                    audit={item?.audit}
                                    kycLink={item?.kycLink}
                                    auditLink={item?.auditLink}
                                  />
                                </div>
                              </div>
                              <span className="text-secondary ml-4">{0}</span>
                            </button>
                          );
                        })
                      : valueMap.map((item: any, idx: any) => {
                          return (
                            <button
                              key={idx}
                              className={`flex w-full items-center justify-between font-medium py-3 px-2  ${
                                value === item ||
                                item === meta.value1 ||
                                item === meta.value2
                                  ? "opacity-50 cursor-pointer"
                                  : "hover:bg-bg_secondary hover:bg-opacity-40 hover:rounded-xl cursor-pointer"
                              }
                          ${value === item && "cursor-default"}
                          `}
                              onClick={() => {
                                handle_click(item);
                              }}
                              disabled={value === item}
                            >
                              <div className="flex items-center gap-2">
                                <img
                                  src={item.logoURI}
                                  alt="ethw"
                                  className="w-5 h-5"
                                />
                                <div className="flex gap-4 items-center">
                                  <span className="text-secondary">
                                    {item.symbol}
                                  </span>
                                  <Badges
                                    kyc={item?.kyc}
                                    audit={item?.audit}
                                    kycLink={item?.kycLink}
                                    auditLink={item?.auditLink}
                                  />
                                </div>
                              </div>
                              <span className="text-secondary ml-4">{0}</span>
                            </button>
                          );
                        })}
                  </section>
                </section>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const Badges = ({
  kyc,
  audit,
  kycLink,
  auditLink,
}: {
  kyc: boolean;
  audit: boolean;
  kycLink: string;
  auditLink: string;
}) => {
  return (
    <section className="flex gap-2 items-center">
      {kyc && (
        <a
          href={kycLink}
          target={"_blank"}
          rel="noreferrer"
          className="bg-bg_secondary bg-opacity-30 rounded-lg gap-1 flex items-center px-2 py-1 text-xs"
        >
          <AiFillCheckCircle className="fill-accent opacity-90" />
          <span className="text-accent text-opacity-70 font-bold">KYC</span>
        </a>
      )}
      {audit && (
        <a
          href={auditLink}
          target={"_blank"}
          rel="noreferrer"
          className="bg-bg_secondary bg-opacity-30 rounded-lg gap-1 flex items-center px-2 py-1 text-xs"
        >
          <AiFillCheckCircle className="fill-accent opacity-90" />
          <span className="text-accent text-opacity-70 font-bold">AUDIT</span>
        </a>
      )}
    </section>
  );
};

export default TokenModal;
