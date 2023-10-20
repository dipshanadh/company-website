const Cache = require("@11ty/eleventy-cache-assets");

/**
 * Grabs the remote data for studio images and returns back
 * an array of objects
 *
 * @returns {Array} Empty or array of objects
 */
module.exports = async () => {
  try {
    // Grabs either the fresh remote data or cached data (will always be fresh live)
    const { items } = await Cache(
      "https://11ty-from-scratch-content-feeds.piccalil.li/media.json",
      {
        duration: "1d",
        type: "json",
      }
    );

    return items;
  } catch (error) {
    console.log(error);

    // If failes, return back and empty array
    return [];
  }
};
