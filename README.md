# ourKairos

**ourKairos** is an open-source platform for creating and delivering time-locked digital capsules—messages, media, and crypto gifts that unlock only at a specific moment in the future. It reintroduces anticipation to digital communication by combining reliable Web2 infrastructure with blockchain-powered payments.

Originally built on **Starknet**, ourKairos is actively being **migrated to the Stellar network** to enable faster confirmations, lower transaction costs, and broader accessibility, while preserving a pragmatic hybrid Web2/Web3 architecture.

---

## Why ourKairos?

In a world dominated by instant messages and disposable content, ourKairos is built around *intentional delivery*. Capsules are sealed, stored securely, and revealed only when the time is right.

Use cases include:

* Future messages to yourself or others
* Birthday and anniversary surprises
* Scheduled video or audio drops
* Crypto gifts delivered at meaningful moments

The platform is designed to work just as well for casual users as it does for crypto-native users, supporting **guest access**, **registered accounts**, and **subscription-powered perks**.

---

## Core Features

* **Time-Locked Capsules** – Define exactly when a capsule becomes accessible
* **Multi-Media Support** – Text, images, videos, and crypto gifts
* **Hybrid Web2 / Web3 Design** –

  * Web2 for storage, integrity, and performance
  * Web3 for payments, subscriptions, and ownership
* **Flexible Access** – Guest users and authenticated accounts
* **Custom Delivery Controls** – Recipients, unlock dates, reminders, and visibility
* **Secure & Scalable** – Built to grow with usage and contributors

---

## Architecture Overview

ourKairos is built with modularity, scalability, and blockchain extensibility in mind.

| Layer          | Technology                                        |
| -------------- | ------------------------------------------------- |
| Frontend       | React (Web)                                       |
| Backend API    | NestJS                                            |
| Database       | MongoDB                                           |
| Blockchain     | **Stellar** (migration in progress from Starknet) |
| Payments       | Stellar-based subscriptions and crypto gifts      |
| Authentication | NextAuth.js                                       |
| File Storage   | Cloud object storage                              |

---

## Repository Structure

The project follows a modular monorepo layout to keep concerns clearly separated and contributions easy to reason about:

```
ourKairos/
├── apps/
│   ├── web/                # React frontend
│   └── api/                # NestJS backend
├── libs/
│   ├── capsules/           # Core capsule models & logic
│   ├── users/              # Authentication & user management
│   ├── payments/           # Stellar payments & subscriptions
│   └── utils/              # Shared helpers and middleware
├── tests/                  # Unit & integration tests
├── .env.example
├── package.json
└── README.md
```

---

## API Highlights

### Capsules

* `POST /capsules` – Create a new capsule
* `GET /capsules/:id` – Retrieve capsule details
* `PATCH /capsules/:id` – Update capsule metadata or delivery rules
* `DELETE /capsules/:id` – Delete a capsule

### Users

* `POST /auth/register` – Register an account
* `POST /auth/login` – Authenticate a user
* `GET /auth/me` – Retrieve the current user

### Payments (Stellar)

* `POST /payments/intent` – Initialize a payment or subscription
* `POST /payments/confirm` – Confirm a completed payment
* `GET /payments/:id` – Retrieve payment details

---

## Related Repositories

---

## Getting Started

### Prerequisites

* Node.js ≥ 18
* MongoDB
* Stellar Testnet account
* npm or Yarn

### Installation

```bash
git clone https://github.com/your-org/ourKairos.git
cd ourKairos
npm install
cp .env.example .env
```

### Run Locally

```bash
npm run dev
```

### Testing

```bash
npm test
```

---

## Contributing

ourKairos is fully open-source and welcomes contributors across Web2, Web3, and product engineering.

### How to Contribute

1. Fork the repository
2. Create a feature branch from `main`
3. Pick an open issue or propose a new one
4. Keep pull requests focused and well-documented
5. Add tests where applicable
6. Open a PR with context and screenshots if relevant

### Contribution Guidelines

* Respect the modular structure
* Avoid breaking capsule or payment flows
* Document new endpoints and workflows
* Use clear commit messages and small PRs

---

## 💬 Support & Community

For questions, design discussions, or pre-PR clarifications:

👉 Telegram: ([ourKairos](https://t.me/ourKairos))

---

## 📄 License

MIT License
