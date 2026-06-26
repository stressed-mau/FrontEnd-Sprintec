import { Page } from '@playwright/test';

export async function login(page: Page) {

  await page.goto('http://sprintecsw.tis.cs.umss.edu.bo/');

  await page.getByRole('button', {
    name: 'Iniciar sesión'
  }).click();

  await page.getByRole('textbox', {
    name: 'Tu usuario o correo electró'
  }).fill('mau');

  await page.getByRole('textbox', {
    name: 'Contraseña'
  }).fill('Ayuda123!');

  await page.getByRole('main')
    .getByRole('button', {
      name: 'Iniciar sesión'
    })
    .click();
}