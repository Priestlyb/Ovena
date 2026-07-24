export type Wallet = {
    available_balance_kobo: number;
    available_balance_ngn: number;
    can_withdraw: boolean;
    minimum_ngn: number;
    minimum_withdrawal_kobo: number;
    needed_to_withdraw_kobo: number;
    pending_withdrawal_kobo: number;
    total_balance_kobo: number;
    total_balance_ngn: number;
};

export type Transaction = {
    id: string;
    amount: number;
    type: "credit" | "debit";
    status: string;
    created_at: string;
    description?: string;
    reference?: string;
};