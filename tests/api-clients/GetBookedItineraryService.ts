import { APIRequestContext } from '@playwright/test';
import { endPoints } from '../test-data/testDataYamlReader';

export class GetBookedItineraryService {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async getBookedItinerary() {

        const response = await this.request.get((endPoints.BookedItinerary), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        return response;
    }
}