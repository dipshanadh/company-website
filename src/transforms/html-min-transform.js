const htmlMin = require("html-minifier");

module.exports = (content, outputPath) => {
  if (outputPath && outputPath.endsWith(".html")) {
    return htmlMin.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
      minifyCSS: true,
    });
  }

  return content;
};
