/**
 * API Configuration Constants
 * Contains base URL, timeout settings, HTTP methods, and endpoint definitions.
 */

/**
 * Timeout for API requests in milliseconds (10 seconds).
 */
export const API_TIMEOUT = 10000;

/**
 * Base URL for the API.
 * All API endpoints will be relative to this URL.
 */
export const API_BASE_URL: string =
  'https://closet-recruiting-api.azurewebsites.net/api';

/**
 * Enum for HTTP request methods.
 * Used to specify the type of API request to make.
 */
export enum ApiMethod {
  Delete = 'delete',
  Get = 'get',
  Patch = 'patch',
  Post = 'post',
  Put = 'put',
}

/**
 * Enum for HTTP status codes.
 * Used for handling and checking API response status.
 */
export enum ApiStatusCode {
  BadRequest = 400,
  Created = 201,
  Forbidden = 403,
  MethodNotFound = 405,
  NetworkError = 'ERR_NETWORK',
  NoContent = 204,
  NotFound = 404,
  ServerError = 500,
  Success = 200,
  Unauthorized = 401,
}

/**
 * Enum for API status presets.
 * Used for specific configuration scenarios.
 */
export enum ApiStatusPreset {
  AppConfig = 'appConfig',
}

/**
 * Main API configuration object.
 * Contains base URL, default headers, and all available endpoints.
 */
export const API = {
  /** Base URL for all API requests */
  baseUrl: API_BASE_URL,
  /** Default configuration for API requests */
  config: {
    headers: {
      /** Accept header for JSON responses */
      Accept: 'application/json',
      /** Content type for JSON requests */
      'Content-Type': 'application/json',
      /** Authorization header (set at runtime) */
      Authorization: '',
    },
  },
  /** Available API endpoints */
  endPoints: {
    /** Configuration endpoint */
    CONFIG: '/configuration',
    /** Data endpoint for content items */
    DATA: '/data',
  },
};
