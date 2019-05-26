import puppeteer, { ElementHandle, Request } from "puppeteer";
import {
  getElementWithExactText,
  getNextElement,
  getTextFromElement,
  launchPuppeteer
} from "./src/puppeteer";

const html = `
<html>
    <head></head>
    <body>
        <div>
            <div class="item">item 1</div>
            <div class="item">item 2</div>
            <div class="item">item 3</div>
        </div>
    </body>
</html>`;

(async () => {
  const browser = await launchPuppeteer();
  const page = await browser.newPage();
  await page.goto(`data:text/html,${html}`);

  const element = await getElementWithExactText(page, "item 1");
  if (element) {
    const element2 = await getNextElement(page, element);
    if (element) {
      console.log(await getTextFromElement(page, element2));
    }
  }

  // const linkHandlers = await page.$x("//div[contains(text(), 'item 1')]");
  // const content = await getTextFromElement(page, linkHandlers[0]);
  // const nextElement = await getNextElement(page, linkHandlers[0]) as ElementHandle;
  // console.log(await getTextFromElement(page, nextElement)); // item 3

  // const last = await page.$x('.item:last-child');
  const last = await page.$(".item:last-child");
  // const prev = await page.evaluateHandle(el => el.previousElementSibling, last);
  //
  // console.log(await (await last!.getProperty('innerHTML')).jsonValue()); // item 3
  // console.log(await (await prev.getProperty('innerHTML')).jsonValue()); // item 2

  await browser.close();
})();
