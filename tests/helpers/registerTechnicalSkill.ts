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

export async function registerTechnicalSkill(page: Page): Promise<void> {

  const skill = `Tecnologia${generateRandomLetters(6)}`;

  await page.getByRole('button', {
    name: 'Habilidades'
  }).click();

  await page.getByRole('link', {
    name: 'Registrar habilidad'
  }).click();

  await page.getByRole('textbox', {
    name: 'Ej: React, Python, JavaScript'
  }).fill(skill);

  await page.getByRole('combobox')
    .nth(1)
    .selectOption('experto');

  await page.getByRole('button', {
    name: 'Registrar'
  }).click();

  await page.getByRole('button', {
    name: 'Continuar'
  }).click();


}