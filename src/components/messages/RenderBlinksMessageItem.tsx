import React, { useState, useEffect } from 'react';
import { ActionAdapter, Blink } from '@dialectlabs/blinks';
import { useAction, useBlink } from '@dialectlabs/blinks/react';
import '@dialectlabs/blinks/index.css';
import { usePrivy, useSolanaWallets } from '@privy-io/react-auth/solana';
import { VersionedTransaction } from '@solana/web3.js';

interface RenderBlinksProps {
  url?: string;
  action?: string;
}

export const RenderBlinksMessageItem: React.FC<{ props: RenderBlinksProps }> = ({ props }) => {
  const blinkUrl = props?.url || props?.action;
  const { wallets } = useSolanaWallets();
  const wallet = wallets[0];

  const adapter = React.useMemo<ActionAdapter | undefined>(() => {
    if (!wallet) return undefined;
    return {
      async signTransaction(tx: string | VersionedTransaction) {
        let vTx: VersionedTransaction;
        if (typeof tx === 'string') {
          const decoded = Buffer.from(tx, 'base64');
          vTx = VersionedTransaction.deserialize(decoded);
        } else {
          vTx = tx;
        }
        return await wallet.signTransaction(vTx);
      },
      async confirmTransaction(signature: string) {
        console.log('Confirmed transaction:', signature);
      },
    };
  }, [wallet]);

  const { action, isLoading } = useAction({
    url: blinkUrl,
    adapter,
  });

  const blink = useBlink({
    action,
    adapter,
  });

  if (!blinkUrl) {
    return <div className="p-3 text-red-500">Error: No blink URL provided.</div>;
  }

  return (
    <div className="my-2 w-full max-w-md rounded-xl border border-border bg-card p-4 text-card-foreground shadow">
      {isLoading && <div className="text-sm text-muted-foreground">Loading Blink...</div>}
      <div className="dialect">
        <Blink action={action} websiteText={blinkUrl} />
      </div>
    </div>
  );
};
