// src/shared/location/locationJsonService.ts

import * as countrycitystatejson from "countrycitystatejson";

export type LocationOption = {
  value: string;
  label: string;
};

const extraData: Record<
  string,
  {
    states: string[];
    cities: Record<string, string[]>;
  }
> = {
  WS: {
    states: ["UPOLU", "VAIMAUGA_4"],
    cities: {
      UPOLU: ["APIA"],
      VAIMAUGA_4: ["Savalalo"],
    },
  },
};

export const locationJsonService = {
  getCountries(): LocationOption[] {
    const countryData = countrycitystatejson.getCountries();
    return countryData.map(({ name, shortName }) => ({
      label: name === "United States" ? "United States of America" : name,
      value: shortName,
    }));
  },

  getStatesByCountry(countryShortName: string): LocationOption[] {
    const existingStates =
      countrycitystatejson.getStatesByShort(countryShortName) || [];
    const extraStates = extraData[countryShortName]?.states || [];

    const allStates = [...existingStates, ...extraStates];
    return allStates.map((stateName) => ({
      value: stateName,
      label: stateName,
    }));
  },

  getCitiesByState(
    countryShortName: string,
    stateName: string
  ): LocationOption[] {
    const existingCities =
      countrycitystatejson.getCities(countryShortName, stateName) || [];
    const extraCities = extraData[countryShortName]?.cities[stateName] || [];

    const allCities = [...existingCities, ...extraCities];
    return allCities.map((cityName) => ({
      value: cityName,
      label: cityName,
    }));
  },
};
