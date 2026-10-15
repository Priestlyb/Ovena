export type FAQItem = {
    id: number;
    question: string;
    answer: string;
};

export type FAQSection = {
    title: string;
    data: FAQItem[];
};

export const FAQ_SECTIONS: FAQSection[] = [
    {
        title: "HELP & SUPPORT",
        data: [
            {
                id: 1,
                question: "How can I contact support?",
                answer:
                    "You can reach out to our support team via the help section in your profile.",
            },
            {
                id: 2,
                question: "What should I do if the app crashes?",
                answer: "Try restarting the app or updating to the latest version.",
            },
        ],
    },
    {
        title: "METHOD OF PAYMENTS AND INCIDENTS",
        data: [
            {
                id: 3,
                question: "What payment methods are accepted?",
                answer:
                    "We accept cards, bank transfers, and other supported gateways.",
            },
            {
                id: 4,
                question: "I was charged but didn’t get service",
                answer:
                    "Contact support immediately with your transaction details.",
            },
        ],
    },
    {
        title: "OTHER QUESTIONS",
        data: [
            {
                id: 5,
                question: "Can I change my account details?",
                answer:
                    "Yes, you can update your account details in your profile.",
            },
            {
                id: 6,
                question: "Is my data secure?",
                answer:
                    "Yes, we use encryption to protect all user data.",
            },
        ],
    },
];