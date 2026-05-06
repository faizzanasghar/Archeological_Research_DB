/**
 * Site Image Mapping Utility
 * Maps archaeological site names to their corresponding image assets
 * Provides dynamic image retrieval with fallback handling and performance optimization
 */

const SITE_IMAGE_MAP = {
  // Indus Valley Civilization sites - South Asia
  'mohenjo-daro': '/assets/sites/mohenjadaro.jpg',
  'mohenjodaro': '/assets/sites/mohenjadaro.jpg',
  'mohenjo daro': '/assets/sites/mohenjadaro.jpg',
  'taxila': '/assets/sites/taxila.jpg',
  'harappa': '/assets/sites/harapa.jpg',
  'harapa': '/assets/sites/harapa.jpg',
  
  // Neolithic and early period sites
  'mehrgarh': '/assets/sites/mehrgarh.jpg',
  'amri': '/assets/sites/amri.jpg',
  'chanhudaro': '/assets/sites/chanhudaro.jpg',
  'chan-hu-daro': '/assets/sites/chanhudaro.jpg',
  
  // Sikh/Buddhist heritage sites
  'takht-e-bahi': '/assets/sites/takht-e-bahi.jpg',
  'takht e bahi': '/assets/sites/takht-e-bahi.jpg',
  
  // Early Indus sites
  'kot-diji': '/assets/sites/kot_diji.jpg',
  'kot diji': '/assets/sites/kot_diji.jpg',
  'rehman-dheri': '/assets/sites/rehman-dheri.jpg',
  'rehman dheri': '/assets/sites/rehman-dheri.jpg',
};

/**
 * All available site images - for gallery or preview purposes
 * Enhanced with metadata for better UI presentation
 */
export const ALL_SITE_IMAGES = [
  { 
    name: 'Mohenjo-Daro', 
    path: '/assets/sites/mohenjadaro.jpg',
    aliases: ['mohenjo-daro', 'mohenjodaro', 'mohenjo daro'],
    description: 'Major Indus Valley Civilization site in Sindh, Pakistan',
    period: 'circa 2500-1900 BCE'
  },
  { 
    name: 'Taxila', 
    path: '/assets/sites/taxila.jpg',
    aliases: ['taxila'],
    description: 'Historic Buddhist and Greek settlement in Punjab',
    period: 'circa 1000 BCE - 500 CE'
  },
  { 
    name: 'Harappa', 
    path: '/assets/sites/harapa.jpg',
    aliases: ['harappa', 'harapa'],
    description: 'Major Indus Valley Civilization site in Punjab, Pakistan',
    period: 'circa 3300-1300 BCE'
  },
  { 
    name: 'Mehrgarh', 
    path: '/assets/sites/mehrgarh.jpg',
    aliases: ['mehrgarh'],
    description: 'Neolithic settlement predating Indus Valley Civilization',
    period: 'circa 7000-5500 BCE'
  },
  { 
    name: 'Amri', 
    path: '/assets/sites/amri.jpg',
    aliases: ['amri'],
    description: 'Early settlement in Sindh showing transition to urban civilization',
    period: 'circa 3500-2700 BCE'
  },
  { 
    name: 'Chanhudaro', 
    path: '/assets/sites/chanhudaro.jpg',
    aliases: ['chanhudaro', 'chan-hu-daro'],
    description: 'Industrial center of Indus Valley Civilization',
    period: 'circa 2500-1900 BCE'
  },
  { 
    name: 'Takht-e-Bahi', 
    path: '/assets/sites/takht-e-bahi.jpg',
    aliases: ['takht-e-bahi', 'takht e bahi'],
    description: 'Buddhist monastery complex in Khyber Pakhtunkhwa',
    period: 'circa 1st-5th century CE'
  },
  { 
    name: 'Kot Diji', 
    path: '/assets/sites/kot_diji.jpg',
    aliases: ['kot-diji', 'kot diji'],
    description: 'Pre-Indus and Indus Valley settlement in Sindh',
    period: 'circa 3500-2700 BCE'
  },
  { 
    name: 'Rehman Dheri', 
    path: '/assets/sites/rehman-dheri.jpg',
    aliases: ['rehman-dheri', 'rehman dheri'],
    description: 'Neolithic to Bronze Age settlement in Khyber Pakhtunkhwa',
    period: 'circa 4000-1500 BCE'
  },
];

// Cache for preloaded images
const imageCache = new Map();

/**
 * Get image path for a given site name
 * @param {string} siteName - Name of the archaeological site
 * @param {string} defaultImage - Fallback image path if site not found
 * @returns {string} Path to the site image
 */
export const getSiteImage = (siteName, defaultImage = '/assets/sites/mohenjadaro.jpg') => {
  if (!siteName) return defaultImage;
  
  const normalizedName = siteName.toLowerCase().trim();
  const imagePath = SITE_IMAGE_MAP[normalizedName];
  
  return imagePath || defaultImage;
};

/**
 * Get site metadata including description and period
 * @param {string} siteName - Name of the archaeological site
 * @returns {object} Site metadata object with name, description, period
 */
export const getSiteMetadata = (siteName) => {
  if (!siteName) return null;
  
  const normalizedName = siteName.toLowerCase().trim();
  return ALL_SITE_IMAGES.find(site => 
    site.aliases && site.aliases.includes(normalizedName)
  ) || null;
};

/**
 * Preload multiple site images for performance
 * @param {array} siteNames - Array of site names to preload
 * @returns {promise} Promise that resolves when all images are loaded
 */
export const preloadSiteImages = (siteNames = []) => {
  const images = siteNames.length > 0 
    ? siteNames.map(name => getSiteImage(name))
    : ALL_SITE_IMAGES.map(site => site.path);
  
  return Promise.all(images.map(path => preloadSiteImage(path)));
};

/**
 * Check if image exists/is valid - for preloading and caching
 * @param {string} imagePath - Path to image to preload
 * @returns {promise} Promise resolving to boolean indicating success
 */
export const preloadSiteImage = (imagePath) => {
  // Return cached result if available
  if (imageCache.has(imagePath)) {
    return Promise.resolve(imageCache.get(imagePath));
  }
  
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      imageCache.set(imagePath, true);
      resolve(true);
    };
    img.onerror = () => {
      imageCache.set(imagePath, false);
      resolve(false);
    };
    img.src = imagePath;
  });
};

/**
 * Get image srcSet for responsive loading
 * @param {string} siteName - Name of the archaeological site
 * @returns {string} Responsive image srcSet string
 */
export const getSiteImageSrcSet = (siteName) => {
  const imagePath = getSiteImage(siteName);
  // For now, return same image for all sizes
  // Can be enhanced with multiple image sizes if available
  return imagePath;
};

/**
 * Clear image cache to free memory
 */
export const clearImageCache = () => {
  imageCache.clear();
};
