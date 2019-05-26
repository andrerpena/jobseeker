import { removeMarkdown, getMarkdownFromHtml } from "../markdown";

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

describe("removeMarkdown", () => {
  it("should work with lists", () => {
    const paragraph =
      "\n## This is a heading ##\n\nThis is a paragraph with [a link](http://www.disney.com/).\n\n### This is another heading\n\nIn `Getting Started` we set up `something` foo.\n\n  * Some list\n  * With items\n    * Even indented";
    const expected =
      "\nThis is a heading\n\nThis is a paragraph with a link.\n\nThis is another heading\n\nIn Getting Started we set up something foo.\n\n  Some list\n  With items\n    Even indented";
    expect(removeMarkdown(paragraph)).toEqual(expected);
  });
});
