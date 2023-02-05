export interface AppConfig {
    inputStyle?: string;
    dark?: boolean;
    theme?: string;
    ripple?: boolean;
}

export interface MembershipType {
    breakfast_amt: string;
    days: number;
    dinner_amt: string;
    isBreakfast: number;
    isDinner: number;
    isLunch: number;
    isSnacks: number;
    isgranular: number;
    lunch_amt: string;
    membership_name: string;
    membership_type_id: number;
    snacks_amt: string;
    total_amt: string;
}


