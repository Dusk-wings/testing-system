import test, { expect } from "@playwright/test";
import { BoardPage } from "../pages/board.page";


test.use({
    storageState: 'playwright/.auth/user.json'
});

const BOARD_NAME = 'THIS BOARD FOR LIST CREATION';

test('Create List', async ({ page }) => {
    const board = new BoardPage(page);
    await board.goto();
    await board.createBoard(BOARD_NAME, 'Board Description', 'Public');
    await board.getInBoard(BOARD_NAME);

    await expect(page).toHaveURL(/\/dashboard\/board/);
    await expect(page.getByText(BOARD_NAME)).toBeVisible();
    const listName = 'New List';
    await board.createList(listName);

    await expect(page.getByTestId(listName)).toBeVisible();

    await board.deleteList(listName);
    await expect(page.getByTestId(listName)).toBeHidden();

    await page.goto('/dashboard/board');
    await board.deleteBoard(BOARD_NAME);

})