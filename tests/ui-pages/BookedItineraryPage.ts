import { Locator, Page } from "@playwright/test";

export class BookedItineraryPage {

    // #region Locators
    private readonly searchOrderField: Locator;
    private readonly searchOrderGoButton: Locator;
    private readonly itineraryTable: Locator;
    private readonly tableCheckBoxSelectAll: Locator;

    private getTableCheckBoxForRows(id: string) {
        return this.page.locator(`input[value='${id}']`);
    }

    private getTableRowsCancelButton(id: string) {
        return this.page.locator(`btn_id_${id}`);
    }

    private readonly tableRowsIds: Locator;
    private readonly cancelSelectedButton: Locator;
    private readonly searchHotelButton: Locator;
    private readonly logoutButton: Locator;
    private readonly searchResultMsg: Locator;
    private readonly showAllAfterSearch: Locator;

    // #endregion

    // #region Constructor
    constructor(public page: Page) {
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
}