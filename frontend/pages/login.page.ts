import { Page } from "@playwright/test";

export class LoginPage {
    constructor(private page: Page) { }

    async goto(arg: 'login' | 'register') {
        await this.page.goto(`/auth/${arg}`);
    }

    async login(email: string, password: string) {
        await this.page.getByRole('textbox', { name: 'Email' }).fill(email);
        await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
        await this.page.getByRole('button', { name: 'Login' }).click();
    }

    async register(name: string, email: string, password: string) {
        await this.page.getByRole('textbox', { name: 'Name' }).fill(name);
        await this.page.getByRole('textbox', { name: 'Email' }).fill(email);
        await this.page.getByRole('textbox', { name: 'Password', exact: true }).fill(password);
        await this.page.getByRole('textbox', { name: 'Confirm Password' }).fill(password);
        await this.page.getByRole('button', { name: 'Register' }).click();
    }
}