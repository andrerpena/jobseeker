import { extractTags } from "../tag-extractor";

describe("tag-extractor", () => {
  describe("extractTags", () => {
    it("should work when there is a tag - 1", () => {
      const text = "postgres is the best database";
      const tags = extractTags(text);
      expect(tags.length).toEqual(1);
      const tag0 = tags[0];
      expect(tag0).toMatchObject({
        name: "postgresql"
      });
    });
    it("should work when there is a tag - 2", () => {
      const text = "it is cool node";
      const tags = extractTags(text);
      expect(tags.length).toEqual(1);
      const tag0 = tags[0];
      expect(tag0).toMatchObject({
        name: "node.js"
      });
    });
    it("should work without spaces", () => {
      const text = "2.node.3";
      const tags = extractTags(text);
      expect(tags.length).toEqual(1);
      const tag0 = tags[0];
      expect(tag0).toMatchObject({
        name: "node.js"
      });
    });
    it("should work when the token is not the key", () => {
      const text = "aws is cool";
      const tags = extractTags(text);
      expect(tags.length).toEqual(1);
      const tag0 = tags[0];
      expect(tag0).toMatchObject({
        name: "amazon-web-services"
      });
    });
    it("should work when the tag contains special characters - 1", () => {
      const text = "node.js is really cool";
      const tags = extractTags(text);
      expect(tags.length).toEqual(1);
      const tag0 = tags[0];
      expect(tag0).toMatchObject({
        name: "node.js"
      });
    });
    it("should work when the tag contains special characters - 2", () => {
      const text = "ASP.NET mvc is really cool";
      const tags = extractTags(text);
      expect(tags.length).toEqual(1);
      const tag0 = tags[0];
      expect(tag0).toMatchObject({
        name: "asp.net"
      });
    });
    it("multiple matches should just return 1", () => {
      const text = "node.js is node and it is cool";
      const tags = extractTags(text);
      expect(tags.length).toEqual(1);
      const tag0 = tags[0];
      expect(tag0).toMatchObject({
        name: "node.js"
      });
    });
    it("should work when there is no tag", () => {
      const text = "banana is a fruit";
      const tags = extractTags(text);
      expect(tags).toEqual([]);
    });
  });
});
