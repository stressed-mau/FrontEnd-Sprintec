import { test } from '@playwright/test';

import { login } from '../helpers/login';
import { registerProject } from '../helpers/registerProject';

test('Registrar proyecto', async ({ page }) => {

  await login(page);

  await registerProject(page);

});