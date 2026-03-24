import test, { expect } from "@playwright/test";
import { BoardPage } from "../pages/board.page";

test.use({
    storageState: 'playwright/.auth/user.json'
});

const BOARD_NAME = 'New Board';

test('Card Movement', async ({ page }) => {
    const board = new BoardPage(page);

    await board.goto();
    await board.getInBoard(BOARD_NAME);

    await expect(page).toHaveURL(/\/dashboard\/board/);
    await expect(page.getByText(BOARD_NAME)).toBeVisible();

    const firstListName = 'First List';
    await board.createList(firstListName);

    await expect(page.getByTestId(firstListName)).toBeVisible();

    const secondListName = 'Second List';
    await board.createList(secondListName);

    await expect(page.getByTestId(secondListName)).toBeVisible();

    const cardTitle = 'New Card';
    const cardDescription = 'New Card Description';
    await board.createCard(cardTitle, cardDescription, firstListName);

    await expect(page.getByTestId(firstListName).getByTestId(`task-${cardTitle}`)).toBeVisible();

    await board.moveCard(cardTitle, firstListName, 'right');
    await expect(page.getByTestId(secondListName).getByTestId(`task-${cardTitle}`)).toBeVisible();

    await board.moveCard(cardTitle, secondListName, 'left');
    await expect(page.getByTestId(firstListName).getByTestId(`task-${cardTitle}`)).toBeVisible();

    const secondCardTitle = 'Second Card';
    const secondCardDescription = 'Second Card Description';
    await board.createCard(secondCardTitle, secondCardDescription, firstListName);

    await expect(page.getByTestId(firstListName).getByTestId(`task-${secondCardTitle}`)).toBeVisible();

    await board.moveCard(secondCardTitle, firstListName, 'up');
    await expect(page.getByTestId(firstListName).getByTestId(`task-${secondCardTitle}`)).toBeVisible();

    const list = page.getByTestId(firstListName);
    const firstCard = list.locator('[data-testid^="task-"]').first();

    await expect(firstCard).toHaveAttribute('data-testid', `task-${secondCardTitle}`);

    await board.moveCard(secondCardTitle, firstListName, 'down');
    await expect(page.getByTestId(firstListName).getByTestId(`task-${secondCardTitle}`)).toBeVisible();

    await expect(firstCard).toHaveAttribute('data-testid', `task-${cardTitle}`);

    await board.deleteCard(cardTitle, firstListName);
    await expect(page.getByTestId(firstListName).getByTestId(`task-${cardTitle}`)).toBeHidden();

    await board.deleteCard(secondCardTitle, firstListName);
    await expect(page.getByTestId(firstListName).getByTestId(`task-${secondCardTitle}`)).toBeHidden();

    await board.deleteList(firstListName);
    await expect(page.getByTestId(firstListName)).toBeHidden();

    await board.deleteList(secondListName);
    await expect(page.getByTestId(secondListName)).toBeHidden();
})