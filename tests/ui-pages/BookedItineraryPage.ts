import { Locator, Page } from "@playwright/test";
import { StaticBarAtLogged } from "./Components/StaticBarAtLogged";
import { uiURL } from "../test-data/testDataYamlReader";

export class BookedItineraryPage {

    // #region Components
    readonly staticBar: StaticBarAtLogged;
    // #endregion

    // #region Locators
    private readonly searchOrderField: Locator;
    private readonly searchOrderGoButton: Locator;
    private readonly itineraryTable: Locator;
    private readonly tableCheckBoxSelectAll: Locator;

    private getTableCheckBoxForRows(id: string) {
        return this.page.locator(`input[value='${id}']`);
    };

    private getTableRowsCancelButton(id: string) {
        return this.page.locator(`btn_id_${id}`);
    };

    private readonly tableRowsIds: Locator;
    private readonly cancelSelectedButton: Locator;
    private readonly searchHotelButton: Locator;
    private readonly logoutButton: Locator;
    private readonly searchResultMsg: Locator;
    private readonly showAllAfterSearch: Locator;
    // #endregion

    // #region Constructor
    constructor(public page: Page) {
        this.staticBar = new StaticBarAtLogged(page);

        this.searchOrderField = page.locator("#order_id_text");
        this.searchOrderGoButton = page.locator("#search_hotel_id");
        this.itineraryTable = page.locator("td[align='right'] table");
        this.tableCheckBoxSelectAll = page.locator("#check_all");

        this.tableRowsIds = page.locator("//input[@name='ids[]']");
        this.cancelSelectedButton = page.locator("input[value='Cancel Selected']");
        this.searchHotelButton = page.locator("//input[@id='search_hotel']");
        this.logoutButton = page.locator("#logout");
        this.searchResultMsg = page.locator("#search_result_error");
        this.showAllAfterSearch = page.locator("//a[normalize-space()='Show all']");
    }
    // #endregion

    // #region Actions
    async goToBooKItineraryPage() {
        await this.page.goto(uiURL.BookedItineraryPage);
    }

    async enterOrderIdAtSearch(orderId: string) {
        await this.searchOrderField.clear();
        await this.searchOrderField.fill(orderId);
    }

    async clickSearchOrderButton() {
        await this.searchOrderGoButton.click();
    }

    async checkToSelectAllBookedOrders() {
        await this.tableCheckBoxSelectAll.click();
    }

    async checkSelectBookedOrderByTableIndex(index: string) {
        const ids = await this.getTableRowsIDs();
        await this.getTableCheckBoxForRows(ids[+index]).click();
    }

    async clickCancelButtonToBookedOrderAtTableByTableIndex(index: string) {
        const ids = await this.getTableRowsIDs();
        await this.getTableRowsCancelButton(ids[+index]).click();
    }

    async clickCancelSelectedBookedOrders() {
        await this.cancelSelectedButton.click();
    }

    async clickSearchHotelButton() {
        await this.searchHotelButton.click();
    }

    async clickLogoutButton() {
        await this.logoutButton.click();
    }

    async clickShowAllAfterSearch() {
        await this.showAllAfterSearch.click();
    }
    // #endregion

    // #region Getters
    getTableResult(){
        return this.itineraryTable;
    }

    async getTableRowsIDs(): Promise<string[]> {
        await this.tableRowsIds.first().waitFor({ state: 'visible' });
        return await this.tableRowsIds.evaluateAll((elements) =>
            elements.map((el) => el.getAttribute('value') || '')
        );
    }

    async getTableRowsCount():Promise<number> {
    return await this.tableRowsIds.count();
}

    getSearchResultMsg(): Locator {
        return this.searchResultMsg;
    }
    // #endregion

    // #region Flows
    async searchBookedOrderByOrderID(orderId: string) {
        await this.enterOrderIdAtSearch(orderId);
        await this.clickSearchOrderButton();
    }

    async cancelBookedOrderIdByOrderId(orderId: string) {
        await this.searchBookedOrderByOrderID(orderId);
        await this.clickCancelButtonToBookedOrderAtTableByTableIndex("0");
    }

    async cancelAllBookedOrders() {
        await this.checkToSelectAllBookedOrders();
        await this.clickCancelSelectedBookedOrders();
    }
    // #endregion
}