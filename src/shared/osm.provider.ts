import {
  AddressNotFoundError,
  CoordinatesNotFoundError,
  OSMProviderError,
} from "@shared/errors/errors.js";

import { IOSMProvider } from "./middlewares/interfaces/osm.interface.js";

interface NominatimResponse {
  lat: string;
  lon: string;
}

export class OpenStreetMapProvider implements IOSMProvider {
  async getCoordinatesFromAddress(
    address: string,
  ): Promise<{ latitude: number; longitude: number }> {
    const query = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?addressdetails=1&q=${query}&format=jsonv2&limit=1`;

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": `${process.env.USER_AGENT}`,
        },
      });

      if (!response.ok) {
        throw new OSMProviderError(
          `OSM API Error: Status ${response.status} - ${response.statusText}`,
        );
      }

      const geoData: NominatimResponse[] = await response.json();

      if (geoData.length === 0) {
        throw new CoordinatesNotFoundError();
      }

      return {
        latitude: parseFloat(geoData[0].lat),
        longitude: parseFloat(geoData[0].lon),
      };
    } catch (error) {
      if (
        error instanceof CoordinatesNotFoundError ||
        error instanceof OSMProviderError
      ) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new OSMProviderError(
        `Failed to fetch coordinates: ${errorMessage}`,
      );
    }
  }

  async getAddressFromCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<{ address: string }> {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "ConectaPlus/1.0 (TCC)",
        },
      });

      if (!response.ok) {
        throw new OSMProviderError(
          `Failed to fetch address: ${response.statusText}`,
        );
      }

      const geoData = await response.json();
      if (geoData.length === 0) {
        throw new AddressNotFoundError();
      }

      return {
        address: geoData.display_name,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "";
      throw new OSMProviderError(`Failed to fetch address: ${errorMessage}`);
    }
  }
}
