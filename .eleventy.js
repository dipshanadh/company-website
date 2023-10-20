const sass = require("sass");
const path = require("path");
const { transform } = require("lightningcss");

// transforms
const htmlMinTransform = require("./src/transforms/html-min-transform.js");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/images");

  // Recognize Sass as a "template language"
  eleventyConfig.addTemplateFormats("scss");

  // Creates the extension for use
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",

    async compile(inputContent, inputPath) {
      const parsed = path.parse(inputPath);

      if (parsed.name.startsWith("_")) {
        return;
      }

      let result = sass.compileString(inputContent, {
        loadPaths: [parsed.dir || "."],
        sourceMap: false,
      });

      this.addDependencies(inputPath, result.loadedUrls);

      return () => {
        const { code } = transform({
          code: Buffer.from(result.css),
          minify: true,
          sourceMap: false,
        });

        return code;
      };
    },
  });

  // Minify HTML if we are in production
  if (process.env.NODE_ENV === "production") {
    eleventyConfig.addTransform("htmlmin", htmlMinTransform);
  }

  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",

    dir: {
      input: "src",
      output: "dist",
    },
  };
};
