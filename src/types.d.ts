type OgMedia = {
  height: string | null;
  type: string | null;
  url: string;
  width: string | null;
};
type TwitterImage = {
  height: string | null;
  alt: string | null;
  url: string;
  width: string | null;
};
type TwitterPlayer = {
  height: string | null;
  stream: string | null;
  url: string;
  width: string | null;
};
type MusicSong = {
  url: string;
  track: string | null;
  disc: string | null;
};
export type Details = {
  alAndroidAppName?: string;
  alAndroidClass?: string;
  alAndroidPackage?: string;
  alAndroidUrl?: string;
  alIosAppName?: string;
  alIosAppStoreId?: string;
  alIosUrl?: string;
  alIpadAppName?: string;
  alIpadAppStoreId?: string;
  alIpadUrl?: string;
  alIphoneAppName?: string;
  alIphoneAppStoreId?: string;
  alIphoneUrl?: string;
  alWebShouldFallback?: string;
  alWebUrl?: string;
  alWindowsAppId?: string;
  alWindowsAppName?: string;
  alWindowsPhoneAppId?: string;
  alWindowsPhoneAppName?: string;
  alWindowsPhoneUrl?: string;
  alWindowsUniversalAppId?: string;
  alWindowsUniversalAppName?: string;
  alWindowsUniversalUrl?: string;
  alWindowsUrl?: string;
  articleAuthor?: string;
  articleExpirationTime?: string;
  articleModifiedTime?: string;
  articlePublishedTime?: string;
  articlePublisher?: string;
  articleSection?: string;
  articleTag?: string;
  author?: string;
  bookAuthor?: string;
  bookCanonicalName?: string;
  bookIsbn?: string;
  bookReleaseDate?: string;
  booksBook?: string;
  booksRatingScale?: string;
  booksRatingValue?: string;
  bookTag?: string;
  businessContactDataCountryName?: string;
  businessContactDataLocality?: string;
  businessContactDataPostalCode?: string;
  businessContactDataRegion?: string;
  businessContactDataStreetAddress?: string;
  dcContributor?: string;
  dcCoverage?: string;
  dcCreator?: string;
  dcDate?: string;
  dcDateCreated?: string;
  dcDateIssued?: string;
  dcDescription?: string;
  dcFormatMedia?: string;
  dcFormatSize?: string;
  dcIdentifier?: string;
  dcLanguage?: string;
  dcPublisher?: string;
  dcRelation?: string;
  dcRights?: string;
  dcSource?: string;
  dcSubject?: string;
  dcTitle?: string;
  dcType?: string;
  modifiedTime?: string;
  musicAlbum?: string | string[];
  musicAlbumDisc?: string;
  musicAlbumTrack?: string;
  musicAlbumUrl?: string;
  musicCreator?: string | string[];
  musicDuration?: string;
  musicMusician?: string | string[];
  musicReleaseDate?: string;
  musicSong?: MusicSong;
  musicSongDisc?: string | string[];
  musicSongTrack?: string | string[];
  musicSongUrl?: string | string[];
  ogArticleAuthor?: string;
  ogArticleExpirationTime?: string;
  ogArticleModifiedTime?: string;
  ogArticlePublishedTime?: string;
  ogArticlePublisher?: string;
  ogArticleSection?: string;
  ogArticleTag?: string;
  ogAudio?: string;
  ogAudioSecureURL?: string;
  ogAudioType?: string;
  ogAudioURL?: string;
  ogAvailability?: string;
  ogDate?: string;
  ogDescription?: string;
  ogDeterminer?: string;
  ogImage?: OgMedia | OgMedia[];
  ogImageHeight?: string | string[];
  ogImageSecureURL?: string | string[];
  ogImageType?: string | string[];
  ogImageURL?: string | string[];
  ogImageWidth?: string | string[];
  ogLocale?: string;
  ogLocaleAlternate?: string;
  ogLogo?: string;
  ogPriceAmount?: string;
  ogPriceCurrency?: string;
  ogProductAvailability?: string;
  ogProductCondition?: string;
  ogProductPriceAmount?: string;
  ogProductPriceCurrency?: string;
  ogProductRetailerItemId?: string;
  ogSiteName?: string;
  ogTitle?: string;
  ogType?: string;
  ogUrl?: string;
  ogVideo?: OgMedia | OgMedia[];
  ogVideoActorId?: string | string[];
  ogVideoHeight?: string | string[];
  ogVideoSecureURL?: string | string[];
  ogVideoType?: string | string[];
  ogVideoWidth?: string | string[];
  placeLocationLatitude?: string;
  placeLocationLongitude?: string;
  profileFirstName?: string;
  profileGender?: string;
  profileLastName?: string;
  profileUsername?: string;
  publishedTime?: string;
  releaseDate?: string;
  restaurantContactInfoCountryName?: string;
  restaurantContactInfoEmail?: string;
  restaurantContactInfoLocality?: string;
  restaurantContactInfoPhoneNumber?: string;
  restaurantContactInfoPostalCode?: string;
  restaurantContactInfoRegion?: string;
  restaurantContactInfoStreetAddress?: string;
  restaurantContactInfoWebsite?: string;
  restaurantMenu?: string;
  restaurantRestaurant?: string;
  restaurantSection?: string;
  restaurantVariationPriceAmount?: string;
  restaurantVariationPriceCurrency?: string;
  twitterAppIdGooglePlay?: string;
  twitterAppIdiPad?: string;
  twitterAppIdiPhone?: string;
  twitterAppNameGooglePlay?: string;
  twitterAppNameiPad?: string;
  twitterAppNameiPhone?: string;
  twitterAppUrlGooglePlay?: string;
  twitterAppUrliPad?: string;
  twitterAppUrliPhone?: string;
  twitterCard?: string;
  twitterCreator?: string;
  twitterCreatorId?: string;
  twitterDescription?: string;
  twitterImage?: TwitterImage | TwitterImage[];
  twitterImageAlt?: string | string[];
  twitterImageHeight?: string | string[];
  twitterImageSrc?: string | string[];
  twitterImageWidth?: string | string[];
  twitterPlayer?: TwitterPlayer | TwitterPlayer[];
  twitterPlayerHeight?: string | string[];
  twitterPlayerStream?: string | string[];
  twitterPlayerStreamContentType?: string | string[];
  twitterPlayerWidth?: string | string[];
  twitterSite?: string;
  twitterSiteId?: string;
  twitterTitle?: string;
  twitterUrl?: string;
  updatedTime?: string;
  [key: string]: any;
};
