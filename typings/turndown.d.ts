declare module "turndown" {
  class TurndownService {
    constructor(options?: TurndownService.Options);

    public addRule(key: string, rule: TurndownService.Rule): this;
    public keep(filter: TurndownService.Filter): this;
    public remove(filter: TurndownService.Filter): this;
    public use(plugins: Plugin | Array<Plugin>): this;
    public escape(str: string): string;

    public turndown(html: string | Node): string;
  }

  type Plugin = (service: TurndownService) => void;
  type Node = HTMLElement | Document | DocumentFragment;

  export = TurndownService;
}

declare namespace TurndownService {
  export interface Options {
    headingStyle?: "setext" | "atx";
    hr?: string;
    bulletListMarker?: "-" | "+" | "*";
    emDelimiter?: "_" | "*";
    codeBlockStyle?: "indented" | "fenced";
    fence?: "```" | "~~~";
    strongDelimiter?: "__" | "**";
    linkStyle?: "inlined" | "referenced";
    linkReferenceStyle?: "full" | "collapsed" | "shortcut";

    keepReplacement?: ReplacementFunction;
    blankReplacement?: ReplacementFunction;
    defaultReplacement?: ReplacementFunction;
  }

  export interface Rule {
    filter: Filter;
    replacement?: ReplacementFunction;
  }

  export type Filter = TagName | Array<TagName> | string[] | FilterFunction;
  export type FilterFunction = (node: HTMLElement, options: Options) => boolean;

  export type ReplacementFunction = (
    content: string,
    node: HTMLElement,
    options: Options
  ) => string;

  type TagName = keyof HTMLElementTagNameMap;
}
