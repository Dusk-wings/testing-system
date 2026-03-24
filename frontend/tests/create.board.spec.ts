import test, { expect } from "@playwright/test";
import { BoardPage } from "../pages/board.page";

test.use({
    storageState: 'playwright/.auth/user.json'
});

test('Create Board', async ({ page }) => {
    const board = new BoardPage(page);

    await board.goto();

    const boardName = 'Test Board'

    await board.createBoard(boardName, 'Test Description', 'Public');

    await expect(page).toHaveURL('http://localhost:5173/dashboard/board');

    await expect(page.getByText('Boards')).toBeVisible()

    await board.deleteBoard(boardName);

    await expect(page.getByTestId(boardName)).toBeHidden();
})