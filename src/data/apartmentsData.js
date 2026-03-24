/**
 * apartmentsData.js — backward-compatibility re-export
 * All data now lives in rentalData.js
 */
export {
  rentalData as apartmentsData,
  getVisibleListings as getVisibleApartments,
  getAvailableListings as getAvailableApartments,
  getListingBySlug as getApartmentBySlug,
  getByType,
} from './rentalData.js';
