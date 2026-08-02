import { Locator, Page } from "@playwright/test";
import { uiURL } from "../test-data/testDataYamlReader";
import { StaticBarAtLogged } from "./Components/StaticBarAtLogged";

export class SelectHotelPage {

    // #region Components
    readonly staticBar: StaticBarAtLogged;
    // #endregion

    // #region Locators
    private readonly resultTable: Locator;
    private readonly tableRadio: Locator;

    private getRadioButtons(rowNum: number) {
        return this.page.locator(`#radiobutton_${rowNum}`)
    };

    private getTableHotelNames(rowNum: number) {
        return this.page.locator(`#hotel_name_${rowNum}`)
    };

    private getTableLocations(rowNum: number) {
        return this.page.locator(`#location_${rowNum}`)
    };

    private getTableNumOfRooms(rowNum: number) {
        return this.page.locator(`#rooms_${rowNum}`)
    };

    private getTableArrivalDates(rowNum: number) {
        return this.page.locator(`#arr_date_${rowNum}`)
    };

    private getTableDepartureDates(rowNum: number) {
        return this.page.locator(`#dep_date_${rowNum}`)
    };

    private getTableNumOfDays(rowNum: number) {
        return this.page.locator(`#no_days_${rowNum}`)
    };

    private getTableRoomTypes(rowNum: number) {
        return this.page.locator(`#room_type_${rowNum}`)
    };

    private getTablePricesPerNight(rowNum: number) {
        return this.page.locator(`#price_night_${rowNum}`)
    };

    private getTableTotalPrices(rowNum: number) {
        return this.page.locator(`#total_price_${rowNum}`)
    };

    private readonly continueButton: Locator;
    private readonly cancelButton: Locator;
    private readonly errorMSGContinue: Locator;
    // #endregion

    // #region Constructor
    constructor(public page: Page) {
        this.staticBar = new StaticBarAtLogged(page);

        this.resultTable = page.locator("//td[@align='right']//table");
        this.tableRadio = page.locator("input[type='radio']");
        this.continueButton = page.locator("#continue");
        this.cancelButton = page.locator("#cancel");

        this.errorMSGContinue = page.locator("#radiobutton_span");
    }
    // #endregion

    // #region Actions
    async selectRadioOptionByIndex(index: number) {
        await this.getRadioButtons(index).click();
    }

    async clickContinueButton() {
        await this.continueButton.click();
    }

    async clickCancelButton() {
        await this.cancelButton.click();
    }
    // #endregion

    // #region Getters
    getResultTable(): Locator {
        return this.resultTable;
    }

    async getResultTableRowsCount(): Promise<number> {
        const count = await this.tableRadio.count();
        return count;
    }

    async getTableHotelsNameResult(): Promise<string[]> {
        let hotels: string[] = [];
        let rawsCount: number = await this.getResultTableRowsCount();
        for (let i: number = 0; i < rawsCount; i++) {
            hotels.push(await this.getTableHotelNames(i).inputValue());
        }
        return hotels;
    }

    async getTableLocationsResult(): Promise<string[]> {
        let locations: string[] = [];
        let rawsCount: number = await this.getResultTableRowsCount();
        for (let i: number = 0; i < rawsCount; i++) {
            locations.push(await this.getTableLocations(i).inputValue());
        }
        return locations;
    }

    async getTableNumOfRoomsResult(): Promise<string[]> {
        let numOfRooms: string[] = [];
        let rawsCount: number = await this.getResultTableRowsCount();
        for (let i: number = 0; i < rawsCount; i++) {
            numOfRooms.push((await this.getTableNumOfRooms(i).inputValue()).split(" ")[0].trim());
        }
        return numOfRooms;
    }

    async getTableArrivalDatesResult(): Promise<string[]> {
        let arrDates: string[] = [];
        let rawsCount: number = await this.getResultTableRowsCount();
        for (let i: number = 0; i < rawsCount; i++) {
            arrDates.push(await this.getTableArrivalDates(i).inputValue());
        }
        return arrDates;
    }

    async getTableDepartureDatesResult(): Promise<string[]> {
        let depDates: string[] = [];
        let rawsCount: number = await this.getResultTableRowsCount();
        for (let i: number = 0; i < rawsCount; i++) {
            depDates.push(await this.getTableDepartureDates(i).inputValue());
        }
        return depDates;
    }

    async getTableNumOfDaysResult(): Promise<string[]> {
        let numOfDays: string[] = [];
        let rawsCount: number = await this.getResultTableRowsCount();
        for (let i: number = 0; i < rawsCount; i++) {
            numOfDays.push((await this.getTableNumOfDays(i).inputValue()).split(" ")[0].trim());
        }
        return numOfDays;
    }

    async getTableRoomTypesResult(): Promise<string[]> {
        let roomTypes: string[] = [];
        let rawsCount: number = await this.getResultTableRowsCount();
        for (let i: number = 0; i < rawsCount; i++) {
            roomTypes.push(await this.getTableRoomTypes(i).inputValue());
        }
        return roomTypes;
    }

    async getTablePricesPerNightResult(): Promise<string[]> {
        let pricesPerNight: string[] = [];
        let rawsCount: number = await this.getResultTableRowsCount();
        for (let i: number = 0; i < rawsCount; i++) {
            pricesPerNight.push(await this.getTablePricesPerNight(i).inputValue());
        }
        return pricesPerNight;
    }

    async getTableTotalPricesResult(): Promise<string[]> {
        let totalPrices: string[] = [];
        let rawsCount: number = await this.getResultTableRowsCount();
        for (let i: number = 0; i < rawsCount; i++) {
            totalPrices.push(await this.getTableTotalPrices(i).inputValue());
        }
        return totalPrices;
    }

    getContinueErrorMSG(): Locator {
        return this.errorMSGContinue;
    }
    // #endregion

    // #region Flows
    async selectRadioIndexAndClickContinue(index: number) {
        await this.selectRadioOptionByIndex(index);
        await this.clickContinueButton();
    }
    // #endregion

}