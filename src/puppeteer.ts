import { ElementHandle, Page } from "puppeteer";
import puppeteer from "puppeteer";

export interface QueryableXPath {
  $x(expression: string): Promise<ElementHandle[]>;
}

export interface Queryable {
  $(selector: string): Promise<ElementHandle | null>;

  $$(selector: string): Promise<ElementHandle[]>;
}

export async function getTextFromElement(
  page: Page,
  element: ElementHandle | null
) {
  return page.evaluate(element => element.innerText, element);
}

export async function getAttributeFromElement(
  page: Page,
  element: ElementHandle | null,
  attribute: string
) {
  return page.evaluate(
    (element, attribute) => element.getAttribute(attribute),
    element,
    attribute
  );
}

export async function getInnerHtmlFromElement(
  page: Page,
  element: ElementHandle | null
) {
  return (await page.evaluate(element => element.innerHTML, element)).trim();
}

export async function getNextElement(page: Page, element: ElementHandle) {
  return page.evaluateHandle(
    element => element.nextElementSibling,
    element
  ) as Promise<ElementHandle>;
}

export async function getFirstChild(page: Page, element: ElementHandle) {
  return page.evaluateHandle(
    element =>
      element.children && element.children.length ? element.children[0] : null,
    element
  ) as Promise<ElementHandle>;
}

export async function getLastChild(page: Page, element: ElementHandle) {
  return page.evaluateHandle(
    element =>
      element.children && element.children.length
        ? element.children[element.children.length - 1]
        : null,
    element
  ) as Promise<ElementHandle>;
}

export async function getElementWithExactText(
  frameBase: QueryableXPath | ElementHandle | Page,
  text: string
) {
  const elements = await frameBase.$x(`//*[text()='${text}']`);
  if (elements.length) {
    return elements[0];
  }
  return null;
}

export async function getStyleFromElement(
  page: Page,
  elementHandle: ElementHandle,
  cssProperty: string
): Promise<string> {
  // page.evaluate evaluates the given function from inside the browser context
  // so elementHandle and cssProperty are not available in the scope of the function.
  // That is why we pass it. Puppeteer automatically converts the elementHandle
  // into the correct DOM element, though
  return page.evaluate(
    (element, property) =>
      window.getComputedStyle(element).getPropertyValue(property),
    elementHandle,
    cssProperty
  );
}

export async function selectorExists(
  queryable: Queryable,
  selector: string
): Promise<boolean> {
  const elements = await queryable.$(selector);
  return elements !== null;
}

export async function launchPuppeteer(): Promise<puppeteer.Browser> {
  return puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
}

export interface FluentPuppeteerNodeError {
  message: string;
  step?: number;
}

export interface FluentPuppeteerValue {
  error?: FluentPuppeteerNodeError;
  value?: string;
}

export interface FluentPuppeteerCSSStyleDeclaration {
  error?: FluentPuppeteerNodeError;
  value?: CSSStyleDeclaration;
}

export class FluentPuppeteerState {
  page: Page;
  currentElement: ElementHandle | null;
  step: number;
  error?: FluentPuppeteerNodeError;

  constructor(
    page: Page,
    currentElement: ElementHandle | null,
    step: number,
    error?: FluentPuppeteerNodeError
  ) {
    this.page = page;
    this.currentElement = currentElement;
    this.step = step;
    this.error = error;
  }
}

export class FluentPuppeteerNode {
  pendingState: Promise<FluentPuppeteerState>;

  constructor(
    page: Page,
    currentElement?: ElementHandle | null,
    error?: FluentPuppeteerNodeError
  ) {
    this.pendingState = Promise.resolve<FluentPuppeteerState>(
      new FluentPuppeteerState(page, currentElement || null, 0, error)
    );
  }

  $element(element: ElementHandle): FluentPuppeteerNode {
    this.pendingState = this.pendingState.then(
      async (state: FluentPuppeteerState) => {
        if (state.error) {
          return state;
        }
        return new FluentPuppeteerState(state.page, element, state.step + 1);
      }
    );
    return this;
  }

  $(selector: string): FluentPuppeteerNode {
    this.pendingState = this.pendingState.then(
      async (state: FluentPuppeteerState) => {
        if (state.error) {
          return state;
        }
        let newElement: ElementHandle | null;
        if (state.currentElement) {
          // undefined means that this is a ROOT operation
          newElement = await state.currentElement.$(selector);
        } else {
          newElement = await state.page.$(selector);
        }

        const error: FluentPuppeteerNodeError | undefined = newElement
          ? undefined
          : {
              step: state.step,
              message: `Selector: ${selector} did not return any element`
            };

        return new FluentPuppeteerState(
          state.page,
          newElement,
          state.step + 1,
          error
        );
      }
    );
    return this;
  }

  $nextElement(): FluentPuppeteerNode {
    this.pendingState = this.pendingState.then(
      async (state: FluentPuppeteerState) => {
        if (state.error) {
          return state;
        }
        if (!state.currentElement === null) {
          return new FluentPuppeteerState(state.page, null, state.step + 1, {
            message: `Cannot $nextElement when there is no element in the state`,
            step: state.step
          });
        }
        const newElement = await getNextElement(
          state.page,
          state.currentElement as ElementHandle
        );
        const error: FluentPuppeteerNodeError | undefined = newElement
          ? undefined
          : {
              message: `Could not find next element`,
              step: state.step
            };

        return new FluentPuppeteerState(
          state.page,
          newElement,
          state.step + 1,
          error
        );
      }
    );
    return this;
  }

  $firstChild(): FluentPuppeteerNode {
    this.pendingState = this.pendingState.then(
      async (state: FluentPuppeteerState) => {
        if (state.error) {
          return state;
        }
        if (!state.currentElement === null) {
          return new FluentPuppeteerState(state.page, null, state.step + 1, {
            message: `Cannot $firstChild when there is no element in the state`,
            step: state.step
          });
        }
        const newElement = await getFirstChild(
          state.page,
          state.currentElement as ElementHandle
        );
        const error: FluentPuppeteerNodeError | undefined = newElement
          ? undefined
          : {
              message: `Could not find fist child`,
              step: state.step
            };

        return new FluentPuppeteerState(
          state.page,
          newElement,
          state.step + 1,
          error
        );
      }
    );
    return this;
  }

  $lastChild(): FluentPuppeteerNode {
    this.pendingState = this.pendingState.then(
      async (state: FluentPuppeteerState) => {
        if (state.error) {
          return state;
        }
        if (!state.currentElement === null) {
          return new FluentPuppeteerState(state.page, null, state.step + 1, {
            message: `Cannot $lastChild when there is no element in the state`,
            step: state.step
          });
        }
        const newElement = await getLastChild(
          state.page,
          state.currentElement as ElementHandle
        );
        const error: FluentPuppeteerNodeError | undefined = newElement
          ? undefined
          : {
              message: `Could not find last child`,
              step: state.step
            };

        return new FluentPuppeteerState(
          state.page,
          newElement,
          state.step + 1,
          error
        );
      }
    );
    return this;
  }

  $elementWithExactText(text: string): FluentPuppeteerNode {
    this.pendingState = this.pendingState.then(
      async (state: FluentPuppeteerState) => {
        if (state.error) {
          return state;
        }
        const newElement = await getElementWithExactText(
          state.currentElement || state.page,
          text
        );
        const error: FluentPuppeteerNodeError | undefined = newElement
          ? undefined
          : {
              message: `Could not find element with exact text: ${text}`,
              step: state.step
            };
        return new FluentPuppeteerState(
          state.page,
          newElement,
          state.step + 1,
          error
        );
      }
    );
    return this;
  }

  async getAttribute(attribute: string): Promise<FluentPuppeteerValue> {
    try {
      const state = await this.pendingState;
      if (state.error) {
        return {
          error: state.error
        };
      }
      if (state.currentElement === null) {
        throw new Error("state.currentElement should not be null");
      }
      const value = await getAttributeFromElement(
        state.page,
        state.currentElement,
        attribute
      );
      if (value === null) {
        return {
          error: {
            message: `Could not find attribute ${attribute}`
          }
        };
      }
      return {
        error: state.error,
        value: value
      };
    } catch (ex) {
      return {
        error: {
          message: `Uncaught exception: ${ex}`
        }
      };
    }
  }

  async getInnerHtml(): Promise<FluentPuppeteerValue> {
    try {
      const state = await this.pendingState;
      if (state.error) {
        return {
          error: state.error
        };
      }
      if (state.currentElement === null) {
        throw new Error("state.currentElement should not be null");
      }
      const value = await getInnerHtmlFromElement(
        state.page,
        state.currentElement
      );
      return {
        error: state.error,
        value: value
      };
    } catch (ex) {
      return {
        error: {
          message: `Uncaught exception: ${ex}`
        }
      };
    }
  }

  async getInnerText(): Promise<FluentPuppeteerValue> {
    try {
      const state = await this.pendingState;
      if (state.error) {
        return {
          error: state.error
        };
      }
      if (state.currentElement === null) {
        throw new Error("state.currentElement should not be null");
      }
      const value = await getTextFromElement(state.page, state.currentElement);
      return {
        error: state.error,
        value: value
      };
    } catch (ex) {
      return {
        error: {
          message: `Uncaught exception: ${ex}`
        }
      };
    }
  }

  async getComputedStyle(cssProperty: string): Promise<FluentPuppeteerValue> {
    try {
      const state = await this.pendingState;
      if (state.error) {
        return {
          error: state.error
        };
      }
      if (state.currentElement === null) {
        throw new Error("state.currentElement should not be null");
      }
      return {
        value: await getStyleFromElement(
          state.page,
          state.currentElement,
          cssProperty
        )
      };
    } catch (ex) {
      return {
        error: ex
      };
    }
  }
}

export function query(page: Page) {
  return new FluentPuppeteerNode(page);
}
