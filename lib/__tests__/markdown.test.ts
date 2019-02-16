import { getMarkdownFromHtml } from "../markdown";

describe("getMarkdownFromHtml", () => {
  it("should work with lists", () => {
    const markdown = getMarkdownFromHtml(
      "<ul>\n" + "<li>1</li>\n" + "<li>2</li>\n" + "<li>3</li>\n" + "</ul>"
    );
    expect(markdown).toEqual(`*   1
*   2
*   3`);
  });
});
