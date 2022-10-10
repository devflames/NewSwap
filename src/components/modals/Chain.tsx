import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import close from "../../assets/cross.svg";

const ChainModal = ({
  modal,
  toggleModal,
  valueMap,
  setter,
  value,
}: {
  modal: boolean;
  toggleModal: any;
  valueMap: any;
  setter: any;
  value: any;
}) => {
  const handle_click = (value: any) => {
    setter(value);
    toggleModal(!modal);
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
              <Dialog.Panel className="min-w-[420px] pb-3 transform  bg-primary rounded-3xl transition-all">
                <Dialog.Title
                  as="div"
                  className="w-full flex items-center justify-between px-7 pt-5 pb-2"
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
                <section className="px-6 py-2 flex flex-col items-start gap-4 w-full">
                  <input
                    type="text"
                    placeholder="Search name or paste address"
                    className="text-secondary text-opacity-60 px-5 py-3 rounded-xl border w-full"
                  />
                  <span className="text-secondary ml-2">Token Name</span>
                  <section className="flex flex-col gap-2 w-full items-start overflow-scroll h-[400px] overflow-x-hidden pr-2">
                    {valueMap.map((item: any, idx: any) => {
                      return (
                        <div
                          key={idx}
                          className="flex w-full items-center justify-between font-medium  hover:bg-bg_secondary hover:bg-opacity-40 py-3 px-2 cursor-pointer hover:rounded-xl"
                          onClick={() => handle_click(item)}
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={item.logoURI}
                              alt="ethw"
                              className="w-5 h-5"
                            />
                            <span className="text-secondary">
                              {item.symbol}
                            </span>
                          </div>
                          <span className="text-secondary">{0}</span>
                        </div>
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

export default ChainModal;
