/**
 * Maps a config of attribute-value pairs to an HTML string
 * representing those same attribute-value pairs.
 */
module.exports = attributeMap => {
  return Object.entries(attributeMap)
    .map(([attribute, value]) => {
      if (typeof value === "undefined") {
        return "";
      }

      return `${attribute}="${value}"`;
    })
    .join(" ");
};
