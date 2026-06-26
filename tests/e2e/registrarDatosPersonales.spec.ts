import { test, expect } from '@playwright/test';
import { register } from '../helpers/register';

test('Registrar datos personales', async ({ page }) => {

  const user = await register(page);

  const timestamp = Date.now();

  const nombreCompleto = `QA Usuario`;
  const ocupacion = `QA Tester`;
  const telefono = `7${Math.floor(Math.random() * 10000000)}`;

  await page.goto('http://sprintecsw.tis.cs.umss.edu.bo/user/home');

  await page.getByRole('button', {
    name: 'Datos personales'
  }).click();

  await page
    .locator('#userhome-main')
    .getByRole('link', {
      name: 'Registrar datos personales'
    })
    .click();

  await page.getByRole('textbox', {
    name: 'Nombre completo *'
  }).fill(nombreCompleto);

  await page.getByRole('textbox', {
    name: 'Ocupación'
  }).fill(ocupacion);

  await page.getByRole('textbox', {
    name: 'Residencia actual'
  }).fill('Cochabamba');

  await page.getByRole('textbox', {
    name: 'Cuéntanos sobre ti y tu'
  }).fill('Perfil generado automáticamente mediante Playwright.');

  await page.getByRole('textbox', {
    name: 'Correo electrónico público *'
  }).fill(user.email);

  await page.getByRole('textbox', {
    name: 'Numero de contacto *'
  }).fill(telefono);

  // Imagen obligatoria
  await page
    .locator('input[type="file"]')
    .setInputFiles('tests/assets/profile.jpg');

  await page.getByRole('button', {
    name: 'Registrar'
  }).click();

  await page.getByRole('button', {
    name: 'Aceptar'
  }).click();

  await page.getByRole('button', {
    name: 'Continuar'
  }).click();

  await expect(page).toHaveURL(/personal\/ver/);

});