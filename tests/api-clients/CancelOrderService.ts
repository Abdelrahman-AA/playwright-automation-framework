import { APIRequestContext } from '@playwright/test';
import { endPoints } from '../test-data/testDataYamlReader';

export class CancelOrderService {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async cancelOrderId(orderId:string) {
        const response = await this.request.get((endPoints.CancelOrderById`${orderId}`), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        return response;
    }
}