export type Maybe<T> = T | null;

export interface JobInput {
  title: string;

  description: string;

  tags: string[];

  publishedAt: string;

  companyId: string;

  locationRaw?: Maybe<string>;

  locationRequired?: Maybe<string>;

  locationPreferred?: Maybe<string>;

  locationPreferredTimezone?: Maybe<number>;

  locationPreferredTimezoneTolerance?: Maybe<number>;

  salaryRaw?: Maybe<string>;

  salaryExact?: Maybe<number>;

  salaryMin?: Maybe<number>;

  salaryMax?: Maybe<number>;

  salaryCurrency?: Maybe<string>;

  salaryEquity?: Maybe<boolean>;
}

export interface CompanyInput {
  displayName: string;
}

export enum CacheControlScope {
  Public = "PUBLIC",
  Private = "PRIVATE"
}

/** The `Upload` scalar type represents a file upload promise that resolves an object containing `stream`, `filename`, `mimetype` and `encoding`. */
export type Upload = any;
