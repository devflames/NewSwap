import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import close from "../../assets/cross.svg";

const SettingsModal = ({
  modal,
  toggleModal,
  meta,
}: {
  modal: boolean;
  toggleModal: any;
  meta: any;
}) => {
  return (
    <Transition appear show={modal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20 font-primary"
        onClose={() => toggleModal(!modal)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="min-w-[420px] pb-3 transform  bg-primary rounded-3xl  transition-all">
                <Dialog.Title
                  as="div"
                  className="w-full flex items-center justify-between px-6 pt-5 pb-2"
                >
                  <h3 className="font-bold text-lg text-secondary">Settings</h3>
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
                  <section className="flex flex-col gap-2 w-full items-start">
                    <span className="text-gray-400 text-sm">
                      Slipage Tolerance
                    </span>
                    <section className="flex items-center gap-1 ">
                      <button
                        className="text-accent text-opacity-70 px-3 py-2 w-16 border font-bold rounded-xl"
                        onClick={() => meta.setSlippage(0.1)}
                      >
                        0.1%
                      </button>
                      <button
                        className="text-accent text-opacity-70 px-3 py-2 w-16 border font-bold rounded-xl"
                        onClick={() => meta.setSlippage(0.5)}
                      >
                        0.5%
                      </button>
                      <button
                        className="text-accent text-opacity-70 px-3 py-2 w-16 border font-bold rounded-xl"
                        onClick={() => meta.setSlippage(1)}
                      >
                        1%
                      </button>
                      <div className="flex items-center font-medium gap-2">
                        <input
                          type="number"
                          name="txn_deadline"
                          id="txn_deadline"
                          min={0}
                          max={50}
                          className={` px-3 py-2 w-32 border rounded-xl focus:outline-none ${
                            meta.slippageError
                              ? "text-red-600"
                              : "text-secondary"
                          }`}
                          value={meta.slippage}
                          onChange={(e) => {
                            meta.setSlippage(e.target.value);
                          }}
                        />
                        <span className="text-secondary">%</span>
                      </div>
                    </section>
                    {meta.slippageError && (
                      <span className="text-red-600 text-sm">
                        Enter a valid slippage percentage
                      </span>
                    )}
                  </section>
                  <section className="flex flex-col gap-2 w-full items-start">
                    <span className="text-gray-400 text-sm">
                      Transaction Deadline
                    </span>
                    <div className="flex items-center justify-start w-full gap-3 font-medium">
                      <input
                        type="number"
                        name="txn_deadline"
                        id="txn_deadline"
                        className="px-5 py-2 w-1/2 text-secondary border rounded-xl focus:outline-none"
                        value={meta.deadline}
                        onChange={(e) => meta.setDeadline(e.target.value)}
                      />
                      <span className="text-secondary">minutes</span>
                    </div>
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

export default SettingsModal;
