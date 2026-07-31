import { createAuthorProfileAPI } from "./authorProfiles";

export type {
  ArtistSocial,
  PublicArtist,
  PublicArtistProject,
  AuthorsFilterOption,
  AuthorsFilterCategory,
  AuthorsListFilters,
  AuthorsListMeta,
  AuthorsBrowseResult,
} from "./authorProfiles";

export const artistsAPI = createAuthorProfileAPI("artists");
