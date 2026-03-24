import { Page } from "@playwright/test";

export class BoardPage {
    constructor(private page: Page) { }

    async goto() {
        await this.page.goto('/dashboard/board');
    }

    async createBoard(boardName: string, description: string, visiblity: 'Public' | 'Private') {
        await this.page.getByTestId('create-board').click();
        await this.page.getByRole('textbox', { name: 'Title' }).click();
        await this.page.getByRole('textbox', { name: 'Title' }).fill(boardName);
        await this.page.getByRole('textbox', { name: 'Description' }).click();
        await this.page.getByRole('textbox', { name: 'Description' }).fill(description);
        await this.page.getByRole('radio', { name: visiblity }).check();
        await this.page.getByRole('button', { name: 'form-operation-button' }).click();
    }

    async deleteBoard(boardName: string) {
        await this.page.getByTestId(`delete-board-${boardName}`).click();
        await this.page.getByRole('button', { name: 'form-operation-button' }).click();
    }

    async getInBoard(boardName: string) {
        await this.page.getByTestId(boardName).getByRole('button', { name: 'Open' }).click();
        await this.page.waitForURL('**/dashboard/board/**');
    }

    async createList(listTitle: string) {
        await this.page.getByTestId('create-list').click();
        await this.page.getByRole('textbox', { name: 'Title' }).fill(listTitle);
        await this.page.getByRole('button', { name: 'form-operation-button' }).click();
    }

    async deleteList(listTitle: string) {
        await this.page.getByTestId(listTitle).getByRole('button', { name: 'options' }).click();
        await this.page.getByRole('button', { name: 'delete' }).click();
        await this.page.getByRole('button', { name: 'form-operation-button' }).click();
    }

    async createCard(cardTitle: string, cardDescription: string, listTitle: string) {
        await this.page.getByTestId(listTitle).getByTestId('add-card').click();
        await this.page.getByRole('textbox', { name: 'Title' }).fill(cardTitle);
        await this.page.getByRole('textbox', { name: 'Description' }).click();
        await this.page.getByRole('textbox', { name: 'Description' }).fill(cardDescription);
        await this.page.getByRole('textbox', { name: 'Deadline' }).fill('2026-03-27');
        await this.page.getByRole('button', { name: 'form-operation-button' }).click();
    }

    async deleteCard(cardTitle: string, listTitle: string) {
        await this.page.getByTestId(listTitle).getByTestId(`task-${cardTitle}`).getByRole('button', { name: 'delete-card' }).click();
        await this.page.getByRole('button', { name: 'form-operation-button' }).click();
    }

    async moveCard(cardTitle: string, listTitle: string, direction: 'right' | 'left' | 'up' | 'down') {
        await this.page.getByTestId(listTitle).getByTestId(`task-${cardTitle}`).getByRole('button', { name: 'options' }).click();
        await this.page.getByRole('button', { name: direction }).click();
    }
}