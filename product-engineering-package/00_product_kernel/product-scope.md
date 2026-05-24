# Product Scope

## In Scope

- Deposit IDR into a selected USD trading account through Bank Transfer, Virtual Account, or E-wallet.
- Withdraw IDR from a selected USD trading account after KYC, bank or payout ownership verification, limit validation, and risk checks.
- Transfer USD balance between active trading accounts owned by the same verified legal identity.
- Provide Admin contracts for funding review, channel configuration, limit and fee configuration, and exception review.
- Provide API, error code, state machine, test, and release decision contracts.

## Out of Scope

- Wallet or custody account between customer and trading account.
- User-to-user transfer, Partner-to-client transfer, third-party payout, card storage, live payment provider integration, live KYC provider integration, and settlement accounting implementation.
- UI implementation or Expo code changes.

## Success Criteria

- Every funding operation traces to business rules, permissions, states, API draft, error codes, and tests.
- Missing provider, AML, limit, fee, and compliance values are recorded as assumptions or blockers.
- Existing demo account assets remain clearly non-withdrawable until production APIs and risk gates exist.

