import crypto from 'crypto';

const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';
const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || 'EPAYTEST';
const ESEWA_GATEWAY_URL =
  process.env.ESEWA_GATEWAY_URL || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

interface OrderLike {
  _id: string;
  totalPrice: number;
}

const generateSignature = (
  totalAmount: string,
  transactionUuid: string,
  productCode: string
): string => {
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
  const hmac = crypto.createHmac('sha256', ESEWA_SECRET_KEY);
  hmac.update(message);
  return hmac.digest('base64');
};

export const buildEsewaFormFields = (order: OrderLike) => {
  const totalAmount = order.totalPrice.toFixed(2);
  const transactionUuid = order._id.toString();
  const signature = generateSignature(totalAmount, transactionUuid, ESEWA_PRODUCT_CODE);

  return {
    gatewayUrl: ESEWA_GATEWAY_URL,
    fields: {
      amount: totalAmount,
      tax_amount: '0',
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: ESEWA_PRODUCT_CODE,
      product_service_charge: '0',
      product_delivery_charge: '0',
      success_url: `${FRONTEND_URL}/checkout/esewa/success`,
      failure_url: `${FRONTEND_URL}/checkout/esewa/failure`,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      signature,
    },
  };
};

interface EsewaCallbackData {
  transaction_uuid: string;
  total_amount: string;
  product_code: string;
  signature: string;
  status: string;
}

export const verifyEsewaCallback = (encodedData: string): EsewaCallbackData => {
  const decoded = JSON.parse(
    Buffer.from(encodedData, 'base64').toString('utf-8')
  ) as EsewaCallbackData;

  const expectedSignature = generateSignature(
    decoded.total_amount,
    decoded.transaction_uuid,
    decoded.product_code
  );

  if (expectedSignature !== decoded.signature) {
    throw new Error('Payment signature verification failed');
  }

  if (decoded.status !== 'COMPLETE') {
    throw new Error(`Payment not complete: ${decoded.status}`);
  }

  return decoded;
};
