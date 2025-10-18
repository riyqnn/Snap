'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { CreditCardIcon } from "@heroicons/react/16/solid"

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
        <button onClick={() => disconnect()} className="bg-white-primary cursor-pointer border p-2 w-fit justify-center gap-4 text-blue-primary border-black-primary rounded-3xl w-64 flex"><CreditCardIcon className="size-6 text-blue-primary" />Connected to {`${address.slice(0, 6)}...${address.slice(-4)}`}</button>
    );
  }

  return (
    <button 
      onClick={() => connect({ connector: injected() })}
      className="bg-white-primary cursor-pointer border p-2 justify-center gap-4 text-blue-primary border-black-primary rounded-3xl w-64 flex"><CreditCardIcon className="size-6 text-blue-primary" />
      Connect Wallet
    </button>
  );
}