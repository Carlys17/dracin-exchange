# CrossAgg — Cross-Chain DEX Aggregator

A cross-chain bridge aggregator that finds the best routes across multiple bridges and DEXes. Similar to Jumper/LI.FI, Bungee/Socket, but self-hosted and customizable.

## Features

- **Multi-bridge aggregation** — Aggregates routes from LI.FI (15+ bridges) and Socket/Bungee (10+ bridges)
- **Best price routing** — Compares all routes and ranks by output amount, speed, and fees
- **20+ chains** — Ethereum, Arbitrum, Optimism, Base, Polygon, BSC, Avalanche, Solana, and more
- **Token search** — Search any token by name or contract address
- **Transaction tracking** — Real-time status updates for bridging transactions
- **Slippage control** — Configurable slippage tolerance
- **Non-custodial** — All transactions execute directly from your wallet

## Tech Stack

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Web3**: wagmi + viem (EVM), Solana wallet adapter
- **State**: Zustand
- **APIs**: LI.FI API + Socket/Bungee API
- **Deploy**: Vercel (Edge Runtime)

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/crosschain-aggregator.git
cd crosschain-aggregator
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

```env
# Required - Get free from https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Optional but recommended - Get free from https://li.fi
NEXT_PUBLIC_LIFI_API_KEY=your_lifi_key

# Optional - Get free from https://docs.socket.tech
NEXT_PUBLIC_SOCKET_API_KEY=your_socket_key
```

**API Keys Guide:**
| Key | Where to get | Required? |
|-----|-------------|-----------|
| WalletConnect | [cloud.walletconnect.com](https://cloud.walletconnect.com) | Yes (for WalletConnect) |
| LI.FI | [li.fi](https://li.fi) — sign up, get API key | Optional (works without, rate limited) |
| Socket | [docs.socket.tech](https://docs.socket.tech) | Optional (works without, rate limited) |

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Push to GitHub

### First Time Setup

```bash
# Initialize git (skip if already a repo)
git init

# Add all files
git add .

# Commit
git commit -m "feat: initial cross-chain aggregator"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/crosschain-aggregator.git
git branch -M main
git push -u origin main
```

### Subsequent Pushes

```bash
git add .
git commit -m "your commit message"
git push
```

---

## Deploy to Vercel

### Option A: Via GitHub (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"New Project"**
3. Import your `crosschain-aggregator` repo
4. Add environment variables:
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - `NEXT_PUBLIC_LIFI_API_KEY` (optional)
   - `NEXT_PUBLIC_SOCKET_API_KEY` (optional)
5. Click **Deploy**

Vercel will auto-deploy on every push to `main`.

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts, then set env vars:
vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
vercel env add NEXT_PUBLIC_LIFI_API_KEY
vercel env add NEXT_PUBLIC_SOCKET_API_KEY

# Redeploy with env vars
vercel --prod
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/
│   │   ├── quote/          # Route finding API (Edge)
│   │   ├── tokens/         # Token search API
│   │   └── status/         # TX status tracking API
│   ├── layout.tsx          # Root layout + fonts
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── layout/
│   │   └── header.tsx      # Nav + wallet connect
│   └── swap/
│       ├── swap-card.tsx   # Main swap interface
│       ├── chain-selector.tsx
│       ├── token-selector.tsx
│       ├── route-list.tsx  # Route comparison
│       └── transaction-history.tsx
├── hooks/
│   └── use-swap.ts         # Quote fetching, swap execution
├── lib/
│   ├── adapters/
│   │   ├── lifi.ts         # LI.FI adapter
│   │   └── socket.ts       # Socket/Bungee adapter
│   ├── routing/
│   │   └── optimizer.ts    # Route ranking algorithm
│   ├── config/
│   │   └── chains.ts       # Chain & token configs
│   ├── types/
│   │   └── index.ts        # TypeScript types
│   └── utils/
│       └── index.ts        # Helpers
├── providers/
│   └── web3-provider.tsx   # wagmi + react-query
└── store/
    └── swap-store.ts       # Zustand state
```

---

## Customization

### Add New Bridge Adapter

1. Create `src/lib/adapters/your-bridge.ts`
2. Implement the quote, build, and status functions
3. Add to `src/lib/routing/optimizer.ts`

```typescript
// In optimizer.ts, add your adapter:
import { getYourBridgeQuote } from "@/lib/adapters/your-bridge";

const [lifiRoutes, socketRoutes, yourRoutes] = await Promise.allSettled([
  getLiFiQuote(params),
  getSocketQuote(params),
  getYourBridgeQuote(params), // Add here
]);
```

### Add Revenue (Fee Collection)

Set in `.env.local`:
```env
NEXT_PUBLIC_FEE_COLLECTOR=0xYourWalletAddress
NEXT_PUBLIC_FEE_PERCENT=0.05
```

Then modify the swap execution to add integrator fees via the LI.FI/Socket APIs (both support integrator fee params).

### Add Chains

Edit `src/lib/config/chains.ts` — add new chain config to the `CHAINS` array and popular tokens to `POPULAR_TOKENS`.

---

## Roadmap

- [ ] Solana wallet adapter integration (UI connected, needs wallet adapter)
- [ ] Token balance display
- [ ] Price impact warnings
- [ ] Multi-route execution (split across bridges)
- [ ] Gasless swaps via meta-transactions
- [ ] Custom RPC management
- [ ] Dark/light theme toggle
- [ ] Mobile-optimized UI
- [ ] Analytics dashboard

---

## License

MIT
