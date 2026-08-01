import { APIRequestContext } from '@playwright/test';
import { endPoints } from '../test-data/testDataYamlReader';
import { getDaysDifference } from './helpers/helpers';

export class SelectHotelService {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async selectHotel(
        radiobutton_0: string,
        total_radiobutton: string,
        hotelName: string,
        location: string,
        numRooms: string,
        arrivalDate: string,
        departureDate: string,
        roomType: string,
        price_night: string,
        total_price: string,
        numAdults: string,
        numChildren: string) {

        let diff: number = getDaysDifference(arrivalDate, departureDate);

        const response = await this.request.post((endPoints.SelectHotel), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            form: {
                radiobutton_0: radiobutton_0,
                total_radiobutton: total_radiobutton,
                hotel_name_0: hotelName,
                location_0: location,
                rooms_0: numRooms,
                arr_date_0: arrivalDate,
                dep_date_0: departureDate,
                no_days_0: diff.toString(),
                room_type_0: roomType,
                price_night_0: `AUD $ ${price_night}`,
                total_price_0: `AUD $ ${total_price}`,
                continue: "Continue",
                hotel_name: hotelName,
                location_name: location,
                room_types: roomType,
                rooms_no: numRooms,
                arr_date: arrivalDate,
                dep_date: departureDate,
                no_days: diff.toString(),
                adults_room: numAdults,
                children_room: numChildren,
                price_night: `AUD $ ${price_night}`,
                total_price: `AUD $ ${total_price}`
            }
        });

        return response;
    }
}