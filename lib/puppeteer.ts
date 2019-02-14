import { ElementHandle, Page } from "puppeteer";

export async function getTextFromElement(page: Page, element: ElementHandle) {
  return page.evaluate(element => element.textContent, element);
}

export async function getNextElement(page: Page, element: ElementHandle) {
  return page.evaluateHandle(
    element => element.nextElementSibling,
    element
  ) as Promise<ElementHandle>;
}

export async function getElementWithExactText(page: Page, text: string) {
  const elements = await page.$x(`//*[text()='${text}']`);
  if (elements.length) {
    return elements[0];
  }
  return null;
}
