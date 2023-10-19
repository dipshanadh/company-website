module.exports = eleventyConfig => {
  eleventyConfig.addPassthroughCopy("./src/images");

  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "_site",
    },
  };
};
