import { test, expect } from '@playwright/test';
import { login } from '../helpers/login';

test('Registrar proyecto', async ({ page }) => {

  const timestamp = Date.now();

  await login(page);

  await page.getByRole('button', {
    name: 'Proyectos'
  }).click();

  await page.getByRole('link', {
    name: 'Registrar proyecto'
  }).click();

  await page.locator('#base-ui-_r_2_').fill(
    `Proyecto QA ${timestamp}`
  );

  await page.getByRole('textbox', {
    name: 'Busca y selecciona'
  }).first().click();

  await page.getByRole('textbox', {
    name: 'Busca y selecciona'
  }).first().fill('QA');

  await page.getByText('QA Engineer').click();

  await page.getByRole('textbox', {
    name: 'Busca y selecciona'
  }).nth(1).fill('javas');

  await page.getByText('JavaScript').click();

  await page.getByRole('textbox', {
    name: 'Busca y selecciona'
  }).nth(1).fill('node');

  await page.getByText('Node.js').click();

  await page.getByRole('textbox', {
    name: 'Busca y selecciona'
  }).nth(1).fill('react');

  await page.getByText('React Native').click();


  await page.locator('textarea').fill(
    'Proyecto generado automáticamente mediante Playwright.'
  );

  await page.locator('#base-ui-_r_5_')
    .fill('2026-06-01');

  await page.locator('#base-ui-_r_6_')
    .fill('2026-06-21');

  await page.getByPlaceholder(
    'https://github.com/usuario/proyecto'
  ).fill(
    'https://github.com/stressed-mau/Parkado.git'
  );

  await page
    .getByLabel('Seleccionar archivo')
    .setInputFiles('tests/assets/project.jpg');

  await page.getByRole('button', {
    name: 'Registrar'
  }).click();

  await page.getByRole('button', {
    name: 'Continuar'
  }).click();

  await page.getByRole('link', {
    name: 'Ver proyectos'
  }).click();

  await expect(
    page.getByText(`Proyecto QA ${timestamp}`)
  ).toBeVisible();

});