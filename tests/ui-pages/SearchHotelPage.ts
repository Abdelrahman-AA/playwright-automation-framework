import { Locator, Page } from "@playwright/test";
import { uiURL } from "../test-data/testDataYamlReader";
import { StaticBarAtLogged } from "./Components/StaticBarAtLogged";

export class SearchHotelPage {

    // #region Components
    readonly staticBar: StaticBarAtLogged;
    // #endregion

    // #region Locators
    private readonly locationSelector: Locator;
    private readonly hotelsSelector: Locator;
    private readonly roomTypeSelector: Locator;
    private readonly numbersOfRoomsSelector: Locator;
    private readonly checkInDateField: Locator;
    private readonly checkOutDateField: Locator;
    private readonly adultPerRoomSelector: Locator;
    private readonly childrenPerRoomSelector: Locator;
    private readonly searchButton: Locator;
    private readonly resetButton: Locator;
    private readonly errorMSGLocationSelector: Locator;
    private readonly errorMSGCheckInDateField: Locator;
    private readonly errorMSGCheckOutDateField: Locator;
    // #endregion

    // #region Constructor
    constructor(public page: Page) {
        this.staticBar = new StaticBarAtLogged(page);

        this.locationSelector = page.locator("#location");
        this.hotelsSelector = page.locator("#hotels");
        this.roomTypeSelector = page.locator("#room_type");
        this.numbersOfRoomsSelector = page.locator("#room_nos");
        this.checkInDateField = page.locator("#datepick_in");
        this.checkOutDateField = page.locator("#datepick_out");
        this.adultPerRoomSelector = page.locator("#adult_room");
        this.childrenPerRoomSelector = page.locator("#child_room");
        this.searchButton = page.locator("#Submit");
        this.resetButton = page.locator("#Reset");

        this.errorMSGLocationSelector = page.locator("#location_span");
        this.errorMSGCheckInDateField = page.locator("#checkin_span");
        this.errorMSGCheckOutDateField = page.locator("#checkout_span");
    }
    // #endregion

    // #region Actions
    async goToSearchPage() {
        await this.page.goto(uiURL.SearchHotelPage);
    }

    async selectLocation(location: string) {
        await this.locationSelector.selectOption({ label: location });
    }

    async selectHotel(hotel: string) {
        await this.hotelsSelector.selectOption({ label: hotel });
    }

    async selectRoomType(roomType: string) {
        await this.roomTypeSelector.selectOption({ label: roomType });
    }

    async selectNumOfRooms(numOfRooms: string) {
        await this.numbersOfRoomsSelector.selectOption({ label: numOfRooms });
    }

    async enterArrivalDate(arrivalDate: string) {
        await this.checkInDateField.clear();
        await this.checkInDateField.fill(arrivalDate);
    }

    async enterDepartureDate(departureDate: string) {
        await this.checkOutDateField.clear();
        await this.checkOutDateField.fill(departureDate);
    }

    async selectNumOfAdults(numOfAdults: string) {
        await this.adultPerRoomSelector.selectOption({ label: numOfAdults });
    }

    async selectNumOfChildren(numOfChildren: string) {
        await this.childrenPerRoomSelector.selectOption({ label: numOfChildren });
    }

    async clickSearchButton() {
        await this.searchButton.click();
    }

    async clickResetButton() {
        await this.resetButton.click();
    }
    // #endregion

    // #region Getters
    async getFormCurrentValues(): Promise<string[]> {
        let currentValues: string[] = [];
        currentValues.push(await this.locationSelector.inputValue());
        currentValues.push(await this.hotelsSelector.inputValue());
        currentValues.push(await this.roomTypeSelector.inputValue());
        currentValues.push(await this.numbersOfRoomsSelector.inputValue());
        currentValues.push(await this.checkInDateField.inputValue());
        currentValues.push(await this.checkOutDateField.inputValue());
        currentValues.push(await this.adultPerRoomSelector.inputValue());
        currentValues.push(await this.childrenPerRoomSelector.inputValue());

        return currentValues;
    }

    getLocationSelectorErrorMSG(): Locator {
        return this.errorMSGLocationSelector;
    }

    getCheckInDateFieldErrorMSG(): Locator {
        return this.errorMSGCheckInDateField;
    }

    getCheckOutDateFieldErrorMSG(): Locator {
        return this.errorMSGCheckOutDateField;
    }
    // #endregion

    // #region Flows
    async selectAndFillDataAndOptionalClickSearch(
        location: string,
        hotel: string,
        roomType: string,
        numOfRooms: string,
        arrivalDate: string,
        departureDate: string,
        numOfAdults: string,
        numOfChildren: string,
        clickSearchButton: boolean = false,
    ) {
        await this.selectLocation(location);
        await this.selectHotel(hotel);
        await this.selectRoomType(roomType);
        await this.selectNumOfRooms(numOfRooms);
        await this.enterArrivalDate(arrivalDate);
        await this.enterDepartureDate(departureDate);
        await this.selectNumOfAdults(numOfAdults);
        await this.selectNumOfChildren(numOfChildren);

        if (clickSearchButton) await this.clickSearchButton();
    }
    // #endregion
}