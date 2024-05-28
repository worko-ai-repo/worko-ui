export interface PaymentFlowConfig {
    merchantId: string;
    bdOrderId: string;
    authToken: string;
    childWindow: boolean;
    returnUrl?: string | null;
    retryCount: number;
    // prefs: {
    //   payment_categories: string[];
    //   allowed_bins: string[];
    // };
    // netBanking: {
    //   showPopularBanks: string;
    //   popularBanks: string[];
    // };
  }