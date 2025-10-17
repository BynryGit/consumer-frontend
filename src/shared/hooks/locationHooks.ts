// import { useState, useEffect, useMemo } from 'react';
// import { locationJsonService as LocationService } from '@shared/services';

// /**
//  * Hook to get all countries
//  */
// export const useCountries = () => {
//   const [countries, setCountries] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true);
//     try {
//       const countryData = LocationService.getCountries();
//       setCountries(countryData);
//     } catch (error) {
//       console.error('Error in useCountries:', error);
//       setCountries([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   return { countries, loading };
// };

// /**
//  * Hook to get states for a specific country
//  * @param {string} countryId - Country ID or ISO2 code
//  */
// export const useStates = (countryId) => {
//   const [states, setStates] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!countryId) {
//       setStates([]);
//       return;
//     }

//     setLoading(true);
//     try {
//       const stateData = LocationService.getStatesOfCountry(countryId);
//       setStates(stateData);
//     } catch (error) {
//       console.error('Error in useStates:', error);
//       setStates([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [countryId]);

//   return { states, loading };
// };

// /**
//  * Hook to get cities for a specific state
//  * @param {string} stateId - State ID
//  */
// export const useCities = (stateId) => {
//   const [cities, setCities] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!stateId) {
//       setCities([]);
//       return;
//     }

//     setLoading(true);
//     try {
//       const cityData = LocationService.getCitiesOfState(stateId);
//       setCities(cityData);
//     } catch (error) {
//       console.error('Error in useCities:', error);
//       setCities([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [stateId]);

//   return { cities, loading };
// };

// /**
//  * Hook for location search functionality
//  * @param {string} type - 'countries', 'states', or 'cities'
//  * @param {string} parentId - Parent ID (country for states, state for cities)
//  * @param {string} searchTerm - Search term
//  */
// export const useLocationSearch = (type, parentId, searchTerm) => {
//   const results = useMemo(() => {
//     if (!searchTerm || searchTerm.length < 2) return [];

//     switch (type) {
//       case 'countries':
//         return LocationService.searchCountries(searchTerm);
//       case 'states':
//         return parentId ? LocationService.searchStates(parentId, searchTerm) : [];
//       case 'cities':
//         return parentId ? LocationService.searchCities(parentId, searchTerm) : [];
//       default:
//         return [];
//     }
//   }, [type, parentId, searchTerm]);

//   return results;
// };

// /**
//  * Hook for complete location management (country -> state -> city)
//  */
// export const useLocationManager = () => {
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [selectedState, setSelectedState] = useState(null);
//   const [selectedCity, setSelectedCity] = useState(null);

//   const { countries, loading: countriesLoading } = useCountries();
//   const { states, loading: statesLoading } = useStates(selectedCountry?.id);
//   const { cities, loading: citiesLoading } = useCities(selectedState?.id);

//   const resetState = () => {
//     setSelectedState(null);
//     setSelectedCity(null);
//   };

//   const resetCity = () => {
//     setSelectedCity(null);
//   };

//   const setCountry = (country) => {
//     setSelectedCountry(country);
//     resetState();
//   };

//   const setState = (state) => {
//     setSelectedState(state);
//     resetCity();
//   };

//   const setCity = (city) => {
//     setSelectedCity(city);
//   };

//   return {
//     // Data
//     countries,
//     states,
//     cities,
    
//     // Selected values
//     selectedCountry,
//     selectedState,
//     selectedCity,
    
//     // Loading states
//     countriesLoading,
//     statesLoading,
//     citiesLoading,
    
//     // Actions
//     setCountry,
//     setState,
//     setCity,
//     resetState,
//     resetCity
//   };
// };