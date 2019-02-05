module.exports = (fileInfo, { jscodeshift: j }) => {
  const ast = j(fileInfo.source);

  // add UMD boilerplate

  const source = ast.toSource().replace(
    /[\w$]+\.HTMLPARSER2\$TMP\$GLOBAL = ([\w$]+);/,
    `if (typeof exports === "object" && typeof module !== "undefined") {
      // CommonJS
      module.exports = $1;
    } else if (typeof define === "function" && define.amd) {
      // RequireJS
      define(function() { return $1; });
    } else {
      // <script>
      this.htmlparser = $1;
    }`
  );

  return source;
};
