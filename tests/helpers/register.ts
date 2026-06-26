import { Page } from '@playwright/test';

export async function register(page: Page) {

  const timestamp = Date.now();

  const username = `qa${timestamp}`;
  const email = `qa${timestamp}@gmail.com`;
  const password = 'Ayuda123!';

  await page.goto('http://sprintecsw.tis.cs.umss.edu.bo/');

  await page.getByRole('button', {
    name: 'Registrarse'
  }).click();

  await page.getByRole('textbox', {
    name: 'Nombre de usuario'
  }).fill(username);

  await page.getByRole('textbox', {
    name: 'Correo electrónico'
  }).fill(email);

  await page.getByRole('textbox', {
    name: 'Contraseña',
    exact: true
  }).fill(password);

  await page.getByRole('textbox', {
    name: 'Confirmar contraseña'
  }).fill(password);

  await page.getByRole('button', {
    name: 'Crear cuenta'
  }).click();

  await page.getByRole('button', {
    name: 'Continuar'
  }).click();

  return {
    username,
    email,
    password
  };
}