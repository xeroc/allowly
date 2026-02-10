# Allowly.app

Automated payments on Solana. Choose your mode.

## Two Products

### 📱 Allowly Human (Pocket Money)

Recurring allowances for family. Parents → Kids automated payments on Solana.

**Features:**
- Weekly/biweekly/monthly allowances
- One-time approval, forever automation
- Pause/resume/cancel anytime
- Zero backend - everything on-chain

**Get started:** [allowly.app/human](https://allowly.app/human)

---

### 🤖 Allowly Agent

Autonomous allowances for AI agents. Humans set policies, agents claim funds within bounds.

**Features:**
- Bounded autonomy (agents decide, humans set limits)
- Policy-based claims (total, frequency)
- On-chain transparency (all claims recorded)
- Agent skill for autonomous decision-making

**Get started:** [allowly.app/agent](https://allowly.app/agent)

**Skill documentation:** [skills/allowly-agent/SKILL.md](skills/allowly-agent/SKILL.md)

---

## Tech Stack

- **Frontend:** Next.js 15 + React 19 + TypeScript
- **Styling:** Tailwind CSS + Framer Motion
- **Protocol:** Tributary SDK (@tributary-so/sdk)
- **Network:** Solana Mainnet (USDC)
- **Wallet:** Solana Wallet Adapter (Phantom, Solflare, etc.)

## Installation

```bash
# Clone repository
git clone https://github.com/xeroc/allowly.git
cd allowly

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Configuration

Create `.env.local`:

```bash
# Solana RPC
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Tributary Program ID
NEXT_PUBLIC_TRIBUTARY_PROGRAM_ID=TRibg8W8zmPHQqWtyAD1rEBRXEdyU13Mu6qX1Sg42tJ

# USDC Mint
NEXT_PUBLIC_USDC_MINT=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v

# Payment Gateway
NEXT_PUBLIC_GATEWAY=6ntm5rWqDFefET8RFyZV73FcdqxPMbc7Tso3pCMWk4w4
```

## Development

```bash
# Run dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run tests
pnpm test
```

## Project Structure

```
allowly/
├── packages/
│   └── app/                      # Next.js application
│       ├── app/
│       │   ├── page.tsx            # Mode selector (root)
│       │   ├── human/             # Human mode routes
│       │   │   └── page.tsx
│       │   └── agent/             # Agent mode routes
│       │       └── page.tsx
│       ├── components/              # React components
│       ├── lib/                   # Tributary integration
│       └── constants.ts            # Configuration
└── skills/
    └── allowly-agent/            # OpenClow skill
        ├── SKILL.md             # Skill documentation
        └── lib.ts               # Skill implementation
```

## Architecture

### Human Mode (Pocket Money)

1. Parent connects wallet
2. Enters child's wallet address
3. Sets amount + frequency
4. Approves token delegation
5. Tributary executes payments automatically

### Agent Mode (Allowances)

1. Human connects wallet
2. Enters agent's wallet address
3. Sets amount + frequency
4. Approves token delegation
5. Agent checks allowance via skill
6. Agent autonomously claims funds within limits

### Protocol: Tributary

- PaymentPolicy accounts stored on-chain
- Token delegation for automated payments
- Gateway executes payments on schedule
- Zero backend required

## Contributing

Contributions welcome! Please read `PROJECT.md` for design decisions.

## License

ISC

---

**Built with ❤️ using Tributary protocol on Solana**
