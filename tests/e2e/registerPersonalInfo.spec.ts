import { test } from '@playwright/test';

import { register } from '../helpers/register';
import { registerPersonalInfo } from '../helpers/registerPersonalInfo';

test('Registrar datos personales', async ({ page }) => {

  const user = await register(page);

  await registerPersonalInfo(page, user);

});