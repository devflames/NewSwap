import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import close from "../../assets/cross.svg";
import { ethers } from "ethers";
import contractAddresses from "../../utils/contractAddresses.json";
import boostedMasterchefABI from "../../utils/ABIS/boostedMasterchefABI.json";
import erc20ABI from "../../utils/ABIS/erc20ABI.json";
import { approveToken, checkTokenAllowance } from "../../hooks/generalHooks";

const StakeUnStake = ({
  modal,
  toggleModal,
  meta,
}: {
  modal: boolean;
  toggleModal: any;
  meta: any;
}) => {
  const [unstake, setUnstake] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    checkTokenAllowance(meta.farm.lpTokenAddress).then((res) => {
      setIsAllowed(res);
    });
  }, [meta.farm.lpTokenAddress]);

  const depositLP = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const lpToken = new ethers.Contract(
          meta.farm.lpTokenAddress,
          erc20ABI,
          signer
        );
        const lpBalance = await lpToken.balanceOf(signer.getAddress());
        console.log(meta.stakeValue);
        if (lpBalance / Math.pow(10, 18) >= meta.stakeValue) {
          const allowance = await lpToken.allowance(
            signer.getAddress(),
            contractAddresses.boostedMasterChefAddress
          );
          const boostedMasterchef = new ethers.Contract(
            contractAddresses.boostedMasterChefAddress,
            boostedMasterchefABI,
            signer
          );
          if (allowance / Math.pow(10, 18) < meta.stakeValue) {
            await lpToken.approve(
              contractAddresses.boostedMasterChefAddress,
              "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
            );
          }
          await boostedMasterchef.deposit(
            meta.farm.poolId,
            ethers.utils.parseEther(meta.stakeValue.toString()),
            "0x0000000000000000000000000000000000000000"
          );
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const withdrawLP = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        console.log(meta.unstakeValue);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const boostedMasterchef = new ethers.Contract(
          contractAddresses.boostedMasterChefAddress,
          boostedMasterchefABI,
          signer
        );
        await boostedMasterchef.withdraw(
          meta.farm.poolId,
          ethers.utils.parseEther(meta.unstakeValue.toString())
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleMaxTokenBalance = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(
          meta.farm.lpTokenAddress,
          erc20ABI,
          signer
        );
        const balance = await tokenContract.balanceOf(signer.getAddress());
        meta.setStakeValue(balance / Math.pow(10, 18) - 0.00000000000001);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleMaxStakedTokenBalance = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const boostedMasterchef = new ethers.Contract(
          contractAddresses.boostedMasterChefAddress,
          boostedMasterchefABI,
          signer
        );
        const userInfo = await boostedMasterchef.userInfo(
          meta.farm.poolId,
          signer.getAddress()
        );
        console.log(userInfo);
        const balance = userInfo.amount;
        meta.setUnstakeValue(balance / Math.pow(10, 18));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const approve = () => {
    approveToken(meta.farm.lpTokenAddress);
    setIsAllowed(true);
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
              <Dialog.Panel className="w-[420px] pb-3 transform  bg-primary rounded-3xl transition-all">
                <Dialog.Title
                  as="div"
                  className="w-full flex items-center justify-between px-7 pt-5 pb-2"
                >
                  <h3 className="font-bold text-lg text-secondary">OREO</h3>
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
                  <section className="px-6 w-full">
                    <div className="px-3 py-3 rounded-xl border w-full flex items-center gap-2">
                      <button
                        onClick={() => {
                          setUnstake(!unstake);
                        }}
                        className={`rounded-2xl py-3 w-1/2  ${
                          !unstake
                            ? "bg-button_secondary text-primary text-opacity-100"
                            : " text-secondary text-opacity-60 "
                        }`}
                      >
                        Stake
                      </button>
                      <button
                        onClick={() => {
                          setUnstake(!unstake);
                        }}
                        className={`rounded-2xl py-3 w-1/2  ${
                          unstake
                            ? "bg-button_secondary text-primary text-opacity-100"
                            : " text-secondary text-opacity-60 "
                        }`}
                      >
                        Unstake
                      </button>
                    </div>
                  </section>
                  {!unstake ? (
                    <section className="flex flex-col w-full">
                      <section className="px-6 w-full">
                        <section className="flex border px-5 py-3 gap-1 w-full rounded-xl items-start justify-between mt-3">
                          <input
                            type="number"
                            min={0}
                            name={`stake`}
                            id={`stake`}
                            value={meta.stakeValue}
                            onChange={(e) => {
                              meta.setStakeValue(e.target.value);
                            }}
                            className={`text-xl w-3/4 font-bold text-opacity-60 text-secondary focus:outline-none outline-none border-none `}
                          />
                          <button
                            className="bg-bg_secondary bg-opacity-25 text-opacity-70 text-accent px-2 py-0.5 rounded-md text-sm font-bold "
                            onClick={() => handleMaxTokenBalance()}
                          >
                            MAX
                          </button>
                        </section>
                      </section>
                      <span className="text-secondary w-full text-center text-xs px-10 py-3 pb-6 border-b-gray-400 border-b-[0.5px]">
                        Current interest rate on amount above would yeild 0 OREO
                        per day. Subject to change with market trends.
                      </span>
                      <section className="px-6 w-full flex-col gap-2 flex items-start py-4 border-b-gray-400 border-b-[0.5px]">
                        <span className="text-sm text-secondary">
                          Select Boosters
                        </span>
                        <button className="px-3 py-2 border-2 border-button_secondary text-button_secondary rounded-xl">
                          Buy Booster NFT
                        </button>
                      </section>
                      <section className="px-6 my-4 flex w-full items-center justify-between text-secondary text-sm">
                        <span>Annual ROI at current rates</span>
                        <span>$0</span>
                      </section>
                      <section className="px-6 w-full">
                        <button
                          className="px-3 py-2 w-full border-2 border-button_secondary text-button_secondary rounded-xl"
                          onClick={
                            isAllowed ? () => depositLP() : () => approve()
                          }
                        >
                          {isAllowed ? "Deposit" : "Approve"}
                        </button>
                      </section>
                    </section>
                  ) : (
                    <section className="flex flex-col w-full">
                      <div className="w-full h-[0.5px] bg-gray-400 bg-opacity-60 my-3"></div>
                      <section className="px-6 w-full">
                        <section className="flex border px-5 py-3 gap-1 w-full rounded-xl items-start justify-between mt-3">
                          <input
                            type="number"
                            min={0}
                            name={`stake`}
                            id={`stake`}
                            value={meta.unstakeValue}
                            onChange={(e) => {
                              meta.setUnstakeValue(e.target.value);
                            }}
                            className={`text-xl w-3/4 font-bold text-secondary text-opacity-60 focus:outline-none outline-none border-none `}
                          />
                          <button
                            className="bg-bg_secondary bg-opacity-25 text-opacity-70 text-accent px-2 py-0.5 rounded-md text-sm font-bold "
                            onClick={() => handleMaxStakedTokenBalance()}
                          >
                            MAX
                          </button>
                        </section>
                      </section>
                      <span className="text-secondary w-full text-center text-xs px-10 py-3 pb-16">
                        Current interest rate on amount above would yeild 0 OREO
                        per day. Subject to change with market trends.
                      </span>
                      <section className="px-6 w-full">
                        <button
                          className="px-3 py-2 w-full border-2 border-button_secondary text-button_secondary rounded-xl"
                          onClick={() => withdrawLP()}
                        >
                          Unstake
                        </button>
                      </section>
                    </section>
                  )}
                </section>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default StakeUnStake;
