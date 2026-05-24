# Trading Account Card

## Purpose

Summarize a simulated trading account, server, leverage profile, currency, balance, equity, and margin status.

## Data

`Account` from `src/domain/types.ts`.

## States

default, loading, empty, error, restricted, reviewing.

## Rules

- Label all balances as demo in simulation mode.
- Margin risk copy must be visible when margin level is below threshold.
- Account identifiers must be masked before live integration if sensitive.

