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

export async function registerSoftSkill(page: Page): Promise<void> {

  const skill = `Oratoria${generateRandomLetters(6)}`;

  await page.getByRole('button', {
    name: 'Habilidades'
  }).click();

  await page.getByRole('link', {
    name: 'Registrar habilidad'
  }).click();

  // Tipo de habilidad
  await page.getByRole('combobox')
    .first()
    .selectOption('blanda');

  // Nombre
  await page.getByRole('textbox', {
    name: 'Ej: Trabajo en equipo'
  }).fill(skill);

  // Registrar
  await page.getByRole('button', {
    name: 'Registrar'
  }).click();

  await page.getByRole('button', {
    name: 'Continuar'
  }).click();

 
}