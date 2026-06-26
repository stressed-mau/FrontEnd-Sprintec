import { test, expect } from '@playwright/test';
import { login } from '../helpers/login';

test('Registrar experiencia laboral', async ({ page }) => {

  const timestamp = Date.now();

  const empresa = `SoftwareFR ${timestamp}`;
  const correoEmpresa = `empresa${timestamp}@gmail.com`;

  await login(page);

  await page.getByRole('button', {
    name: 'Experiencia Laboral'
  }).click();

  await page.getByRole('link', {
    name: 'Registrar Experiencia Laboral'
  }).click();

  await page.getByRole('textbox', {
    name: 'Empresa',
    exact: true
  }).fill(empresa);

  // Si el selector del cargo da problemas,
  // vuelve a grabar solo esta parte con codegen
  await page.getByText('QA Engineer').click();

  await page.getByRole('textbox', {
    name: 'Descripción'
  }).fill('Encargado de procesos de aseguramiento de calidad.');

  await page.getByRole('textbox', {
    name: 'Ubicación'
  }).fill('Cochabamba');

  await page.getByRole('textbox', {
    name: 'Correo electrónico de la'
  }).fill(correoEmpresa);

  await page.getByRole('checkbox', {
    name: 'Trabajo actual'
  }).check();

  await page.getByRole('textbox', {
    name: 'Fecha de inicio'
  }).fill('2026-06-01');

  await page.getByLabel('Logo de la empresa')
    .setInputFiles('tests/assets/company-logo.jpg');

  await page.getByRole('button', {
    name: 'Registrar'
  }).click();

  await page.getByRole('button', {
    name: 'Aceptar'
  }).click();

  // Validación simple de éxito
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