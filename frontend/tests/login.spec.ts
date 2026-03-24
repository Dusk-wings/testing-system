import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';


test('Login Page', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto('login');

    await loginPage.login('jhon@email.com', 'Password123!');

    await expect(page).toHaveURL('http://localhost:5173/dashboard/board');
});

test('Register Page', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto('register');

    await expect(page).toHaveURL('http://localhost:5173/auth/register');

    await loginPage.register('Test User', `test${Date.now()}@email.com`, 'Password123!');

    await expect(page).toHaveURL('http://localhost:5173/dashboard/board');
});