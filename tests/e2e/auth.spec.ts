import { test, expect } from '@playwright/test';
import { login } from '../helpers/login';

test('Login exitoso', async ({ page }) => {

  await login(page);

  await expect(page).toHaveURL(
    /user\/home/
  );

});