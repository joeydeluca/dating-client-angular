import {ProductPrice} from './ProductPrice';

export class PaymentPageData {
    productPrices: ProductPrice[];
    paypalPurchaseUrl: string;
    paypalNotifyUrl: string;
    paypalCancelUrl: string;
    paypalReturnUrl: string;
    paypalUnsubscribeUrl: string;
    paypalBusinessName: string;
}
