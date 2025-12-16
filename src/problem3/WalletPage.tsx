import React, { useMemo } from 'react';

interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string; // Added missing property
}

interface FormattedWalletBalance extends WalletBalance {
    formatted: string;
}

interface Props extends BoxProps {

}

const getPriority = (blockchain: string): number => {
    switch (blockchain) {
        case 'Osmosis':
            return 100;
        case 'Ethereum':
            return 50;
        case 'Arbitrum':
            return 30;
        case 'Zilliqa':
        case 'Neo':
            return 20;
        default:
            return -99;
    }
};

const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances(); // Assumed hook
    const prices = usePrices(); // Assumed hook

    const sortedBalances = useMemo(() => {
        return balances
            .filter((balance: WalletBalance) => {
                const balancePriority = getPriority(balance.blockchain);
                // Logic fixed: likely want to show balances with valid priority AND positive amount
                // Original code had: if (lhsPriority > -99) ...
                return balancePriority > -99 && balance.amount > 0;
            })
            .sort((lhs: WalletBalance, rhs: WalletBalance) => {
                const leftPriority = getPriority(lhs.blockchain);
                const rightPriority = getPriority(rhs.blockchain);
                // Descending order priority
                if (leftPriority > rightPriority) return -1;
                if (rightPriority > leftPriority) return 1;
                return 0;
            });
    }, [balances]); // Removed 'prices' dependency

    // Combine formatting into the render loop or separate memo if expensive
    // Here we can map it just before render or use memo if list is huge.
    // Given standard wallet sizes, mapping on render is fine, but sticking to structure:
    const formattedBalances = useMemo(() => {
        return sortedBalances.map((balance: WalletBalance) => {
            return {
                ...balance,
                formatted: balance.amount.toFixed()
            }
        })
    }, [sortedBalances]);

    const rows = formattedBalances.map((balance: FormattedWalletBalance) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
            <WalletRow
                className={classes.row} // Assumed classes exists
                key={balance.currency} // Use unique ID instead of index
                amount={balance.amount}
                usdValue={usdValue}
                formattedAmount={balance.formatted}
            />
        )
    })

    return (
        <div {...rest}>
            {rows}
        </div>
    )
}
