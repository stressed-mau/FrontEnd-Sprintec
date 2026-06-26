import { test, expect } from '@playwright/test';
import { login } from '../helpers/login';

test('Registrar habilidad técnica', async ({ page }) => {

  const timestamp = Date.now();

  const habilidad = `Tecnologia ${timestamp}`;

  await login(page);

  await page.getByRole('button', {
    name: 'Habilidades'
  }).click();

  await page.getByRole('link', {
    name: 'Registrar habilidad'
  }).click();

  await page.getByRole('textbox', {
    name: 'Ej: React, Python, JavaScript'
  }).fill(habilidad);

  await page.getByRole('combobox')
    .nth(1)
    .selectOption('experto');

  await page.getByRole('button', {
    name: 'Registrar'
  }).click();

  await page.getByRole('button', {
    name: 'Continuar'
  }).click();

    // Ir a listado
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