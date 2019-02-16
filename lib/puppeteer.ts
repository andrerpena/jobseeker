import { ElementHandle, FrameBase, Page } from "puppeteer";

export interface Queryable {
  $x(expression: string): Promise<ElementHandle[]>;
}

export async function getTextFromElement(page: Page, element: ElementHandle) {
  return page.evaluate(element => element.textContent, element);
}

export async function getInnerHtmlFromElement(
  page: Page,
  element: ElementHandle
) {
  return (await page.evaluate(element => element.innerHTML, element)).trim();
}

export async function getNextElement(page: Page, element: ElementHandle) {
  return page.evaluateHandle(
    element => element.nextElementSibling,
    element
  ) as Promise<ElementHandle>;
}

export async function getElementWithExactText(
  frameBase: Queryable,
  text: string
) {
  const elements = await frameBase.$x(`//*[text()='${text}']`);
  if (elements.length) {
    return elements[0];
  }
  return null;
}
