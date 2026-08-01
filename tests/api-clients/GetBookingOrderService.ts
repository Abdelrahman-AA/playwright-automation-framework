import { APIRequestContext } from '@playwright/test';
import { endPoints } from '../test-data/testDataYamlReader';

export class GetBookingOrderService {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async getBookingByOrderId(orderId: string) {

        const response = await this.request.post((endPoints.BookedItinerary), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            form: {
                order_id_text: orderId,
                search_hotel_id: "Go"
            }
        });

        return response;
    }
}