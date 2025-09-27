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
            ...axiosConfig,
            baseURL: axiosConfig.baseURL || "http://omdbapi.com",
        });
        this.secure = secure;
        this.format = format;
        this.securityWorker = securityWorker;
    }

    public setSecurityData = (data: SecurityDataType | null) => {
        this.securityData = data;
    };

    protected mergeRequestParams(
        params1: AxiosRequestConfig,
        params2?: AxiosRequestConfig,
    ): AxiosRequestConfig {
        const method = params1.method || (params2 && params2.method);

        return {
            ...this.instance.defaults,
            ...params1,
            ...(params2 || {}),
            headers: {
                ...((method &&
                        this.instance.defaults.headers[
                            method.toLowerCase() as keyof HeadersDefaults
                            ]) ||
                    {}),
                ...(params1.headers || {}),
                ...((params2 && params2.headers) || {}),
            },
        };
    }

    protected stringifyFormItem(formItem: unknown) {
        if (typeof formItem === "object" && formItem !== null) {
            return JSON.stringify(formItem);
        } else {
            return `${formItem}`;
        }
    }

    protected createFormData(input: Record<string, unknown>): FormData {
        if (input instanceof FormData) {
            return input;
        }
        return Object.keys(input || {}).reduce((formData, key) => {
            const property = input[key];
            const propertyContent: any[] =
                property instanceof Array ? property : [property];

            for (const formItem of propertyContent) {
                const isFileType = formItem instanceof Blob || formItem instanceof File;
                formData.append(
                    key,
                    isFileType ? formItem : this.stringifyFormItem(formItem),
                );
            }

            return formData;
        }, new FormData());
    }

    public request = async <T = any, _E = any>({
                                                   secure,
                                                   path,
                                                   type,
                                                   query,
                                                   format,
                                                   body,
                                                   ...params
                                               }: FullRequestParams): Promise<T> => {
        const secureParams =
            ((typeof secure === "boolean" ? secure : this.secure) &&
                this.securityWorker &&
                (await this.securityWorker(this.securityData))) ||
            {};

        const requestParams = this.mergeRequestParams(params, secureParams);
        const responseFormat = format || this.format || undefined;

        if (
            type === ContentType.FormData &&
            body &&
            body !== null &&
            typeof body === "object"
        ) {
            body = this.createFormData(body as Record<string, unknown>);
        }

        if (
            type === ContentType.Text &&
            body &&
            body !== null &&
            typeof body !== "string"
        ) {
            body = JSON.stringify(body);
        }

        return this.instance
            .request({
                headers: {
                    ...(requestParams.headers || {}),
                    ...(type ? {"Content-Type": type} : {}),
                },
                params: query,
                responseType: responseFormat,
                data: body,
                url: path,
                ...requestParams,
            })
            .then((response) => response.data);
    };
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
                path: `/?t`,
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
                path: `/?i`,
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
                path: `/?s`,
                method: "GET",
                query: query,
                secure: true,
                ...params,
            }),
    };
}
