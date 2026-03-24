import { test as setup } from "@playwright/test";
import { LoginPage } from "../pages/login.page";

setup('authenticate', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto('login');
    await loginPage.login('jhon@email.com', 'Password123!');

    await page.getByTestId('create-board').waitFor({ state: 'visible' });

    await page.context().storageState({ path: 'playwright/.auth/user.json' })
})