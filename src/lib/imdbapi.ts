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

/**
 * TitleType defines the type of title in the IMDb API.
 *
 *  - MOVIE: Represents a movie title.
 *  - TV_SERIES: Represents a TV series title.
 *  - TV_MINI_SERIES: Represents a TV mini-series title.
 *  - TV_SPECIAL: Represents a TV special title.
 *  - TV_MOVIE: Represents a TV movie title.
 *  - SHORT: Represents a short title.
 *  - VIDEO: Represents a video title.
 *  - VIDEO_GAME: Represents a video game title.
 */
export enum ImdbapiTitleType {
  MOVIE = "MOVIE",
  TV_SERIES = "TV_SERIES",
  TV_MINI_SERIES = "TV_MINI_SERIES",
  TV_SPECIAL = "TV_SPECIAL",
  TV_MOVIE = "TV_MOVIE",
  SHORT = "SHORT",
  VIDEO = "VIDEO",
  VIDEO_GAME = "VIDEO_GAME",
}

/**
 *  - SORT_BY_POPULARITY: Sort by popularity.
 * This is used to rank titles based on their popularity, which can be influenced by various factors
 * such as viewership, ratings, and cultural impact.
 *  - SORT_BY_RELEASE_DATE: Sort by release date.
 * This is used to rank titles based on their release dates, with newer titles typically appearing
 * before older ones.
 *  - SORT_BY_USER_RATING: Sort by user rating.
 * This is used to rank titles based on the average user rating, which reflects the overall audience reception.
 *  - SORT_BY_USER_RATING_COUNT: Sort by user rating count.
 * This is used to rank titles based on the number of user ratings they have received,
 * which can indicate the level of engagement or popularity among viewers.
 *  - SORT_BY_YEAR: Sort by year.
 * This is used to rank titles based on their release year, with newer titles typically appearing before older ones.
 */
export enum ImdbapiTitleSortBy {
  SORT_BY_POPULARITY = "SORT_BY_POPULARITY",
  SORT_BY_RELEASE_DATE = "SORT_BY_RELEASE_DATE",
  SORT_BY_USER_RATING = "SORT_BY_USER_RATING",
  SORT_BY_USER_RATING_COUNT = "SORT_BY_USER_RATING_COUNT",
  SORT_BY_YEAR = "SORT_BY_YEAR",
}

/**
 *  - ASC: Sort in ascending order.
 *  - DESC: Sort in descending order.
 */
export enum ImdbapiSortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

/**
 * ParentsGuideCategory defines the categories for the Parents Guide.
 *
 *  - SEXUAL_CONTENT: Sex & Nudity
 *  - VIOLENCE: Violence & Gore
 *  - PROFANITY: Profanity
 *  - ALCOHOL_DRUGS: Alcohol, Drugs & Smoking
 *  - FRIGHTENING_INTENSE_SCENES: Frightening & Intense Scenes
 */
export enum ImdbapiParentsGuideCategory {
  SEXUAL_CONTENT = "SEXUAL_CONTENT",
  VIOLENCE = "VIOLENCE",
  PROFANITY = "PROFANITY",
  ALCOHOL_DRUGS = "ALCOHOL_DRUGS",
  FRIGHTENING_INTENSE_SCENES = "FRIGHTENING_INTENSE_SCENES",
}

/**
 * The AKA (Also Known As) message represents alternative titles
 * for a movie or TV show in different languages and countries.
 */
export interface ImdbapiAKA {
  /** The display text of the title in the specified language and country. */
  text?: string;
  /** The country where this title is used, represented by its ISO 3166-1 alpha-2 code. */
  country?: ImdbapiCountry;
  /** The language of the title, represented by its ISO 639-3 code. */
  language?: ImdbapiLanguage;
  /**
   * Additional attributes related to the title,
   * such as "original title", "working title", or "alternative title".
   */
  attributes?: string[];
}

/**
 * AwardNomination represents a nomination for an award.
 *
 * The unique identifier for the award nomination.
 *   string id = 1  [(google.api.field_visibility).restriction = "INTERNAL"];
 */
export interface ImdbapiAwardNomination {
  /** The titles associated with the award nomination. */
  titles?: ImdbapiTitle[];
  /** The nominees associated with the award nomination. */
  nominees?: ImdbapiName[];
  /** The event associated with the award nomination. */
  event?: ImdbapiEvent;
  /**
   * The year of the award nomination.
   * @format int32
   */
  year?: number;
  /** The text description of the award nomination. */
  text?: string;
  /** The category of the award nomination. */
  category?: string;
  /** Whether the nomination is a winner. */
  isWinner?: boolean;
  /**
   * The rank of the winner in the nomination.
   * @format int32
   */
  winnerRank?: number;
}

export interface ImdbapiAwardNominationStats {
  /** @format int32 */
  nominationCount?: number;
  /** @format int32 */
  winCount?: number;
}

/** Response message for batch getting names by their IDs. */
export interface ImdbapiBatchGetNamesResponse {
  /** List of names retrieved by their IMDb IDs. */
  names?: ImdbapiName[];
}

export interface ImdbapiBatchGetTitlesResponse {
  /** List of titles retrieved by their IMDb IDs. */
  titles?: ImdbapiTitle[];
}

export interface ImdbapiBoxOffice {
  /** The domestic box office gross for the movie. */
  domesticGross?: ImdbapiMoney;
  /** The total worldwide box office gross for the movie. */
  worldwideGross?: ImdbapiMoney;
  /** The opening weekend box office gross for the movie. */
  openingWeekendGross?: ImdbapiOpeningWeekendGross;
  /** The production budget for the movie. */
  productionBudget?: ImdbapiMoney;
}

/** The Certificate message represents a content rating certificate for a title. */
export interface ImdbapiCertificate {
  /** The rating of the certificate, such as "PG-13", "R", etc. */
  rating?: string;
  /** The country where this certificate is issued. */
  country?: ImdbapiCountry;
  /** Additional attributes related to the certificate, */
  attributes?: string[];
}

export interface ImdbapiCompany {
  /** Unique identifier for the company. */
  id?: string;
  /** Name of the company. */
  name?: string;
}

export interface ImdbapiCompanyCredit {
  /** Company associated with the credit. */
  company?: ImdbapiCompany;
  /** Category of the company credit, such as production, sales, distribution, etc. */
  category?: string;
  /** Countries where the company is based or operates. */
  countries?: ImdbapiCountry[];
  /** YearsInvolved represents the years a company was involved in a project. */
  yearsInvolved?: ImdbapiYearsInvolved;
  /** // Additional attributes related to the company credit */
  attributes?: string[];
}

export interface ImdbapiCountry {
  /** The ISO 3166-1 alpha-2 country code for the title, (e.g. "US" for the United States, "JP" for Japan) */
  code?: string;
  /** The name of the country in English. */
  name?: string;
}

/** The Credit message represents a credit for a person in a title. */
export interface ImdbapiCredit {
  /** The Title which this credit is associated with. */
  title?: ImdbapiTitle;
  /** The Name who is credited for this role. */
  name?: ImdbapiName;
  /** The category of the credit. */
  category?: string;
  /** The characters played by the actor/actress in the title. */
  characters?: string[];
  /**
   * The number of episodes in which the person has appeared.
   * @format int32
   */
  episodeCount?: number;
}

export interface ImdbapiEpisode {
  id?: string;
  title?: string;
  /** The Image message represents an image associated with a person or title in the IMDb database. */
  primaryImage?: ImdbapiImage;
  season?: string;
  /** @format int32 */
  episodeNumber?: number;
  /** @format int32 */
  runtimeSeconds?: number;
  plot?: string;
  /** The Rating message represents the aggregate rating and votes count for a title. */
  rating?: ImdbapiRating;
  /**
   * The PrecisionDate message represents a specific date,
   * typically used for birth dates, death dates, or release dates.
   */
  releaseDate?: ImdbapiPrecisionDate;
}

export interface ImdbapiEvent {
  /** The unique identifier for the event. */
  id?: string;
  /** The name of the event. */
  name?: string;
}

/** The Image message represents an image associated with a person or title in the IMDb database. */
export interface ImdbapiImage {
  /** The URL of the image, which can be used to access the image file. */
  url?: string;
  /**
   * The width of the image in pixels.
   * @format int32
   */
  width?: number;
  /**
   * The height of the image in pixels.
   * @format int32
   */
  height?: number;
  /** The type of the image, such as "poster", "still_frame", "event", etc. */
  type?: string;
}

/** Interest represents a specific interest in the IMDB API. */
export interface ImdbapiInterest {
  /** Unique identifier for the interest. */
  id?: string;
  /** The name of the interest, e.g., "Action", "Action Epic", "Adult Animation", etc. */
  name?: string;
  /** The primary image of the interest, which can be a poster or cover image. */
  primaryImage?: ImdbapiImage;
  /** A brief description of the interest, which can include details about the genre or type. */
  description?: string;
  /** Indicates whether the interest is a subgenre of another genre. */
  isSubgenre?: boolean;
  /** A list of similar interests that are related to this interest. */
  similarInterests?: ImdbapiInterest[];
}

/** InterestCategory represents a category of interests in the IMDB API. */
export interface ImdbapiInterestCategory {
  /** Unique identifier for the interest category. */
  category?: string;
  /** A list of interests that belong to this category. */
  interests?: ImdbapiInterest[];
}

/**
 * The AKA (Also Known As) message represents alternative titles
 * for a movie or TV show in different languages and countries.
 */
export interface ImdbapiLanguage {
  /** The ISO 639-3 language code for the title, (e.g. "eng" for English, "jpn" for Japanese) */
  code?: string;
  /** The name of the language in English. */
  name?: string;
}

/** Response message for listing interest categories. */
export interface ImdbapiListListInterestCategoriesResponse {
  /** List of available interest categories. */
  categories?: ImdbapiInterestCategory[];
}

/** Response message for listing filmography associated with a name. */
export interface ImdbapiListNameFilmographyResponse {
  /** List of filmography credits associated with the name. */
  credits?: ImdbapiCredit[];
  /**
   * Total count of filmography credits associated with the name.
   * @format int32
   */
  totalCount?: number;
  /** Token for the next page of results, if applicable. */
  nextPageToken?: string;
}

/** Response message for listing images associated with a name. */
export interface ImdbapiListNameImagesResponse {
  /** List of images associated with the name. */
  images?: ImdbapiImage[];
  /**
   * Total count of images associated with the name.
   * @format int32
   */
  totalCount?: number;
  /** Token for the next page of results, if applicable. */
  nextPageToken?: string;
}

/** Response message for listing relationships associated with a name. */
export interface ImdbapiListNameRelationshipsResponse {
  /** List of relationships associated with the name. */
  relationships?: ImdbapiNameRelationship[];
}

/** Response message for listing trivia associated with a name. */
export interface ImdbapiListNameTriviaResponse {
  /** List of trivia entries associated with the name. */
  triviaEntries?: ImdbapiNameTrivia[];
  /**
   * Total count of trivia entries associated with the name.
   * @format int32
   */
  totalCount?: number;
  /** Token for the next page of results, if applicable. */
  nextPageToken?: string;
}

/** Response message for listing star meter rankings. */
export interface ImdbapiListStarMetersResponse {
  /** List of names with their star meter rankings. */
  names?: ImdbapiName[];
  /** Token for the next page of results, if applicable. */
  nextPageToken?: string;
}

/** Response message for listing AKAs (Also Known As) associated with a title. */
export interface ImdbapiListTitleAKAsResponse {
  /** List of AKAs associated with the title. */
  akas?: ImdbapiAKA[];
}

/** Response message for listing award nominations associated with a title. */
export interface ImdbapiListTitleAwardNominationsResponse {
  /** Statistics about award nominations for the title. */
  stats?: ImdbapiAwardNominationStats;
  /** List of award nominations associated with the title. */
  awardNominations?: ImdbapiAwardNomination[];
  /** Token for the next page of results, if applicable. */
  nextPageToken?: string;
}

/** Response message for listing certificates associated with a title. */
export interface ImdbapiListTitleCertificatesResponse {
  /** List of certificates associated with the title. */
  certificates?: ImdbapiCertificate[];
  /**
   * Total count of certificates associated with the title.
   * @format int32
   */
  totalCount?: number;
}

/** Response message for listing company credits associated with a title. */
export interface ImdbapiListTitleCompanyCreditsResponse {
  /** List of company credits associated with the title. */
  companyCredits?: ImdbapiCompanyCredit[];
  /**
   * Total count of company credits matched for listing.
   * @format int32
   */
  totalCount?: number;
  /** Token for the next page of results, if applicable. */
  nextPageToken?: string;
}

/** Response message for listing credits associated with a title. */
export interface ImdbapiListTitleCreditsResponse {
  /** List of credits associated with the title. */
  credits?: ImdbapiCredit[];
  /**
   * Total count of credits associated with the title.
   * @format int32
   */
  totalCount?: number;
  /** Token for the next page of results, if applicable. */
  nextPageToken?: string;
}

export interface ImdbapiListTitleEpisodesResponse {
  /** List of episodes associated with the title. */
  episodes?: ImdbapiEpisode[];
  /**
   * The total number of episodes that have aired for this title.
   * @format int32
   */
  totalCount?: number;
  /** Token for the next page of results, if applicable. */
  nextPageToken?: string;
}

export interface ImdbapiListTitleImagesResponse {
  /** List of images associated with the title. */
  images?: ImdbapiImage[];
  /**
   * Total count of images associated with the title.
   * @format int32
   */
  totalCount?: number;
  /** Token for the next page of results, if applicable. */
  nextPageToken?: string;
}

/** Response message for listing parents guide associated with a title. */
export interface ImdbapiListTitleParentsGuideResponse {
  /** List of parents guide entries associated with the title. */
  parentsGuide?: ImdbapiParentsGuide[];
}

/** Response message for listing release dates associated with a title. */
export interface ImdbapiListTitleReleaseDatesResponse {
  /** List of release dates associated with the title. */
  releaseDates?: ImdbapiReleaseDate[];
}

export interface ImdbapiListTitleSeasonsResponse {
  /** List of seasons associated with the title. */
  seasons?: ImdbapiSeason[];
}

export interface ImdbapiListTitleVideosResponse {
  /** List of videos associated with the title. */
  videos?: ImdbapiVideo[];
  /**
   * Total count of videos associated with the title.
   * @format int32
   */
  totalCount?: number;
  /** Token for the next page of results, if applicable. */
  nextPageToken?: string;
}

/** Response message for listing titles. */
export interface ImdbapiListTitlesResponse {
  /** List of titles matching the request criteria. */
  titles?: ImdbapiTitle[];
  /**
   * Total number of titles matching the request criteria.
   * @format int32
   */
  totalCount?: number;
  /** Token for the next page of results, if applicable. */
  nextPageToken?: string;
}

/** Metacritic information for a movie or TV show. */
export interface ImdbapiMetacritic {
  /** Metacritic URL. */
  url?: string;
  /**
   * Metacritic score.
   * @format int32
   */
  score?: number;
  /**
   * Number of reviews.
   * @format int32
   */
  reviewCount?: number;
}

export interface ImdbapiMoney {
  /**
   * The amount of money in the box office.
   * @format int64
   */
  amount?: string;
  /** The currency of the money. */
  currency?: string;
}

/**
 * The Name message represents a person in the IMDb database,
 * such as an actor, director, or producer.
 */
export interface ImdbapiName {
  /** The unique identifier for the name in the IMDb database. */
  id?: string;
  /** The display name of the person, typically their full name. */
  displayName?: string;
  /**
   * Alternative names for the person, which may include stage names,
   * nicknames, or other variations.
   */
  alternativeNames?: string[];
  /** The primary image associated with the person, such as a profile picture. */
  primaryImage?: ImdbapiImage;
  /**
   * A list of primary professions associated with the person,
   * such as "Actor", "Director", "Producer", etc.
   */
  primaryProfessions?: string[];
  /**
   * A brief biography or description of the person, which may include
   * their career highlights, achievements, and other relevant information.
   */
  biography?: string;
  /**
   * The height of the person in centimeters.
   * @format int32
   */
  heightCm?: number;
  /** The birth name of the person, which may differ from their display name. */
  birthName?: string;
  /** The birth date of the person, represented as a Date message. */
  birthDate?: ImdbapiPrecisionDate;
  /** The birth location of the person, which may include the city and country of birth. */
  birthLocation?: string;
  /**
   * The death date of the person, represented as a Date message.
   * This field may be empty if the person is still alive.
   */
  deathDate?: ImdbapiPrecisionDate;
  /** The death location of the person, which may include the city and country of death. */
  deathLocation?: string;
  /** The reason for the person's death, if applicable. */
  deathReason?: string;
  /**
   * The IMDb popularity meter ranking for the person, which includes
   * their current rank, change direction, and difference from the previous measurement.
   * This field is optional and may not be present for all names.
   */
  meterRanking?: ImdbapiNameMeterRanking;
}

/**
 * The NameMeterRanking message represents the IMDb popularity meter ranking
 * for a person, including their current rank, change direction, and difference
 * from the previous measurement.
 * This ranking is used to indicate the popularity of the person over time.
 */
export interface ImdbapiNameMeterRanking {
  /**
   * The current rank of the person in the IMDb popularity meter.
   * @format int32
   */
  currentRank?: number;
  /** The direction of the change in rank, which can be "UP", "DOWN", or "none". */
  changeDirection?: string;
  /**
   * The difference in rank compared to the previous measurement.
   * Positive for an increase, negative for a decrease, and zero for no change.
   * @format int32
   */
  difference?: number;
}

/**
 * The NameRelationship message represents a relationship between two names
 * in the IMDb database, such as family members, spouses, parents, children, etc.
 * Each relationship includes the related name, the type of relationship,
 * and any additional attributes associated with the relationship.
 */
export interface ImdbapiNameRelationship {
  /** The related name in the relationship. */
  name?: ImdbapiName;
  /** The type of relationship, such as "spouse", "parent", "child", etc. */
  relationType?: string;
  /** Additional attributes associated with the relationship. */
  attributes?: string[];
}

/** NameTrivia represents a trivia fact about a person (name). */
export interface ImdbapiNameTrivia {
  /** The unique identifier for the trivia. */
  id?: string;
  /** The trivia body text. */
  text?: string;
  /**
   * The number of users who have expressed interest in this trivia.
   * @format int32
   */
  interestCount?: number;
  /**
   * The number of votes this trivia has received.
   * @format int32
   */
  voteCount?: number;
}

export interface ImdbapiOpeningWeekendGross {
  /** The amount of money made in the opening weekend. */
  gross?: ImdbapiMoney;
  /** The date of the opening weekend. */
  weekendEndDate?: ImdbapiPrecisionDate;
}

export interface ImdbapiParentsGuide {
  /**
   * ParentsGuideCategory defines the categories for the Parents Guide.
   *
   *  - SEXUAL_CONTENT: Sex & Nudity
   *  - VIOLENCE: Violence & Gore
   *  - PROFANITY: Profanity
   *  - ALCOHOL_DRUGS: Alcohol, Drugs & Smoking
   *  - FRIGHTENING_INTENSE_SCENES: Frightening & Intense Scenes
   */
  category?: ImdbapiParentsGuideCategory;
  severityBreakdowns?: ImdbapiParentsGuideSeverity[];
  reviews?: ImdbapiParentsGuideReview[];
}

export interface ImdbapiParentsGuideReview {
  text?: string;
  isSpoiler?: boolean;
}

export interface ImdbapiParentsGuideSeverity {
  severityLevel?: string;
  /** @format int32 */
  voteCount?: number;
}

/**
 * The PrecisionDate message represents a specific date,
 * typically used for birth dates, death dates, or release dates.
 */
export interface ImdbapiPrecisionDate {
  /**
   * The year of the date, represented as an integer.
   * @format int32
   */
  year?: number;
  /**
   * The month of the date, represented as an integer.
   * @format int32
   */
  month?: number;
  /**
   * The day of the date, represented as an integer.
   * @format int32
   */
  day?: number;
}

/** The Rating message represents the aggregate rating and votes count for a title. */
export interface ImdbapiRating {
  /**
   * The aggregate_rating field contains the average rating of the title,
   * typically on a scale from 1 to 10.
   * @format float
   */
  aggregateRating?: number;
  /**
   * The votes_count field contains the total number of votes cast for the title.
   * @format int32
   */
  voteCount?: number;
}

/** The ReleaseDate message represents the release date of a title in a specific country. */
export interface ImdbapiReleaseDate {
  /** The country where the title was released, */
  country?: ImdbapiCountry;
  /** The date when the title was released in the specified country. */
  releaseDate?: ImdbapiPrecisionDate;
  /**
   * The attributes field contains additional attributes related to the release date.
   *
   * These attributes can include information such as
   * the format of the release (e.g., "Theatrical", "DVD", "Blu-ray").
   */
  attributes?: string[];
}

/** Response message for searching titles. */
export interface ImdbapiSearchTitlesResponse {
  /** List of titles matching the search query. */
  titles?: ImdbapiTitle[];
}

export interface ImdbapiSeason {
  season?: string;
  /** @format int32 */
  episodeCount?: number;
}

export interface ImdbapiTitle {
  /** The unique identifier for the title. */
  id?: string;
  /** The type of the title, such as "movie", "tvSeries", "tvEpisode", etc. */
  type?: string;
  /** The is_adult field indicates whether the title is intended for adult audiences. */
  isAdult?: boolean;
  /** The primary title of the title, which is typically the most recognized name. */
  primaryTitle?: string;
  /** The original title of the title, normally which is the title as it was originally released. */
  originalTitle?: string;
  /** The primary image associated with the title, such as a poster. */
  primaryImage?: ImdbapiImage;
  /**
   * The start_year field is used for titles that have a defined start, such as movies or TV series.
   * @format int32
   */
  startYear?: number;
  /**
   * The end_year field is used for titles that have a defined end, such as TV series.
   * @format int32
   */
  endYear?: number;
  /**
   * The runtime_seconds field contains the total runtime of the title in minutes.
   * @format int32
   */
  runtimeSeconds?: number;
  /** The genres field contains a list of genres associated with the title. */
  genres?: string[];
  /** The rating field contains the aggregate rating and the number of votes for the title. */
  rating?: ImdbapiRating;
  /** The metacritic information for the title, such as score and reviews. */
  metacritic?: ImdbapiMetacritic;
  /** The plot field contains a brief summary or description of the title's storyline. */
  plot?: string;
  /** The list of directors associated with the title, which can include multiple directors. */
  directors?: ImdbapiName[];
  /** The list of writers associated with the title, which can include multiple writers. */
  writers?: ImdbapiName[];
  /** The list of stars associated with the title, which can include multiple actors or actresses. */
  stars?: ImdbapiName[];
  /** The list of countries where the title was produced or is associated with. */
  originCountries?: ImdbapiCountry[];
  /** The list of languages spoken in the title, which can include multiple languages. */
  spokenLanguages?: ImdbapiLanguage[];
  /** The list of interests associated with the title. */
  interests?: ImdbapiInterest[];
}

/** Video is a message that represents a video associated with a title. */
export interface ImdbapiVideo {
  /** The unique identifier for the video. */
  id?: string;
  /** The type of the video. */
  type?: string;
  /** The name of the video. */
  name?: string;
  /** The primary image of the video. */
  primaryImage?: ImdbapiImage;
  /** A description of the video. */
  description?: string;
  /**
   * The width of the video in pixels.
   * @format int32
   */
  width?: number;
  /**
   * The height of the video in pixels.
   * @format int32
   */
  height?: number;
  /**
   * The runtime of the video in seconds.
   * @format int32
   */
  runtimeSeconds?: number;
}

export interface ImdbapiYearsInvolved {
  /**
   * Start year of involvement
   * @format int32
   */
  startYear?: number;
  /**
   * End year of involvement
   * @format int32
   */
  endYear?: number;
}

export interface ProtobufAny {
  "@type"?: string;
  [key: string]: any;
}

export interface RpcStatus {
  /** @format int32 */
  code?: number;
  message?: string;
  details?: ProtobufAny[];
}

export interface ImDbApiServiceListTitlesParams {
  /**
   * Optional. The type of titles to filter by.
   * If not specified, all types are returned.
   *
   *  - MOVIE: Represents a movie title.
   *  - TV_SERIES: Represents a TV series title.
   *  - TV_MINI_SERIES: Represents a TV mini-series title.
   *  - TV_SPECIAL: Represents a TV special title.
   *  - TV_MOVIE: Represents a TV movie title.
   *  - SHORT: Represents a short title.
   *  - VIDEO: Represents a video title.
   *  - VIDEO_GAME: Represents a video game title.
   */
  types?: (
    | "MOVIE"
    | "TV_SERIES"
    | "TV_MINI_SERIES"
    | "TV_SPECIAL"
    | "TV_MOVIE"
    | "SHORT"
    | "VIDEO"
    | "VIDEO_GAME"
  )[];
  /**
   * Optional. The genres to filter titles by.
   * If not specified, titles from all genres are returned.
   */
  genres?: string[];
  /**
   * Optional. The ISO 3166-1 alpha-2 country codes to filter titles by.
   * If not specified, titles from all countries are returned.
   * Example: "US" for United States, "GB" for United Kingdom.
   */
  countryCodes?: string[];
  /**
   * Optional. The ISO 639-1 or ISO 639-2 language codes to filter titles by.
   * If not specified, titles in all languages are returned.
   */
  languageCodes?: string[];
  /** Optional. The IDs of names to filter titles by. */
  nameIds?: string[];
  /**
   * Optional. The IDs of interests to filter titles by.
   * If not specified, titles associated with all interests are returned.
   */
  interestIds?: string[];
  /**
   * Optional. The start year for filtering titles.
   * @format int32
   */
  startYear?: number;
  /**
   * Optional. The end year for filtering titles.
   * @format int32
   */
  endYear?: number;
  /**
   * Optional. The minimum number of votes a title must have to be included.
   * If not specified, titles with any number of votes are included.
   * The value must be between 0 and 1,000,000,000.
   * Default is 0.
   * @format int32
   */
  minVoteCount?: number;
  /**
   * Optional. The maximum number of votes a title can have to be included.
   * If not specified, titles with any number of votes are included.
   * The value must be between 0 and 1,000,000,000.
   * @format int32
   */
  maxVoteCount?: number;
  /**
   * Optional. The minimum rating a title must have to be included.
   * If not specified, titles with any rating are included.
   * The value must be between 0.0 and 10.0.
   * @format float
   */
  minAggregateRating?: number;
  /**
   * Optional. The maximum rating a title can have to be included.
   * If not specified, titles with any rating are included.
   * The value must be between 0.0 and 10.0.
   * @format float
   */
  maxAggregateRating?: number;
  /**
   * Optional. The sorting order for the titles.
   * If not specified, titles are sorted by popularity.
   *
   *  - SORT_BY_POPULARITY: Sort by popularity.
   * This is used to rank titles based on their popularity, which can be influenced by various factors
   * such as viewership, ratings, and cultural impact.
   *  - SORT_BY_RELEASE_DATE: Sort by release date.
   * This is used to rank titles based on their release dates, with newer titles typically appearing
   * before older ones.
   *  - SORT_BY_USER_RATING: Sort by user rating.
   * This is used to rank titles based on the average user rating, which reflects the overall audience reception.
   *  - SORT_BY_USER_RATING_COUNT: Sort by user rating count.
   * This is used to rank titles based on the number of user ratings they have received,
   * which can indicate the level of engagement or popularity among viewers.
   *  - SORT_BY_YEAR: Sort by year.
   * This is used to rank titles based on their release year, with newer titles typically appearing before older ones.
   */
  sortBy?:
    | "SORT_BY_POPULARITY"
    | "SORT_BY_RELEASE_DATE"
    | "SORT_BY_USER_RATING"
    | "SORT_BY_USER_RATING_COUNT"
    | "SORT_BY_YEAR";
  /**
   * Optional. The sorting order for the titles.
   * If not specified, titles are sorted in ascending order.
   *
   *  - ASC: Sort in ascending order.
   *  - DESC: Sort in descending order.
   */
  sortOrder?: "ASC" | "DESC";
  /** Optional. Token for pagination, if applicable. */
  pageToken?: string;
}

export type ImDbApiServiceListTitlesData = ImdbapiListTitlesResponse;

export interface ImDbApiServiceGetTitleParams {
  /** The IMDb title ID in the format 'tt1234567'. */
  titleId: string;
}

export type ImDbApiServiceGetTitleData = ImdbapiTitle;

export interface ImDbApiServiceBatchGetTitlesParams {
  /** List of IMDb title IDs. Maximum 5 IDs. */
  titleIds: string[];
  batchGet: string;
}

export type ImDbApiServiceBatchGetTitlesData = ImdbapiBatchGetTitlesResponse;

export interface ImDbApiServiceListTitleCreditsParams {
  /** Optional. The categories of credits to filter by. */
  categories?: string[];
  /**
   * Optional. The maximum number of credits to return per page.
   * If not specified, a default value will be used.
   *
   * The value must be between 1 and 50. Default is 20.
   * @format int32
   */
  pageSize?: number;
  /** Optional. Token for pagination, if applicable. */
  pageToken?: string;
  /** Required. IMDb title ID in the format "tt1234567". */
  titleId: string;
}

export type ImDbApiServiceListTitleCreditsData =
  ImdbapiListTitleCreditsResponse;

export interface ImDbApiServiceListTitleReleaseDatesParams {
  /** Required. IMDb title ID in the format "tt1234567". */
  titleId: string;
}

export type ImDbApiServiceListTitleReleaseDatesData =
  ImdbapiListTitleReleaseDatesResponse;

export interface ImDbApiServiceListTitleAkAsParams {
  /** Required. IMDb title ID in the format "tt1234567". */
  titleId: string;
}

export type ImDbApiServiceListTitleAkAsData = ImdbapiListTitleAKAsResponse;

export interface ImDbApiServiceListTitleSeasonsParams {
  /** Required. IMDb title ID in the format "tt1234567". */
  titleId: string;
}

export type ImDbApiServiceListTitleSeasonsData =
  ImdbapiListTitleSeasonsResponse;

export interface ImDbApiServiceListTitleEpisodesParams {
  /** Optional. The season number to filter episodes by. */
  season?: string;
  /**
   * Optional. The maximum number of episodes to return per page.
   * If not specified, a default value will be used.
   *
   * The value must be between 1 and 50. Default is 20.
   * @format int32
   */
  pageSize?: number;
  /** Optional. Token for pagination, if applicable. */
  pageToken?: string;
  /** Required. IMDb title ID in the format "tt1234567". */
  titleId: string;
}

export type ImDbApiServiceListTitleEpisodesData =
  ImdbapiListTitleEpisodesResponse;

export interface ImDbApiServiceListTitleImagesParams {
  /**
   * Optional. The types of images to filter by.
   * If not specified, all types are returned.
   */
  types?: string[];
  /**
   * Optional. The maximum number of images to return per page.
   * If not specified, a default value will be used.
   *
   * The value must be between 1 and 50. Default is 20.
   * @format int32
   */
  pageSize?: number;
  /** Optional. Token for pagination, if applicable. */
  pageToken?: string;
  /** Required. IMDb title ID in the format "tt1234567". */
  titleId: string;
}

export type ImDbApiServiceListTitleImagesData = ImdbapiListTitleImagesResponse;

export interface ImDbApiServiceListTitleVideosParams {
  /**
   * Optional. The types of videos to filter by.
   * If not specified, all types are returned.
   */
  types?: string[];
  /**
   * Optional. The maximum number of videos to return per page.
   * If not specified, a default value will be used.
   *
   * The value must be between 1 and 50. Default is 20.
   * @format int32
   */
  pageSize?: number;
  /** Optional. Token for pagination, if applicable. */
  pageToken?: string;
  /** Required. IMDb title ID in the format "tt1234567". */
  titleId: string;
}

export type ImDbApiServiceListTitleVideosData = ImdbapiListTitleVideosResponse;

export interface ImDbApiServiceListTitleAwardNominationsParams {
  /**
   * Optional. The maximum number of award nominations to return per page.
   * If not specified, a default value will be used.
   *
   * The value must be between 1 and 50. Default is 20.
   * @format int32
   */
  pageSize?: number;
  /** Optional. Token for pagination, if applicable. */
  pageToken?: string;
  /** Required. IMDb title ID in the format "tt1234567". */
  titleId: string;
}

export type ImDbApiServiceListTitleAwardNominationsData =
  ImdbapiListTitleAwardNominationsResponse;

export interface ImDbApiServiceListTitleParentsGuideParams {
  /** Required. IMDb title ID in the format "tt1234567". */
  titleId: string;
}

export type ImDbApiServiceListTitleParentsGuideData =
  ImdbapiListTitleParentsGuideResponse;

export interface ImDbApiServiceListTitleCertificatesParams {
  /** Required. IMDb title ID in the format "tt1234567". */
  titleId: string;
}

export type ImDbApiServiceListTitleCertificatesData =
  ImdbapiListTitleCertificatesResponse;

export interface ImDbApiServiceListTitleCompanyCreditsParams {
  /** Optional. The categories of company credits to filter by. */
  categories?: string[];
  /**
   * Optional. The maximum number of company credits to return per page.
   * If not specified, a default value will be used.
   *
   * The value must be between 1 and 50. Default is 20.
   * @format int32
   */
  pageSize?: number;
  /** Optional. Token for pagination, if applicable. */
  pageToken?: string;
  /** Required. IMDb title ID in the format "tt1234567". */
  titleId: string;
}

export type ImDbApiServiceListTitleCompanyCreditsData =
  ImdbapiListTitleCompanyCreditsResponse;

export interface ImDbApiServiceGetTitleBoxOfficeParams {
  /** Required. IMDb title ID in the format "tt1234567". */
  titleId: string;
}

export type ImDbApiServiceGetTitleBoxOfficeData = ImdbapiBoxOffice;

export interface ImDbApiServiceSearchTitlesParams {
  /** Required. The search query for titles. */
  query: string;
  /**
   * Optional. Limit the number of results returned.
   * Maximum is 50.
   * @format int32
   */
  limit?: number;
}

export type ImDbApiServiceSearchTitlesData = ImdbapiSearchTitlesResponse;

export interface ImDbApiServiceGetNameParams {
  /** Required. IMDB name ID in the format "nm1234567". */
  nameId: string;
}

export type ImDbApiServiceGetNameData = ImdbapiName;

export interface ImDbApiServiceListNameImagesParams {
  /**
   * Optional. The types of images to filter by.
   * If not specified, all types are returned.
   */
  types?: string[];
  /**
   * Optional. The maximum number of images to return per page.
   * If not specified, a default value will be used.
   *
   * The value must be between 1 and 50. Default is 20.
   * @format int32
   */
  pageSize?: number;
  /** Optional. Token for pagination, if applicable. */
  pageToken?: string;
  /** Required. IMDB name ID in the format "nm1234567". */
  nameId: string;
}

export type ImDbApiServiceListNameImagesData = ImdbapiListNameImagesResponse;

export interface ImDbApiServiceListNameFilmographyParams {
  /**
   * Optional. The categories of credits to filter by.
   * If not specified, all categories are returned.
   */
  categories?: string[];
  /**
   * Optional. The maximum number of credits to return per page.
   * If not specified, a default value will be used.
   *
   * The value must be between 1 and 50. Default is 20.
   * @format int32
   */
  pageSize?: number;
  /** Optional. Token for pagination, if applicable. */
  pageToken?: string;
  /** Required. IMDB name ID in the format "nm1234567". */
  nameId: string;
}

export type ImDbApiServiceListNameFilmographyData =
  ImdbapiListNameFilmographyResponse;

export interface ImDbApiServiceListNameRelationshipsParams {
  /** Required. IMDB name ID in the format "nm1234567". */
  nameId: string;
}

export type ImDbApiServiceListNameRelationshipsData =
  ImdbapiListNameRelationshipsResponse;

export interface ImDbApiServiceListNameTriviaParams {
  /**
   * Optional. The maximum number of trivia entries to return per page.
   * If not specified, a default value will be used.
   *
   * The value must be between 1 and 50. Default is 20.
   * @format int32
   */
  pageSize?: number;
  /** Optional. Token for pagination, if applicable. */
  pageToken?: string;
  /** Required. IMDB name ID in the format "nm1234567". */
  nameId: string;
}

export type ImDbApiServiceListNameTriviaData = ImdbapiListNameTriviaResponse;

export interface ImDbApiServiceBatchGetNamesParams {
  /**
   * Required. List of IMDb name IDs in the format "nm1234567".
   * The maximum number of IDs is 5.
   */
  nameIds: string[];
  batchGet: string;
}

export type ImDbApiServiceBatchGetNamesData = ImdbapiBatchGetNamesResponse;

export interface ImDbApiServiceListStarMetersParams {
  /** Optional. Token for pagination, if applicable. */
  pageToken?: string;
}

export type ImDbApiServiceListStarMetersData = ImdbapiListStarMetersResponse;

export type ImDbApiServiceListInterestCategoriesData =
  ImdbapiListListInterestCategoriesResponse;

export interface ImDbApiServiceGetInterestParams {
  /** Required. The ID of the interest to retrieve. */
  interestId: string;
}

export type ImDbApiServiceGetInterestData = ImdbapiInterest;

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
      baseURL: axiosConfig.baseURL || "https://api.imdbapi.dev",
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
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type ? { "Content-Type": type } : {}),
        },
        params: query,
        responseType: responseFormat,
        data: body,
        url: path,
      })
      .then((response) => response.data);
  };
}

/**
 * @title IMDbAPI
 * @version 2.7.9
 * @baseUrl https://api.imdbapi.dev
 * @contact Telegram Group (https://t.me/imdbapi)
 *
 * IMDb API for accessing movie and TV show data
 */
export class ImdbApi<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  titles = {
    /**
     * @description Retrieve a list of titles with optional filters.
     *
     * @tags Title
     * @name ImDbApiServiceListTitles
     * @summary List titles
     * @request GET:/titles
     * @response `200` `ImDbApiServiceListTitlesData` A successful response.
     * @response `default` `RpcStatus` An unexpected error response.
     */
    imDbApiServiceListTitles: (
      query: ImDbApiServiceListTitlesParams,
      params: RequestParams = {},
    ) =>
      this.request<ImDbApiServiceListTitlesData, RpcStatus>({
        path: `/titles`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve a title's details using its IMDb ID.
     *
     * @tags Title
     * @name ImDbApiServiceGetTitle
     * @summary Get title by ID
     * @request GET:/titles/{titleId}
     * @response `200` `ImDbApiServiceGetTitleData` A successful response.
     * @response `default` `RpcStatus` An unexpected error response.
     */
    imDbApiServiceGetTitle: (
      { titleId, ...query }: ImDbApiServiceGetTitleParams,
      params: RequestParams = {},
    ) =>
      this.request<ImDbApiServiceGetTitleData, RpcStatus>({
        path: `/titles/${titleId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve the credits associated with a specific title.
     *
     * @tags Title
     * @name ImDbApiServiceListTitleCredits
     * @summary List credits for a title
     * @request GET:/titles/{titleId}/credits
     * @response `200` `ImDbApiServiceListTitleCreditsData` A successful response.
     * @response `default` `RpcStatus` An unexpected error response.
     */
    imDbApiServiceListTitleCredits: (
      { titleId, ...query }: ImDbApiServiceListTitleCreditsParams,
      params: RequestParams = {},
    ) =>
      this.request<ImDbApiServiceListTitleCreditsData, RpcStatus>({
        path: `/titles/${titleId}/credits`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve the release dates associated with a specific title.
     *
     * @tags Title
     * @name ImDbApiServiceListTitleReleaseDates
     * @summary List release dates for a title
     * @request GET:/titles/{titleId}/releaseDates
     * @response `200` `ImDbApiServiceListTitleReleaseDatesData` A successful response.
     * @response `default` `RpcStatus` An unexpected error response.
     */
    imDbApiServiceListTitleReleaseDates: (
      { titleId, ...query }: ImDbApiServiceListTitleReleaseDatesParams,
      params: RequestParams = {},
    ) =>
      this.request<ImDbApiServiceListTitleReleaseDatesData, RpcStatus>({
        path: `/titles/${titleId}/releaseDates`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve the alternative titles (AKAs) associated with a specific title.
     *
     * @tags Title
     * @name ImDbApiServiceListTitleAkAs
     * @summary List AKAs for a title
     * @request GET:/titles/{titleId}/akas
     * @response `200` `ImDbApiServiceListTitleAkAsData` A successful response.
     * @response `default` `RpcStatus` An unexpected error response.
     */
    imDbApiServiceListTitleAkAs: (
      { titleId, ...query }: ImDbApiServiceListTitleAkAsParams,
      params: RequestParams = {},
    ) =>
      this.request<ImDbApiServiceListTitleAkAsData, RpcStatus>({
        path: `/titles/${titleId}/akas`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve the seasons associated with a specific title.
     *
     * @tags Title
     * @name ImDbApiServiceListTitleSeasons
     * @summary List seasons for a title
     * @request GET:/titles/{titleId}/seasons
     * @response `200` `ImDbApiServiceListTitleSeasonsData` A successful response.
     * @response `default` `RpcStatus` An unexpected error response.
     */
    imDbApiServiceListTitleSeasons: (
      { titleId, ...query }: ImDbApiServiceListTitleSeasonsParams,
      params: RequestParams = {},
    ) =>
      this.request<ImDbApiServiceListTitleSeasonsData, RpcStatus>({
        path: `/titles/${titleId}/seasons`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve the episodes associated with a specific title.
     *
     * @tags Title
     * @name ImDbApiServiceListTitleEpisodes
     * @summary List episodes for a title
     * @request GET:/titles/{titleId}/episodes
     * @response `200` `ImDbApiServiceListTitleEpisodesData` A successful response.
     * @response `default` `RpcStatus` An unexpected error response.
     */
    imDbApiServiceListTitleEpisodes: (
      { titleId, ...query }: ImDbApiServiceListTitleEpisodesParams,
      params: RequestParams = {},
    ) =>
      this.request<ImDbApiServiceListTitleEpisodesData, RpcStatus>({
        path: `/titles/${titleId}/episodes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve the images associated with a specific title.
     *
     * @tags Title
     * @name ImDbApiServiceListTitleImages
     * @summary List images for a title
     * @request GET:/titles/{titleId}/images
     * @response `200` `ImDbApiServiceListTitleImagesData` A successful response.
     * @response `default` `RpcStatus` An unexpected error response.
     */
    imDbApiServiceListTitleImages: (
      { titleId, ...query }: ImDbApiServiceListTitleImagesParams,
      params: RequestParams = {},
    ) =>
      this.request<ImDbApiServiceListTitleImagesData, RpcStatus>({
        path: `/titles/${titleId}/images`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve the videos associated with a specific title.
     *
     * @tags Title
     * @name ImDbApiServiceListTitleVideos
     * @summary List videos for a title
     * @request GET:/titles/{titleId}/videos
     * @response `200` `ImDbApiServiceListTitleVideosData` A successful response.
     * @response `default` `RpcStatus` An unexpected error response.
     */
    imDbApiServiceListTitleVideos: (
      { titleId, ...query }: ImDbApiServiceListTitleVideosParams,
      params: RequestParams = {},
    ) =>
      this.request<ImDbApiServiceListTitleVideosData, RpcStatus>({
        path: `/titles/${titleId}/videos`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve the award nominations associated with a specific title.
     *
     * @tags Title
     * @name ImDbApiServiceListTitleAwardNominations
     * @summary List award nominations for a title
     * @request GET:/titles/{titleId}/awardNominations
     * @response `200` `ImDbApiServiceListTitleAwardNominationsData` A successful response.
     * @response `default` `RpcStatus` An unexpected error response.
     */
    imDbApiServiceListTitleAwardNominations: (
      { titleId, ...query }: ImDbApiServiceListTitleAwardNominationsParams,
      params: RequestParams = {},
    ) =>
      this.request<ImDbApiServiceListTitleAwardNominationsData, RpcStatus>({
        path: `/titles/${titleId}/awardNominations`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve the parents guide associated with a specific title.
     *
     * @tags Title
     * @name ImDbApiServiceListTitleParentsGuide
     * @summary List parents guide for a title
     * @request GET:/titles/{titleId}/parentsGuide
     * @response `200` `ImDbApiServiceListTitleParentsGuideData` A successful response.
     * @response `default` `RpcStatus` An unexpected error response.
     */
    imDbApiServiceListTitleParentsGuide: (
      { titleId, ...query }: ImDbApiServiceListTitleParentsGuideParams,
      params: RequestParams = {},
    ) =>
      this.request<ImDbApiServiceListTitleParentsGuideData, RpcStatus>({
        path: `/titles/${titleId}/parentsGuide`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve the certificates associated with a specific title.
     *
     * @tags Title
     * @name ImDbApiServiceListTitleCertificates
     * @summary List certificates for a title
     * @request GET:/titles/{titleId}/certificates
     * @response `200` `ImDbApiServiceListTitleCertificatesData` A successful response.
     * @response `default` `RpcStatus` An unexpected error response.
     */
    imDbApiServiceListTitleCertificates: (
      { titleId, ...query }: ImDbApiServiceListTitleCertificatesParams,
      params: RequestParams = {},
    ) =>
      this.request<ImDbApiServiceListTitleCertificatesData, RpcStatus>({
        path: `/titles/${titleId}/certificates`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve the company credits associated with a specific title.
     *
     * @tags Title
     * @name ImDbApiServiceListTitleCompanyCredits
     * @summary List company credits for a title
     * @request GET:/titles/{titleId}/companyCredits
     * @response `200` `ImDbApiServiceListTitleCompanyCreditsData` A successful response.
     * @response `default` `RpcStatus` An unexpected error response.
     */
    imDbApiServiceListTitleCompanyCredits: (
      { titleId, ...query }: ImDbApiServiceListTitleCompanyCreditsParams,
      params: RequestParams = {},
    ) =>
      this.request<ImDbApiServiceListTitleCompanyCreditsData, RpcStatus>({
        path: `/titles/${titleId}/companyCredits`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve the box office information associated with a specific title.
     *
     * @tags Title
     * @name ImDbApiServiceGetTitleBoxOffice
     * @summary Get box office information for a title
     * @request GET:/titles/{titleId}/boxOffice
     * @response `200` `ImDbApiServiceGetTitleBoxOfficeData` A successful response.
     * @response `default` `RpcStatus` An unexpected error response.
     */
    imDbApiServiceGetTitleBoxOffice: (
      { titleId, ...query }: ImDbApiServiceGetTitleBoxOfficeParams,
      params: RequestParams = {},
    ) =>
      this.request<ImDbApiServiceGetTitleBoxOfficeData, RpcStatus>({
        path: `/titles/${titleId}/boxOffice`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  titlesBatchGet = {
    /**
     * @description Retrieve details of multiple titles using their IMDb IDs.
     *
     * @tags Title
     * @name ImDbApiServiceBatchGetTitles
     * @summary Batch get titles by IDs
     * @request GET:/titles:batchGet
     * @response `200` `ImDbApiServiceBatchGetTitlesData` A successful response.
     * @response `default` `RpcStatus` An unexpected error response.
     */
    imDbApiServiceBatchGetTitles: (
      { batchGet, ...query }: ImDbApiServiceBatchGetTitlesParams,
      params: RequestParams = {},
    ) =>
      this.request<ImDbApiServiceBatchGetTitlesData, RpcStatus>({
        path: `/titles${batchGet}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  search = {
    /**
     * @description Search for titles using a query string.
     *
     * @tags Title
     * @name ImDbApiServiceSearchTitles
     * @summary Search titles by query
     * @request GET:/search/titles
     * @response `200` `ImDbApiServiceSearchTitlesData` A successful response.
     * @response `default` `RpcStatus` An unexpected error response.
     */
    imDbApiServiceSearchTitles: (
      query: ImDbApiServiceSearchTitlesParams,
      params: RequestParams = {},
    ) =>
      this.request<ImDbApiServiceSearchTitlesData, RpcStatus>({
        path: `/search/titles`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  names = {
    /**
     * @description Retrieve a name's details using its IMDb ID.
     *
     * @tags Name
     * @name ImDbApiServiceGetName
     * @summary Get name by ID
     * @request GET:/names/{nameId}
     * @response `200` `ImDbApiServiceGetNameData` A successful response.
     * @response `default` `RpcStatus` An unexpected error response.
     */
    imDbApiServiceGetName: (
      { nameId, ...query }: ImDbApiServiceGetNameParams,
      params: RequestParams = {},
    ) =>
      this.request<ImDbApiServiceGetNameData, RpcStatus>({
        path: `/names/${nameId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve the images associated with a specific name.
     *
     * @tags Name
     * @name ImDbApiServiceListNameImages
     * @summary List images for a name
     * @request GET:/names/{nameId}/images
     * @response `200` `ImDbApiServiceListNameImagesData` A successful response.
     * @response `default` `RpcStatus` An unexpected error response.
     */
    imDbApiServiceListNameImages: (
      { nameId, ...query }: ImDbApiServiceListNameImagesParams,
      params: RequestParams = {},
    ) =>
      this.request<ImDbApiServiceListNameImagesData, RpcStatus>({
        path: `/names/${nameId}/images`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve the filmography associated with a specific name.
     *
     * @tags Name
     * @name ImDbApiServiceListNameFilmography
     * @summary List filmography for a name
     * @request GET:/names/{nameId}/filmography
     * @response `200` `ImDbApiServiceListNameFilmographyData` A successful response.
     * @response `default` `RpcStatus` An unexpected error response.
     */
    imDbApiServiceListNameFilmography: (
      { nameId, ...query }: ImDbApiServiceListNameFilmographyParams,
      params: RequestParams = {},
    ) =>
      this.request<ImDbApiServiceListNameFilmographyData, RpcStatus>({
        path: `/names/${nameId}/filmography`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve the relationships associated with a specific name.
     *
     * @tags Name
     * @name ImDbApiServiceListNameRelationships
     * @summary List relationships for a name
     * @request GET:/names/{nameId}/relationships
     * @response `200` `ImDbApiServiceListNameRelationshipsData` A successful response.
     * @response `default` `RpcStatus` An unexpected error response.
     */
    imDbApiServiceListNameRelationships: (
      { nameId, ...query }: ImDbApiServiceListNameRelationshipsParams,
      params: RequestParams = {},
    ) =>
      this.request<ImDbApiServiceListNameRelationshipsData, RpcStatus>({
        path: `/names/${nameId}/relationships`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve the trivia associated with a specific name.
     *
     * @tags Name
     * @name ImDbApiServiceListNameTrivia
     * @summary List trivia for a name
     * @request GET:/names/{nameId}/trivia
     * @response `200` `ImDbApiServiceListNameTriviaData` A successful response.
     * @response `default` `RpcStatus` An unexpected error response.
     */
    imDbApiServiceListNameTrivia: (
      { nameId, ...query }: ImDbApiServiceListNameTriviaParams,
      params: RequestParams = {},
    ) =>
      this.request<ImDbApiServiceListNameTriviaData, RpcStatus>({
        path: `/names/${nameId}/trivia`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  namesBatchGet = {
    /**
     * @description Retrieve details of multiple names using their IMDb IDs.
     *
     * @tags Name
     * @name ImDbApiServiceBatchGetNames
     * @summary Batch get names by IDs
     * @request GET:/names:batchGet
     * @response `200` `ImDbApiServiceBatchGetNamesData` A successful response.
     * @response `default` `RpcStatus` An unexpected error response.
     */
    imDbApiServiceBatchGetNames: (
      { batchGet, ...query }: ImDbApiServiceBatchGetNamesParams,
      params: RequestParams = {},
    ) =>
      this.request<ImDbApiServiceBatchGetNamesData, RpcStatus>({
        path: `/names${batchGet}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  chart = {
    /**
     * @description Retrieve the star meter rankings for names.
     *
     * @tags Name
     * @name ImDbApiServiceListStarMeters
     * @summary List star meter rankings
     * @request GET:/chart/starmeter
     * @response `200` `ImDbApiServiceListStarMetersData` A successful response.
     * @response `default` `RpcStatus` An unexpected error response.
     */
    imDbApiServiceListStarMeters: (
      query: ImDbApiServiceListStarMetersParams,
      params: RequestParams = {},
    ) =>
      this.request<ImDbApiServiceListStarMetersData, RpcStatus>({
        path: `/chart/starmeter`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  interests = {
    /**
     * @description Retrieve all interest categories available in the IMDb API.
     *
     * @tags Interest
     * @name ImDbApiServiceListInterestCategories
     * @summary List interest categories
     * @request GET:/interests
     * @response `200` `ImDbApiServiceListInterestCategoriesData` A successful response.
     * @response `default` `RpcStatus` An unexpected error response.
     */
    imDbApiServiceListInterestCategories: (params: RequestParams = {}) =>
      this.request<ImDbApiServiceListInterestCategoriesData, RpcStatus>({
        path: `/interests`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Retrieve details of a specific interest using its ID.
     *
     * @tags Interest
     * @name ImDbApiServiceGetInterest
     * @summary Get interest by ID
     * @request GET:/interests/{interestId}
     * @response `200` `ImDbApiServiceGetInterestData` A successful response.
     * @response `default` `RpcStatus` An unexpected error response.
     */
    imDbApiServiceGetInterest: (
      { interestId, ...query }: ImDbApiServiceGetInterestParams,
      params: RequestParams = {},
    ) =>
      this.request<ImDbApiServiceGetInterestData, RpcStatus>({
        path: `/interests/${interestId}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
