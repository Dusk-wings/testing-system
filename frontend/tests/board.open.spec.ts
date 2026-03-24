import test, { expect } from "@playwright/test";
import { BoardPage } from "../pages/board.page";

test.use({
    storageState: 'playwright/.auth/user.json'
});

const BOARD_NAME = 'THIS BOARD FOR OPENING';

test('Open Board', async ({ page }) => {
    const board = new BoardPage(page);

    await board.goto();
    await board.createBoard(BOARD_NAME, 'Board Description', 'Public');
    await board.getInBoard(BOARD_NAME);

    await expect(page).toHaveURL(/\/dashboard\/board/);
    await expect(page.getByText(BOARD_NAME)).toBeVisible();

    await page.goto('/dashboard/board');
    await board.deleteBoard(BOARD_NAME);
});