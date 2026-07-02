import { Page, expect } from '@playwright/test';

function generateRandomLetters(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
  }

  return result;
}

export async function registerWorkExperience(page: Page): Promise<void> {

  const empresa = `Software${generateRandomLetters(6)}`;
  const correoEmpresa = `${generateRandomLetters(8)}@gmail.com`;

  await page.getByRole('button', {
    name: 'Experiencia Laboral'
  }).click();

  await page.getByRole('link', {
    name: 'Registrar Experiencia Laboral'
  }).click();

  // Empresa
  await page.getByRole('textbox', {
    name: 'Empresa',
    exact: true
  }).fill(empresa);

  // Cargo
  await page.getByRole('textbox', {
    name: 'Cargo'
  }).click();

  await page.getByRole('textbox', {
    name: 'Cargo'
  }).fill('QA');

  await page.getByText('QA Engineer').click();

  // Descripción
  await page.getByRole('textbox', {
    name: 'Descripción'
  }).fill(
    'Encargado de procesos de aseguramiento de calidad.'
  );

  // Ubicación
  await page.getByRole('textbox', {
    name: 'Ubicación'
  }).fill('Cochabamba');

  // Correo
  await page.getByRole('textbox', {
    name: 'Correo electrónico de la'
  }).fill(correoEmpresa);

  // Trabajo actual
  await page.getByRole('checkbox', {
    name: 'Trabajo actual'
  }).check();

  // Fecha
  await page.getByRole('textbox', {
    name: 'Fecha de inicio'
  }).fill('2026-06-01');

  // Logo
  await page.getByLabel('Logo de la empresa')
    .setInputFiles('tests/assets/company-logo.jpg');

  // Registrar
  await page.getByRole('button', {
    name: 'Registrar'
  }).click();

  await page.getByRole('button', {
    name: 'Aceptar'
  }).click();

 

}