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

export async function registerAcademicEducation(page: Page): Promise<void> {

  const institution = `Universidad${generateRandomLetters(6)}`;

  await page.getByRole('button', {
    name: 'Formación Académica'
  }).click();

  await page.getByRole('link', {
    name: 'Registrar Formación Académica'
  }).click();

  // Institución
  await page.getByRole('textbox', {
    name: 'Institucion academica'
  }).fill(institution);

  // Nivel de formación
  await page.getByRole('textbox', {
    name: 'Nivel de formacion'
  }).fill('lic');

  await page.getByText('Licenciatura').click();

  // Área de estudio
  await page.getByRole('textbox', {
    name: 'Area de estudio'
  }).fill('ingeni');

  await page.getByText('Ingenieria de Sistemas').click();

  // Descripción
  await page.getByRole('textbox', {
    name: 'Descripcion'
  }).fill('Licenciatura en Ingeniería de Sistemas.');

  // Estado
  await page.getByRole('checkbox', {
    name: 'Cursando actualmente'
  }).check();

  // Documento
  await page.getByLabel('Documento de formacion')
    .setInputFiles('tests/assets/education-document.png');

  // Registrar
  await page.getByRole('button', {
    name: 'Registrar'
  }).click();

  await page.getByRole('button', {
    name: 'Aceptar'
  }).click();

  

}