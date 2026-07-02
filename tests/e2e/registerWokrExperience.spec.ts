import { test } from '@playwright/test';

import { login } from '../helpers/login';
import { registerWorkExperience } from '../helpers/registerWorkExperience';

test('Registrar experiencia laboral', async ({ page }) => {

  await login(page);

  await registerWorkExperience(page);

});