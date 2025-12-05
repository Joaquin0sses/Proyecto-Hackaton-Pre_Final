import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import '@rainbow-me/rainbowkit/styles.css';
import {
    connectorsForWallets,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
    coreWallet,
    coinbaseWallet,
    injectedWallet,
    metaMaskWallet,
    rainbowWallet,
    walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { avalancheFuji } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
    [avalancheFuji],
    [publicProvider()]
);

const projectId = 'YOUR_PROJECT_ID'; // Get one at https://cloud.walletconnect.com/

const connectors = connectorsForWallets([
    {
        groupName: 'Recommended',
        wallets: [
            injectedWallet({ chains }),
            coreWallet({ projectId, chains }),
            coinbaseWallet({ appName: 'SafeSwap', chains }),
            metaMaskWallet({ projectId, chains }),
            rainbowWallet({ projectId, chains }),
            walletConnectWallet({ projectId, chains }),
        ],
    },
]);

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
})

export default function App({ Component, pageProps }: AppProps) {
    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains}>
                <Component {...pageProps} />
            </RainbowKitProvider>
        </WagmiConfig>
    );
}
