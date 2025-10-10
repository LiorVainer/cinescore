/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Movie {
    Title?: string;
    Year?: string;
    Rated?: string;
    Released?: string;
    Runtime?: string;
    Genre?: string;
    Director?: string;
    Writer?: string;
    Actors?: string;
    Plot?: string;
    Language?: string;
    Country?: string;
    Awards?: string;
    Poster?: string;
    Ratings?: {
        Source?: string;
        Value?: string;
    }[];
    Metascore?: string;
    imdbRating?: string;
    imdbVotes?: string;
    imdbID?: string;
    Type?: string;
    DVD?: string;
    BoxOffice?: string;
    Production?: string;
    Website?: string;
    Response?: string;
}

export interface SearchResponse {
    Search?: {
        Title?: string;
        Year?: string;
        imdbID?: string;
        Type?: string;
        Poster?: string;
    }[];
    totalResults?: string;
    Response?: string;
}

export interface GetTitleParams {
    /** Title of movie or series */
    t: string;
    /** Year of release */
    y?: number;
    /** Return movie or series */
    type?: "movie" | "series";
    /** Return short or full plot */
    plot?: "short" | "full";
    /** Response format */
    r?: "json" | "xml";
}

export type GetTitleData = Movie;

export interface GetIdParams {
    /** A valid IMDb ID (e.g. tt0000001) */
    i: string;
    /** Return short or full plot */
    plot?: "short" | "full";
    /** Response format */
    r?: "json" | "xml";
}

export type GetIdData = Movie;

export interface TitleSearchParams {
    /** Title of movie or series */
    s: string;
    /** Year of release */
    y?: number;
    /** Return movie or series */
    type?: "movie" | "series";
    /** Page number */
    page?: number;
    /** Response format */
    r?: "json" | "xml";
}

export type TitleSearchData = SearchResponse;

import type {
    AxiosInstance,
    AxiosRequestConfig,
    HeadersDefaults,
    ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
    extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
    /** set parameter to `true` for call `securityWorker` for this request */
    secure?: boolean;
    /** request path */
    path: string;
    /** content type of request body */
    type?: ContentType;
    /** query params */
    query?: QueryParamsType;
    /** format of response (i.e. response.json() -> format: "json") */
    format?: ResponseType;
    /** request body */
    body?: unknown;
}

export type RequestParams = Omit<
    FullRequestParams,
    "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
    extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
    securityWorker?: (
        securityData: SecurityDataType | null,
    ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
    secure?: boolean;
    format?: ResponseType;
}

export enum ContentType {
    Json = "application/json",
    JsonApi = "application/vnd.api+json",
    FormData = "multipart/form-data",
    UrlEncoded = "application/x-www-form-urlencoded",
    Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
    public instance: AxiosInstance;
    private securityData: SecurityDataType | null = null;
    private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
    private secure?: boolean;
    private format?: ResponseType;

    constructor({
                    securityWorker,
                    secure,
                    format,
                    ...axiosConfig
                }: ApiConfig<SecurityDataType> = {}) {
        this.instance = axios.create({
            baseURL: axiosConfig.baseURL || "http://omdbapi.com",
            ...axiosConfig,
        });

        this.securityWorker = securityWorker;
        this.secure = secure;
        this.format = format;
    }

    public setSecurityData = (data: SecurityDataType | null) => {
        this.securityData = data;
    };

    /**
     * ✅ Clean merging logic — no spreading of internal defaults
     */
    protected mergeRequestParams(
        params1: AxiosRequestConfig,
        params2?: AxiosRequestConfig
    ): AxiosRequestConfig {
        const method = (params2?.method || params1.method || "get").toLowerCase();

        const defaultHeaders = {
            ...(this.instance.defaults.headers?.common || {}),
            ...(this.instance.defaults.headers?.[method as keyof HeadersDefaults] || {}),
        };

        return {
            // keep only explicit useful defaults
            baseURL: this.instance.defaults.baseURL,
            timeout: this.instance.defaults.timeout,
            ...params1,
            ...params2,
            headers: {
                ...defaultHeaders,
                ...(params1.headers || {}),
                ...(params2?.headers || {}),
            },
        };
    }

    protected stringifyFormItem(formItem: unknown): string {
        if (typeof formItem === "object" && formItem !== null) {
            return JSON.stringify(formItem);
        }
        return String(formItem);
    }

    protected createFormData(input: Record<string, unknown>): FormData {
        if (input instanceof FormData) return input;

        return Object.keys(input || {}).reduce((formData, key) => {
            const value = input[key];
            const items = Array.isArray(value) ? value : [value];
            for (const item of items) {
                const isFile = item instanceof Blob || item instanceof File;
                formData.append(key, isFile ? item : this.stringifyFormItem(item));
            }
            return formData;
        }, new FormData());
    }

    /**
     * ✅ Safe request builder for all types
     */
    public async request<T = any, _E = any>({
                                                secure,
                                                path,
                                                type,
                                                query,
                                                format,
                                                body,
                                                ...params
                                            }: FullRequestParams): Promise<T> {
        const secureParams =
            ((typeof secure === "boolean" ? secure : this.secure) &&
                this.securityWorker &&
                (await this.securityWorker(this.securityData))) ||
            {};

        const requestParams = this.mergeRequestParams(params, secureParams);
        const responseFormat = format || this.format || undefined;

        // handle body type transformation
        let requestBody = body;
        let contentType: string | undefined;

        if (type === ContentType.FormData && body && typeof body === "object") {
            requestBody = this.createFormData(body as Record<string, unknown>);
            contentType = ContentType.FormData;
        } else if (type === ContentType.Text && typeof body !== "string") {
            requestBody = JSON.stringify(body);
            contentType = ContentType.Text;
        } else if (type === ContentType.Json && body) {
            requestBody = body;
            contentType = ContentType.Json;
        }

        return this.instance
            .request({
                ...requestParams,
                url: path,
                method: requestParams.method || "GET",
                params: {
                    ...(requestParams.params || {}),
                    ...(query || {}),
                },
                data: requestBody,
                responseType: responseFormat,
                headers: {
                    ...(requestParams.headers || {}),
                    ...(contentType ? {"Content-Type": contentType} : {}),
                },
            })
            .then((response) => response.data);
    }
}


/**
 * @title OMDb API
 * @version 1.0
 * @license CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)
 * @termsOfService http://omdbapi.com/legal.htm
 * @baseUrl http://omdbapi.com
 * @contact <bfritz@fadingsignal.com>
 *
 * OMDb API requires an API key. Get a free key here: [http://omdbapi.com/apikey.aspx](http://omdbapi.com/apikey.aspx)
 */
export class OmdbApi<
    SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
    title = {
        /**
         * No description
         *
         * @tags Title Parameter
         * @name GetTitle
         * @summary Returns the most popular match for a given title
         * @request GET:/?t
         * @secure
         * @response `200` `GetTitleData` Successful response
         * @response `401` `void` Not authenticated
         */
        getByParams: (query: GetTitleParams, params: RequestParams = {}) =>
            this.request<GetTitleData, void>({
                method: "GET",
                query: query,
                secure: true,
                ...params,
            }),
        /**
         * No description
         *
         * @tags ID Parameter
         * @name GetById
         * @summary Returns a single result by IMDb ID
         * @request GET:/?i
         * @secure
         * @response `200` `GetIdData` Successful response
         * @response `401` `void` Not authenticated
         */
        getById: (query: GetIdParams, params: RequestParams = {}) =>
            this.request<GetIdData, void>({
                method: "GET",
                query: query,
                secure: true,
                ...params,
            }),
    };
    search = {
        /**
         * No description
         *
         * @tags Search Parameter
         * @name TitleSearch
         * @summary Returns an array of results for a keyword
         * @request GET:/?s
         * @secure
         * @response `200` `TitleSearchData` Successful response
         * @response `401` `void` Not authenticated
         */
        titleSearch: (query: TitleSearchParams, params: RequestParams = {}) =>
            this.request<TitleSearchData, void>({
                method: "GET",
                query: query,
                secure: true,
                ...params,
            }),
    };
}
