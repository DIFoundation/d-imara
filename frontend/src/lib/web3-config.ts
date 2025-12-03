import { createConfig, http } from "wagmi"
import { mainnet, sepolia, polygon, base } from "wagmi/chains"
import { walletConnect, injected } from "wagmi/connectors"

export const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || "your_project_id"

export const config = createConfig({
  chains: [mainnet, sepolia, polygon, base],
  connectors: [injected(), walletConnect({ projectId })],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
  },
})
