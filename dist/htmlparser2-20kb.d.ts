export as namespace htmlparser;
export = htmlparser;

declare namespace htmlparser {
  interface DomNode {
    type: 'text' | 'directive' | 'comment' | 'script' | 'style' | 'tag' | 'cdata' | 'doctype';
    data?: string;
    name?: string;
    attribs?: { [name: string]: string };
    children?: DomNode[];
    parent?: DomNode | null;
    next?: DomNode | null;
    prev?: DomNode | null;
    startIndex?: number;
    endIndex?: number;
  }

  class Parser {
    constructor(handler: Handler, options?: ParserOptions);

    /***
     * Parses a chunk of data and calls the corresponding callbacks.
     */
    write(input: string): void;

    /***
     * Parses the end of the buffer and clears the stack, calls onend.
     */
    end(): void;

    /***
     * Resets the parser, parses the data & calls end.
     */
    parseComplete(input: string): void;

    /***
     * Resets buffer & stack, calls onreset.
     */
    reset(): void;
  }

  function parse(markup: string, options?: ParserOptions & HandlerOptions): DomNode[];

  function serialize(dom: DomNode | DomNode[], options?: SerializerOptions): string;

  function create(
    tagName: string,
    ...childrenOrAttribs: Array<
      | DomNode
      | string
      | { [name: string]: string }
      | undefined
      | Array<DomNode | string | { [name: string]: string } | undefined>
    >
  ): DomNode;

  function getSiblings(elem: DomNode): DomNode;
  function hasAttrib(elem: DomNode, name: string): boolean;

  function remove(elem: DomNode): void;
  function replace(elem: DomNode, replacement: DomNode): void;
  function appendChild(elem: DomNode, child: DomNode): void;
  /** Insert `next` after `elem`. */
  function append(elem: DomNode, next: DomNode): void;
  /** Insert `prev` before `elem`. */
  function prepend(elem: DomNode, prev: DomNode): void;

  /**
   * Recursive, depth-first.
   * @param [recursive=true]
   * @param [limit=Infinity]
   */
  function filter(
    test: (node: DomNode) => boolean,
    nodes: DomNode | DomNode[],
    recursive?: boolean,
    limit?: number
  ): DomNode[];

  /**
   * Searches only for tags, ignores text nodes, etc.
   * Recursive, depth-first.
   */
  function findOne(test: (el: DomNode) => boolean, elements: DomNode[]): DomNode | null;

  /**
   * Searches only for tags, ignores text nodes, etc.
   * Non-recursive, depth-first.
   */
  function findAll(test: (el: DomNode) => boolean, elements: DomNode[]): DomNode[];

  interface Handler {
    onopentag?: (name: string, attribs: { [type: string]: string }) => void;
    onopentagname?: (name: string) => void;
    onattribute?: (name: string, value: string) => void;
    ontext?: (text: string) => void;
    onclosetag?: (text: string) => void;
    onprocessinginstruction?: (name: string, data: string) => void;
    oncomment?: (data: string) => void;
    oncommentend?: () => void;
    oncdatastart?: () => void;
    oncdataend?: () => void;
    onerror?: (error: Error) => void;
    onreset?: () => void;
    onend?: () => void;
  }

  interface ParserOptions {
    /***
     * Indicates whether special tags (<script> and <style>) should get special treatment
     * and if "empty" tags (eg. <br>) can have children.  If false, the content of special tags
     * will be text only. For feeds and other XML content (documents that don't consist of HTML),
     * set this to true. Default: false.
     */
    xmlMode?: boolean;

    /***
     * If set to true, all tags will be lower-cased. If xmlMode is disabled, this defaults to true.
     */
    lowerCaseTags?: boolean;

    /***
     * If set to true, all attribute names will be lower-cased. This has noticeable impact on speed, so it defaults to false.
     */
    lowerCaseAttributeNames?: boolean;

    /***
     * If set to true, CDATA sections will be recognized as text even if the xmlMode option is not enabled.
     * NOTE: If xmlMode is set to true then CDATA sections will always be recognized as text.
     */
    recognizeCDATA?: boolean;

    /***
     * If set to true, self-closing tags will trigger the onclosetag event even if xmlMode is not set to true.
     * NOTE: If xmlMode is set to true then self-closing tags will always be recognized.
     */
    recognizeSelfClosing?: boolean;
  }

  interface HandlerOptions {
    normalizeWhitespace?: boolean;
    withStartIndices?: boolean;
    withEndIndices?: boolean;
  }

  interface SerializerOptions {
    xmlMode?: boolean;
  }
}