interface HALSONLink {
  href: string;
}

type HALSONResourceLinks = Partial<Record<string, HALSONLink | HALSONLink[]>>;

interface HALSONResource {
  className: 'HALSONResource';
  _links?: HALSONResourceLinks;
  _embedded?: EmbeddedHALSONResources;
  listLinkRels(): string[];
  listEmbedRels(): string[];
  getLinks(
    rel: string,
    filterCallback?: FilterCallback<HALSONLink>,
    begin?: number | undefined,
    end?: number | undefined,
  ): HALSONLink[];
  getLink<D>(rel: string, def: D): HALSONLink | D;
  getLink<D>(rel: string, filterCallback: FilterCallback<HALSONLink>, def: D): HALSONLink | D;
  getEmbeds<I>(
    rel: string,
    filterCallback?: FilterCallback<I>,
    begin?: number | undefined,
    end?: number | undefined,
  ): I[];
  getEmbed<I, D>(rel: string, def: D): I | D;
  getEmbed<I, D>(rel: string, filterCallback: FilterCallback<I>, def: D): I | D;
  addLink(rel: string, link: string | HALSONLink): this & {_links: HALSONResourceLinks};
  addEmbed<I>(rel: string, embed: I | readonly I[]): this & {_embedded: EmbeddedHALSONResources};
  insertEmbed<I>(
    rel: string,
    index: number,
    embed: I | readonly I[],
  ): this & {_embedded: EmbeddedHALSONResources};
  removeLinks(rel: string, filterCallback?: FilterCallback<HALSONLink>): this;
  removeEmbeds(rel: string, filterCallback?: FilterCallback<HALSONLink>): this;
}

type EmbeddedHALSONResources = Partial<Record<string, HALSONResource | HALSONResource[]>>;

type FilterCallback<T> = (item: T, index: number, items: T[]) => unknown

declare function createHALSONResource(data: string | object): HALSONResource;
declare function createHALSONResource<T extends object>(data: string | T): HALSONResourceOf<T>;

// Generic alias 
type HALSONResourceOf<T extends object> = HALSONResource & T;

// Create a namespace to export the generic type
declare namespace createHALSONResource {
  export type HALSONResource<T extends object = object> = HALSONResourceOf<T>;
}

export = createHALSONResource;
export as namespace halson;

declare global {
  interface Window {
    halson: typeof createHALSONResource;
  }
}
