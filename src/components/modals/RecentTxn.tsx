import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import close from "../../assets/cross.svg";
import link from "../../assets/link.svg";
import tick from "../../assets/tick.svg";
import { getTransactionHistory, truncateHash } from "../../hooks/generalHooks";

const RecentTxnModal = ({
  modal,
  toggleModal,
}: {
  modal: boolean;
  toggleModal: any;
}) => {
  const [txs, setTxs] = useState([]);

  useEffect(() => {
    // getTransactionHistory().then(res => setTxs(res));
  }, []);

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
              <Dialog.Panel className="min-w-[420px] pb-3 transform  bg-primary rounded-3xl  transition-all">
                <Dialog.Title
                  as="div"
                  className="w-full flex items-center justify-between px-6 pt-5 pb-2"
                >
                  <h3 className="font-bold text-lg text-secondary">
                    Recent Transactions
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
                <section className="px-6 py-3 flex flex-col items-start gap-5 w-full text-accent">
                  {txs.map((tx) => (
                    <div className="flex w-full justify-between items-center">
                      <a
                        href={`https://goerli.etherscan.io/tx/${tx.hash}`}
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        <div className="flex gap-2 items-center">
                          {/* Swap 300 OREO for 450 BUSD */}
                          {truncateHash(tx.hash || "")}
                          <img
                            src={link}
                            alt="transaction link"
                            className="w-4 h-4" // temporary
                          />
                        </div>
                      </a>
                      <img src={tick} alt="tick" className="w-5 h-5" />
                    </div>
                  ))}
                </section>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default RecentTxnModal;
