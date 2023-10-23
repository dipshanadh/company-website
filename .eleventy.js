// Libs
const Image = require("@11ty/eleventy-img");
const sass = require("sass");
const path = require("path");
const lightningcss = require("lightningcss");

// Filters
const dateFilter = require("./src/filters/date-filter.js");
const w3DateFilter = require("./src/filters/w3-date-filter.js");

// transforms
const htmlMinTransform = require("./src/transforms/html-min-transform.js");

// utils
const sortByDisplayOrder = require("./src/utils/sort-by-display-order.js");
const stringifyAttributes = require("./src/utils/stringify-attributes.js");

module.exports = function (eleventyConfig) {
  // Passthrough file copy for favicon
  eleventyConfig.addPassthroughCopy("src/images/icons/favicon.png");

  // Recognize Sass as a "template language"
  eleventyConfig.addTemplateFormats("scss");

  // Creates the extension for use
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",

    async compile(inputContent, inputPath) {
      const parsed = path.parse(inputPath);

      // Ignore partials
      if (parsed.name.startsWith("_")) {
        return;
      }

      const result = sass.compileString(inputContent, {
        loadPaths: [parsed.dir || "."],
        sourceMap: false,
      });

      // Add imported files in Sass file
      this.addDependencies(inputPath, result.loadedUrls);

      return () => {
        // Compress using lightningCSS
        const css = lightningcss.transform({
          code: Buffer.from(result.css),
          minify: true,
          sourceMap: false,
        }).code;

        return css;
      };
    },
  });

  // For Image short code for optimization
  eleventyConfig.addNunjucksAsyncShortcode(
    "Image",
    async (src, alt, className) => {
      // Local images are inside src folder
      if (!src.startsWith("https://")) {
        src = `src/${src}`;
      }

      // Cache and compress image
      const metadata = await Image(src, {
        widths: ["auto"],
        formats: ["webp"],
        outputDir: "dist/images",
        urlPath: "/images",

        // Advanced options passed to eleventy-fetch
        cacheOptions: {
          duration: "1d",
        },

        // Advanced options passed to sharp
        sharpWebpOptions: {
          quality: 50,
        },
      });

      const img = metadata.webp[0];

      const imageAttributes = stringifyAttributes({
        alt,
        src: img.url,
        class: className,
        width: img.width,
        height: img.height,
        loading: "lazy",
        decoding: "async",
      });

      return `<img ${imageAttributes} />`;
    }
  );

  // Returns work items, sorted by display order
  eleventyConfig.addCollection("work", collection => {
    return sortByDisplayOrder(collection.getFilteredByGlob("./src/work/*.md"));
  });

  // Returns work items, sorted by display order then filtered by featured
  eleventyConfig.addCollection("featuredWork", collection => {
    return sortByDisplayOrder(
      collection.getFilteredByGlob("./src/work/*.md")
    ).filter(work => work.data.featured);
  });

  // Returns a collection of blog posts in reverse order date
  eleventyConfig.addCollection("blog", collection => {
    return [...collection.getFilteredByGlob("./src/posts/*.md")].reverse();
  });

  // Returns a list of people ordered by filename
  eleventyConfig.addCollection("people", collection => {
    return collection.getFilteredByGlob("./src/people/*.md").sort((a, b) => {
      return Number(a.fileSlug) > Number(b.fileSlug) ? 1 : -1;
    });
  });

  // Add filters
  eleventyConfig.addNunjucksFilter("dateFilter", dateFilter);
  eleventyConfig.addNunjucksFilter("w3DateFilter", w3DateFilter);

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", htmlMinTransform);

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
