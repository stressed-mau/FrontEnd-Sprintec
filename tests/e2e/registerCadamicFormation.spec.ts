import { test } from '@playwright/test';

import { login } from '../helpers/login';
import { registerAcademicEducation } from '../helpers/registerAcademicFormation';

test('Registrar formación académica', async ({ page }) => {

  await login(page);

  await registerAcademicEducation(page);

});