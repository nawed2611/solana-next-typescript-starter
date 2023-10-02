"use client"
import { buttonVariants } from "@/components/ui/button"
import { useEffect, useState } from "react";

import { Connection, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmRawTransaction, sendAndConfirmTransaction } from '@solana/web3.js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

export default function IndexPage() {
  const { publicKey, connected, sendTransaction } = useWallet()
  console.log(publicKey, connected)

  const [balance, setBalance] = useState(0);
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  useEffect(() => {
    console.log('publicKey: ', publicKey);

    if (publicKey) {
      connection.getBalance(publicKey).then((balance) => {
        console.log(balance);
        setBalance(balance);
      });
    }
  }, [publicKey]);

  const sendSol = async (event: any) => {
    event.preventDefault()
    console.log(`Send ${event.target.amount.value} SOL from ${publicKey} to ${event.target.recipient.value} `)

    const amount = event.target.amount.value;
    const recipient = event.target.recipient.value;

    console.log(connection.rpcEndpoint);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey as PublicKey,
        toPubkey: new PublicKey(recipient),
        lamports: amount * 1000000000,
      })
    );

    console.log(transaction);
    const result = await sendTransaction(transaction, connection);
    console.log(result);
  }

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Send SOL <br className="hidden sm:inline" />
          To your loved ones
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Use this Solana Stack Starter to build with Next.js 13 and Solana.
        </p>
      </div>

      {!publicKey ? (
        <p>Connect Wallet to Continue</p>
      ) : (
        <div className="flex flex-col">
          <p className="font-sans leading-tight tracking-tighter">
            Wallet Connected! Continue to make your transaction
          </p>

          <p className="font-sans leading-tight tracking-tighter">
            Your Balance : {balance.valueOf() / 1000000000} SOL
          </p>
        </div>
      )}
      <div className="flex items-center justify-center">
        {publicKey && (
          <form onSubmit={sendSol} className="flex w-[40vw] flex-col items-center justify-center gap-4 gap-y-6 p-4 leading-tight tracking-tighter">
            <label htmlFor="amount">Amount (in SOL) to send:</label>
            <input
              id="amount"
              className="w-[90%] rounded border bg-transparent p-4"
              type="text"
              placeholder="e.g. 0.1"
              required
            />

            <label htmlFor="recipient">Send SOL to:</label>
            <input
              id="recipient"
              className="w-[90%] rounded border bg-transparent p-4"
              type="text"
              placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA"
              required
            />
            <button
              type="submit"
              className={buttonVariants({
                variant: "secondary",
                size: "default",
              })}
            >
              Send
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
