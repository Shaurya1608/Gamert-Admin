/**
 * Optimizes a Cloudinary image URL by adding transformation parameters.
 * @param {string} url - The original Cloudinary image URL.
 * @param {number} width - The desired width of the image. (Default reduced for performance)
 * @returns {string} - The optimized URL.
 */
export const getOptimizedImageUrl = (url, width = 600) => {
  if (!url || !url.includes("cloudinary.com")) return url;

  // Check if it's already optimized or has transformations
  if (url.includes("/upload/v")) {
    // q_auto:best -> automatic quality optimization
    // f_auto -> automatic format (webp/avif)
    // c_limit -> resize only if larger
    const transformation = `q_auto,f_auto,w_${width},c_limit,dpr_auto`;
    return url.replace("/upload/", `/upload/${transformation}/`);
  }

  return url;
};
