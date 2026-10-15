import React from "react";

export type FoodOrderTabViewProps = {
    categories?: any[];
    menuItems?: any[];
    businessData?: any;
};

export interface DropdownOption {
    label: string;
    value: string;
}

export interface CustomDropdownProps {
    disabled?: boolean;

    options: DropdownOption[];

    placeholder: string;

    value: DropdownOption | null;

    onChange: (value: DropdownOption) => void;

    label?: string;

    required?: boolean;

    renderOptionRight?: (
        option: DropdownOption,
        selected: boolean
    ) => React.ReactNode;
}