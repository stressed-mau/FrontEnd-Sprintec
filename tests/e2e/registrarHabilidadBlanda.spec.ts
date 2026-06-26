import { test, expect } from '@playwright/test';
import { login } from '../helpers/login';

test('Registrar habilidad blanda', async ({ page }) => {
const randomText = Math.random().toString(36).replace(/[^a-z]/g, '').substring(0, 8);

  const habilidad = `Oratoria QA${randomText}`;

  await login(page);

  await page.getByRole('button', {
    name: 'Habilidades'
  }).click();

  await page.getByRole('link', {
    name: 'Registrar habilidad'
  }).click();

  await page.getByRole('combobox')
    .first()
    .selectOption('blanda');

  await page.getByRole('textbox', {
    name: 'Ej: Trabajo en equipo'
  }).fill(habilidad);

  await page.getByRole('button', {
    name: 'Registrar'
  }).click();

  await page.getByRole('button', {
    name: 'Continuar'
  }).click();

  await page.getByRole('link', {
    name: 'Ver habilidades'
  }).click();

  let encontrada = false;

  while (true) {

    if (await page.getByText(habilidad).count() > 0) {
      encontrada = true;
      break;
    }

    const siguiente = page.getByRole('button', {
      name: 'Siguiente'
    });

    if (!(await siguiente.isVisible())) {
      break;
    }

    if (await siguiente.isDisabled()) {
      break;
    }

    await siguiente.click();

    await page.waitForLoadState('networkidle');
  }

  expect(encontrada).toBeTruthy();

});