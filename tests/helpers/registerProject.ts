import { Page } from '@playwright/test';

export async function registerProject(page: Page): Promise<void> {

  const timestamp = Date.now();
  const projectName = `Proyecto QA ${timestamp}`;

  await page.getByRole('button', {
    name: 'Proyectos'
  }).click();

  await page.getByRole('link', {
    name: 'Registrar proyecto'
  }).click();

  await page.waitForLoadState('networkidle');

  // Nombre del proyecto
  await page.locator('#base-ui-_r_2_').click();
  await page.locator('#base-ui-_r_2_').fill(projectName);

  // Rol
  const roleInput = page.getByRole('textbox', {
    name: 'Busca y selecciona'
  }).first();

  await roleInput.click();
  await roleInput.fill('QA');
  await page.getByText('QA Engineer').click();

  // Tecnologías
  const techInput = page.getByRole('textbox', {
    name: 'Busca y selecciona'
  }).nth(1);

  await techInput.click();
  await techInput.fill('javas');
  await page.getByText('JavaScript').click();

  await techInput.fill('node');
  await page.getByText('Node.js').click();

  await techInput.fill('react');
  await page.getByText('React Native').click();

  // Descripción
  await page.locator('textarea').fill(
    'Proyecto generado automáticamente mediante Playwright.'
  );

  // Fechas
  await page.locator('#base-ui-_r_5_').fill('2026-06-01');
  await page.locator('#base-ui-_r_6_').fill('2026-06-21');

  // GitHub
  await page.getByPlaceholder(
    'https://github.com/usuario/proyecto'
  ).fill(
    'https://github.com/stressed-mau/Parkado.git'
  );

  // Imagen
  await page.getByLabel('Seleccionar archivo')
    .setInputFiles('tests/assets/project.jpg');

  // Registrar
  await page.getByRole('button', {
    name: 'Registrar'
  }).click();

  await page.getByRole('button', {
    name: 'Continuar'
  }).click();

  // Ir al listado
  await page.getByRole('link', {
    name: 'Ver proyectos'
  }).click();
}