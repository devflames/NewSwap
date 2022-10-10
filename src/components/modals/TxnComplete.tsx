import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import close from "../../assets/cross.svg";
import complete from "../../assets/complete.svg";

const TxnCompleteModal = ({
  modal,
  toggleModal,
}: {
  modal: boolean;
  toggleModal: any;
}) => {
  return (
    <Transition appear show={modal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-20"
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

        <div className="fixed inset-0 overflow-y-auto font-primary">
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
              <Dialog.Panel className="min-w-[420px] pb-3 transform  bg-primary rounded-2xl  transition-all">
                <Dialog.Title
                  as="div"
                  className="w-full flex items-center justify-between px-6 pt-5 pb-2"
                >
                  <h3 className="font-bold text-lg text-secondary">
                    Transaction Submitted
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
                <section className="px-6 py-3 flex flex-col items-center gap-4 w-full">
                  <img src={complete} alt="link" className="w-32 h-32 " />

                  <a
                    href="/"
                    target={"_blank"}
                    rel="noreferrer"
                    className="font-bold text-[#3685ed]"
                  >
                    View on BscScan
                  </a>
                  <button
                    className={`button_gradient px-16 py-3 text-primary rounded-xl text-center font-bold mt-4`}
                    onClick={() => toggleModal(!modal)}
                  >
                    Close
                  </button>
                </section>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TxnCompleteModal;
