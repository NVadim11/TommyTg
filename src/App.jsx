import { ThemeProvider } from "@emotion/react"
// import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
// import {
//   ConnectionProvider,
//   WalletProvider,
// } from "@solana/wallet-adapter-react"
// import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
// import "@solana/wallet-adapter-react-ui/styles.css"
// import {
//   AvanaWalletAdapter,
//   CloverWalletAdapter,
//   Coin98WalletAdapter,
//   CoinbaseWalletAdapter,
//   CoinhubWalletAdapter,
//   FractalWalletAdapter,
//   HuobiWalletAdapter,
//   HyperPayWalletAdapter,
//   KeystoneWalletAdapter,
//   KrystalWalletAdapter,
//   LedgerWalletAdapter,
//   MathWalletAdapter,
//   NekoWalletAdapter,
//   NightlyWalletAdapter,
//   NufiWalletAdapter,
//   OntoWalletAdapter,
//   ParticleAdapter,
//   PhantomWalletAdapter,
//   SafePalWalletAdapter,
//   SaifuWalletAdapter,
//   SalmonWalletAdapter,
//   SkyWalletAdapter,
//   SolflareWalletAdapter,
//   SolongWalletAdapter,
//   SpotWalletAdapter,
//   TokenPocketWalletAdapter,
//   TokenaryWalletAdapter,
//   TorusWalletAdapter,
//   TrezorWalletAdapter,
//   TrustWalletAdapter,
//   UnsafeBurnerWalletAdapter,
//   WalletConnectWalletAdapter,
//   XDEFIWalletAdapter
// } from "@solana/wallet-adapter-wallets"
import React from "react"
import { Provider } from "react-redux"
import "./App.scss"
import AppRouter from "./components/Router"
import { store } from "./store"
import { theme } from "./theme"

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        {/* <Context> */}
          <AppRouter />
        {/* </Context> */}
      </Provider>
    </ThemeProvider>
  );
}

export default App;

// const Context = ({ children }) => {
//   const network = WalletAdapterNetwork.Devnet;
//   const endpoint = useMemo(() => clusterApiUrl(network), [network]);

//   const wallets = useMemo(
//     () => [
//       new PhantomWalletAdapter(),
//       new SolflareWalletAdapter(),
//       new TrezorWalletAdapter(),
//       new AvanaWalletAdapter(),
//       new CloverWalletAdapter(), 
//       new Coin98WalletAdapter(),
//       new CoinbaseWalletAdapter(),
//       new CoinhubWalletAdapter(),
//       new FractalWalletAdapter(), 
//       new HuobiWalletAdapter(), 
//       new HyperPayWalletAdapter(), 
//       new KeystoneWalletAdapter(),
//       new KrystalWalletAdapter(),
//       new LedgerWalletAdapter(),
//       new MathWalletAdapter(),
//       new NekoWalletAdapter(),
//       new NightlyWalletAdapter(),
//       new NufiWalletAdapter(),
//       new OntoWalletAdapter(),
//       new ParticleAdapter(),
//       new SafePalWalletAdapter(),
//       new SaifuWalletAdapter(),
//       new SalmonWalletAdapter(),
//       new SkyWalletAdapter(),
//       new SolongWalletAdapter(),
//       new SpotWalletAdapter(),
//       new TokenPocketWalletAdapter(),
//       new TokenaryWalletAdapter(),
//       new TorusWalletAdapter(),
//       new TrustWalletAdapter(),
//       new UnsafeBurnerWalletAdapter(),
//       new WalletConnectWalletAdapter(),
//       new XDEFIWalletAdapter()
//     ],
//     []
//   );

//   return (
//     <ConnectionProvider endpoint={endpoint}>
//       <WalletProvider wallets={wallets} autoConnect>
//         <WalletModalProvider>{children}</WalletModalProvider>
//       </WalletProvider>
//     </ConnectionProvider>
//   );
// };
