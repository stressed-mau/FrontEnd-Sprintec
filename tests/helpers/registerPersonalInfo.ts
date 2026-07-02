import { Page, expect } from '@playwright/test';

export async function registerPersonalInfo(
  page: Page,
  user: { email: string }
) {

  const nombreCompleto = 'QA Usuario';
  const ocupacion = 'QA Tester';
  const telefono = String(
  Math.floor(Math.random() * 10000000) + 70000000
);

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

  // Foto de perfil
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

}