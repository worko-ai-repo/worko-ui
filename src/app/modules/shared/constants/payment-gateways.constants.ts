// Defining the interface for the payment gateway details
export interface PaymentGatewayData {
    name: string;
    logo: string;
    isEnabled: boolean;
}

// Creating a constant with the details of the payment gateways
export const PAYMENT_GATEWAYS: PaymentGatewayData[] = [
    {
        name: 'BillDesk',
        logo: 'assets/icons/billDeskLogo.png',
        isEnabled: false
    },
    {
        name: 'Razorpay',
        logo: 'assets/icons/razorpayLogo1.png',
        isEnabled: true
    }
];
