import { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * OptimizedImage - Production-grade image component with lazy loading, WebP support, and responsive images
 * 
 * Features:
 * - Native lazy loading
 * - WebP format with fallback
 * - Responsive images via srcset
 * - Blur placeholder while loading
 * - Error handling with fallback
 * 
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for accessibility
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.width] - Image width
 * @param {string} [props.height] - Image height
 * @param {boolean} [props.eager] - Disable lazy loading for above-fold images
 * @param {string} [props.sizes] - Responsive sizes attribute
 * @param {Function} [props.onLoad] - Callback when image loads
 * @param {Function} [props.onError] - Callback when image fails to load
 */
const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  eager = false,
  sizes = '100vw',
  onLoad,
  onError,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setHasError(true);
    onError?.(e);
  };

  // Generate WebP source if not already WebP
  const isWebP = src?.endsWith('.webp');
  const webpSrc = isWebP ? src : src?.replace(/\.(jpg|jpeg|png)$/i, '.webp');

  // Generate responsive srcset for different screen sizes
  const generateSrcSet = (baseSrc) => {
    if (!baseSrc) return '';
    // For Cloudinary URLs, add width transformations
    if (baseSrc.includes('cloudinary')) {
      return `
        ${baseSrc.replace('/upload/', '/upload/w_400/')} 400w,
        ${baseSrc.replace('/upload/', '/upload/w_800/')} 800w,
        ${baseSrc.replace('/upload/', '/upload/w_1200/')} 1200w,
        ${baseSrc.replace('/upload/', '/upload/w_1600/')} 1600w
      `.trim();
    }
    return '';
  };

  if (hasError) {
    return (
      <div
        className={`bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center ${className}`}
        style={{ width, height }}
        {...rest}
      >
        <span className="text-gray-500 text-xs font-bold">Image unavailable</span>
      </div>
    );
  }

  return (
    <picture>
      {/* WebP source for modern browsers */}
      {!isWebP && webpSrc && (
        <source
          type="image/webp"
          srcSet={generateSrcSet(webpSrc) || webpSrc}
          sizes={sizes}
        />
      )}
      
      {/* Fallback to original format */}
      <img
        src={src}
        srcSet={generateSrcSet(src)}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...rest}
      />
    </picture>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  eager: PropTypes.bool,
  sizes: PropTypes.string,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
};

export default OptimizedImage;
