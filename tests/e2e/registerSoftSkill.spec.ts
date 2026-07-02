import { test } from '@playwright/test';

import { login } from '../helpers/login';
import { registerSoftSkill } from '../helpers/registerSoftSkill';

test('Registrar habilidad blanda', async ({ page }) => {

  await login(page);

  await registerSoftSkill(page);

});