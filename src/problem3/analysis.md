# Analysis of `WalletPage` Component

The provided code contains several computational inefficiencies, anti-patterns, and functional errors.

## 1. Computational Inefficiencies

### Unnecessary Re-computation
- **`getPriority` Function**: This function is defined inside the component. On every render, this function is re-created. It references no internal state and should be moved outside the component or memoized.
- **`useMemo` Dependencies**:
    - The `useMemo` hook for `sortedBalances` includes `prices` in its dependency array, but `prices` is **not used** inside the memo callback. This causes the expensive sort operation to run unnecessarily whenever `prices` changes.
- **Double Iteration**:
    - The code iterates over `sortedBalances` to create `formattedBalances`.
    - It then iterates over `sortedBalances` *again* to create `rows`.
    - These maps can be combined or `formattedBalances` should be the source for `rows`.

## 2. Anti-Patterns & React Best Practices

### Props Anti-Pattern
- **Splitting Props**: `const { children, ...rest } = props;` is used, but the `Props` interface extends `BoxProps`. If `BoxProps` contains `children`, simply using `props` or standard destructuring is cleaner.

### Unstable Keys
- **Index as Key**: `key={index}` is used in the mapped rows. If the list is resorted or filtered (which it is), using index as a key can lead to rendering bugs and performance issues. A unique ID (like currency) should be used.

### Logic & Type Errors
- **Undefined Variable**: `lhsPriority` is used in the `filter` block: `if (lhsPriority > -99)`. This variable is not defined in that scope (likely a copy-paste error from `balancePriority`).
- **Incorrect Filter Logic**:
    - The filter logic checks `if (balance.amount <= 0)` and returns `true`. This implies we keep empty/negative balances, which seems counter-intuitive for a wallet display (usually you show positive balances).
    - If the intention was `amount > 0` (typical), the logic `return true` for `<= 0` is inverted.
- **Unused Variable**: `formattedBalances` is computed but **never used**. The `rows` mapping uses `sortedBalances` directly, meaning `formatted` property is accessed on an object that doesn't have it (TS error).
- **Type Mismatch**: `sortedBalances` is a list of `WalletBalance`. `rows` maps over it typing the item as `FormattedWalletBalance`, but the formatting transformation happened in the *unused* `formattedBalances` array. This would crash at runtime or cause TS build errors.
- **Missing Interface Property**: `WalletBalance` interface does not define `blockchain` (string), yet `balance.blockchain` is accessed.

## 3. Code Quality

- **Complexity in Sort**: The sort comparison function uses nested if-else blocks that can be simplified to `rightPriority - leftPriority`.
- **Hardcoded Values**: Priority values are hardcoded integers. An enum or constant object map would be cleaner.

---

## Refactoring Plan

1.  Move `getPriority` outside the component.
2.  Fix `useMemo` dependencies (remove `prices`).
3.  Fix the sorting/filtering logic (correct variable names).
4.  Combine formatting and sorting efficiently.
5.  Use stable keys.
