import { test } from '@playwright/test';

import { login } from '../helpers/login';
import { registerTechnicalSkill } from '../helpers/registerTechnicalSkill';

test('Registrar habilidad técnica', async ({ page }) => {

  await login(page);

  await registerTechnicalSkill(page);

});