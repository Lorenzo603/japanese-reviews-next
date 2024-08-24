'use client';

import { Hits, InstantSearch, SearchBox } from "react-instantsearch";
import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";
import HitComponent from "./HitComponent";

export const SearchComponent = () => {

  const typesenseInstantsearchAdapter = new TypesenseInstantsearchAdapter({
    server: {
      apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY, // Be sure to use an API key that only allows search operations
      nodes: [
        {
          host: "localhost",
          port: "8108",
          path: "", // Optional. Example: If you have your typesense mounted in localhost:8108/typesense, path should be equal to '/typesense'
          protocol: "http",
        },
      ],
      cacheSearchResultsForSeconds: 2 * 60, // Cache search results from server. Defaults to 2 minutes. Set to 0 to disable caching.
    },
    // The following parameters are directly passed to Typesense's search API endpoint.
    //  So you can pass any parameters supported by the search endpoint below.
    //  query_by is required.
    additionalSearchParameters: {
      query_by: "slug,meanings,readingsKun,readingsOn,readingsNames",
    },
  });
  const searchClient = typesenseInstantsearchAdapter.searchClient;

  // Proxy search client to avoid searches with empty queries
  const proxySearchClient = {
    ...searchClient,
    search(requests) {
      if (requests.every(({ params }) => !params.query)) {
        return Promise.resolve({
          results: requests.map(() => ({
            hits: [],
            nbHits: 0,
            nbPages: 0,
            page: 0,
            processingTimeMS: 0,
            hitsPerPage: 0,
            exhaustiveNbHits: false,
            query: '',
            params: '',
          })),
        });
      }

      return searchClient.search(requests);
    },
  };

  return (
    <InstantSearch indexName="kanjis" searchClient={proxySearchClient} future={{ preserveSharedStateOnUnmount: true, }}>
      <SearchBox
        classNames={{
          root: '',
          form: 'flex w-full h-12',
          input: 'bg-slate-50 w-full p-2 border-y-2 border-l-2 rounded-l-lg sm:w-96 focus:outline-none',
          submit: 'bg-slate-50 h-full p-2 border-y-2 border-r-2 rounded-r-lg',
          submitIcon: 'h-full w-full',
        }}
        placeholder="Search kanji"
        // submitIconComponent={({ classNames }) => (
        //   <svg class="ais-SearchBox-submitIcon" width="20" height="20"
        //     viewBox="0 0 40 40" aria-hidden="true">
        //     <path d="M26.804 29.01c-2.832 2.34-6.465 3.746-10.426 3.746C7.333 32.756 0 25.424 0 16.378 0 7.333 7.333 0 16.378 0c9.046 0 16.378 7.333 16.378 16.378 0 3.96-1.406 7.594-3.746 10.426l10.534 10.534c.607.607.61 1.59-.004 2.202-.61.61-1.597.61-2.202.004L26.804 29.01zm-10.426.627c7.323 0 13.26-5.936 13.26-13.26 0-7.32-5.937-13.257-13.26-13.257C9.056 3.12 3.12 9.056 3.12 16.378c0 7.323 5.936 13.26 13.258 13.26z"></path>
        //   </svg>
        // )}
      />
      <Hits hitComponent={HitComponent} />
    </InstantSearch>
  )
}


export default SearchComponent;