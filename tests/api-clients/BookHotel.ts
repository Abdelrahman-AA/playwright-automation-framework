import { APIRequestContext } from '@playwright/test';
import { endPoints } from '../test-data/testDataYamlReader';
import { getDaysDifference } from './helpers/helpers';

export class BookHotel {
    private request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async bookHotel(
        firstName: string,
        lastName: string,
        address: string,
        cc_num: string,
        cc_type: string,
        cc_exp_month: string,
        cc_exp_year: string,
        cc_cvv: string,
        hotelName: string,
        location: string,
        numRooms: string,
        arrivalDate: string,
        departureDate: string,
        roomType: string,
        price_night: string,
        total_price: string,
        gst: string,
        finalPrice: string,
        numAdults: string,
        numChildren: string) {

        let diff: number = getDaysDifference(arrivalDate, departureDate);

        const response = await this.request.post((endPoints.BookHotel), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            form: {
                first_name: firstName,
                last_name: lastName,
                address: address,
                cc_num: cc_num,
                cc_type: cc_type,
                cc_exp_month: cc_exp_month,
                cc_exp_year: cc_exp_year,
                cc_cvv: cc_cvv,
                hotel_name_hid: hotelName,
                location_name_hid: location,
                room_types_hid: roomType,
                rooms_no_hid: numRooms,
                arr_date_hid: arrivalDate,
                dep_date_hid: departureDate,
                no_days_hid: diff.toString(),
                adults_room_hid: numAdults,
                children_room_hid: numChildren,
                price_night_hid: `AUD $ ${price_night}`,
                total_price_hid: `AUD $ ${total_price}`,
                gst_hid: `AUD $ ${gst}`,
                final_price_hid: `AUD $ ${finalPrice}`
            }
        });

        return response;
    }
}