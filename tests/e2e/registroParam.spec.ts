import { test, expect } from '@playwright/test';

test('Registro exitoso de usuario', async ({ page }) => {
const timestamp = Date.now();
  await page.goto('http://sprintecsw.tis.cs.umss.edu.bo/');

  await page.getByRole('button', {
    name: 'Registrarse'
  }).click();

await page.getByRole('textbox', {
  name: 'Nombre de usuario'
}).fill(`developer${timestamp}`);

await page.getByRole('textbox', {
  name: 'Correo electrónico'
}).fill(`developer${timestamp}@gmail.com`);

  await page.getByRole('textbox', {
    name: 'Contraseña',
    exact: true
  }).fill('Ayuda123!');

  await page.getByRole('textbox', {
    name: 'Confirmar contraseña'
  }).fill('Ayuda123!');

  await page.getByRole('button', {
    name: 'Crear cuenta'
  }).click();

  await page.getByRole('button', {
    name: 'Continuar'
  }).click();

});