import { APIRequestContext } from '@playwright/test';
import { endPoints } from '../test-data/testDataYamlReader';
import { getDaysDifference } from '../helpers/helpers';

export class SearchHotelService {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async searchHotel(
        location: string,
        hotelName: string,
        roomType: string,
        numRooms: string,
        arrivalDate: string,
        departureDate: string,
        numAdults: string,
        numChildren: string,
        sessionID: string) {

        let diff: string = getDaysDifference(arrivalDate, departureDate);

        const response = await this.request.post((`https://${endPoints.Domain}${endPoints.SearchHotel}`), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': `PHPSESSID=${sessionID}`,
            },
            form: {
                location: location,
                hotels: hotelName,
                room_type: roomType,
                room_nos: numRooms,
                datepick_in: arrivalDate,
                datepick_out: departureDate,
                adult_room: numAdults,
                child_room: numChildren,
                Submit: "Search",
                datepick_diff: diff
            }
        });

        return response;
    }
}