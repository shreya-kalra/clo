/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from 'axios';
import { isNil, omitBy } from 'lodash';

import { API, API_TIMEOUT, ApiMethod } from '../constants/api.constants';

/**
 * Interface for API response wrapper.
 * Provides a consistent structure for all API responses.
 * @template T - The type of data returned by the API
 */
export interface IApiResponse<T> {
  /** HTTP status code */
  code: number;
  /** Response data payload */
  data?: T;
  /** Response message or status text */
  message: string;
}

/**
 * Creates axios configuration with common settings.
 * Sets up base URL, timeout, authorization headers, and params serializer.
 * @param authToken - Authentication token for API requests
 * @param params - Query parameters to include in the request
 * @returns Axios configuration object
 */
const axiosConfig = <Params = undefined>(
  authToken: string,
  params?: Params
) => ({
  baseURL: API.baseUrl,
  timeout: API_TIMEOUT,
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
  params,
  /**
   * Custom serializer for query parameters.
   * Filters out nil values and handles array parameters.
   * @param queryParams - Parameters to serialize
   * @returns URL-encoded query string
   */
  paramsSerializer(queryParams: Params | any) {
    const paramsWithValues = omitBy(queryParams, isNil);

    return Object.entries(paramsWithValues)
      .flatMap(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map(
            v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`
          );
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join('&');
  },
});

/**
 * Maps axios response to local API response type.
 * Transforms axios response format to IApiResponse format.
 * @param axiosResponse - Axios response object
 * @returns Formatted API response
 */
const mapAxiosResponseToLocalResponseType = <RequestData, ResponseData>(
  axiosResponse: AxiosResponse<ResponseData, RequestData>
): IApiResponse<ResponseData> => {
  return {
    code: axiosResponse.status,
    message: axiosResponse.statusText,
    data: axiosResponse.data,
  };
};

/**
 * Creates an error response object.
 * Used for standardized error handling across API calls.
 * @param errorCode - HTTP error code
 * @param errorMessage - Error description
 * @param data - Optional error data
 * @returns Error response object
 */
const errorResponse = <T>(
  errorCode: number,
  errorMessage: string,
  data?: T
) => ({
  code: errorCode,
  message: errorMessage,
  data,
});

/**
 * Performs API request using the specified HTTP method.
 * Handles GET, POST, PUT, PATCH, and DELETE requests.
 * @param requestVerb - HTTP method to use for the request
 * @param endpoint - API endpoint path
 * @param requestData - Request body data
 * @param configParam - Additional configuration (params, data)
 * @param contentType - Optional content type header
 * @returns Promise resolving to axios response or null
 */
const getApiResponseUsingRequestVerb = async <
  RequestData,
  ResponseData,
  Params = undefined,
  Data = undefined,
>(
  requestVerb: ApiMethod,
  endpoint: string,
  requestData?: RequestData,
  configParam?: {
    params?: Params;
    data?: Data;
  },
  contentType?: string
): Promise<AxiosResponse<ResponseData, RequestData> | null> => {
  // TODO: Implement proper authentication token retrieval
  // const accessToken = (await getIdToken()) || getLocalStorageValue(LocalStorageKeys.AuthToken);
  const authToken = '';
  const { params, data } = configParam || {};
  const config = axiosConfig<Params>(authToken, params);

  // Override content type if specified

  if (contentType) {
    const header = { ...config.headers, 'Content-Type': contentType };
    config.headers = header;
  }

  let axiosCall: Promise<AxiosResponse<ResponseData, RequestData>> | null;

  // Execute the appropriate HTTP method
  switch (requestVerb) {
    case ApiMethod.Get:
      axiosCall = axios.get(endpoint, config);
      break;
    case ApiMethod.Post:
      axiosCall = axios.post(endpoint, requestData, config);
      break;
    case ApiMethod.Put:
      axiosCall = axios.put(endpoint, requestData, config);
      break;
    case ApiMethod.Patch:
      axiosCall = axios.patch(endpoint, requestData, config);
      break;
    case ApiMethod.Delete:
      axiosCall = axios.delete(endpoint, { ...config, data });
      break;
    default:
      axiosCall = null;
  }

  return axiosCall;
};

/**
 * Centralized API call function.
 * Provides a unified interface for making API requests using axios.
 * Handles all HTTP methods and includes error handling.
 *
 * @param requestVerb - HTTP method (GET, POST, PUT, PATCH, DELETE)
 * @param endpoint - API endpoint path relative to base URL
 * @param requestData - Optional request body data
 * @param configParam - Optional configuration (query params, request data)
 * @param contentType - Optional content type header override
 * @returns Promise resolving to IApiResponse with typed data
 *
 * @example
 * ```typescript
 * const response = await makeApiCall<User, UserResponse>(
 *   ApiMethod.Get,
 *   '/users/123'
 * );
 * ```
 */
export const makeApiCall = async <
  RequestData,
  ResponseData,
  Params = undefined,
  Data = undefined,
>(
  requestVerb: ApiMethod,
  endpoint: string,
  requestData?: RequestData,
  configParam?: {
    params?: any;
    data?: Data;
  },
  contentType?: string
): Promise<IApiResponse<ResponseData>> => {
  try {
    // Make the API request using the specified method
    const response = await getApiResponseUsingRequestVerb<
      RequestData,
      ResponseData,
      Params,
      Data
    >(requestVerb, endpoint, requestData, configParam, contentType);

    // Map successful response to IApiResponse format
    if (response?.status) {
      return mapAxiosResponseToLocalResponseType<RequestData, ResponseData>(
        response
      );
    }

    // Return error if no valid response
    return errorResponse(500, 'Could not get a response from the API');
  } catch (exception: any) {
    // Re-throw as Error for consistent error handling
    throw new Error(exception);
  }
};
