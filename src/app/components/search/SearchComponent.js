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
          reset: 'bg-slate-50 h-full p-2 border-y-2 border-r-2 rounded-r-lg',
          resetIcon: 'h-full w-full',
        }}
        placeholder="Search kanji"
        queryHook={
          (query, search) => {
            const searchSubmitButton = document.getElementsByClassName("ais-SearchBox-submit")[0];
            if (query === '') {
              searchSubmitButton.classList.remove('hidden');
            } else {
              searchSubmitButton.classList.add('hidden');
            }
            search(query);
          }}
      />
      <Hits 
        hitComponent={HitComponent}
        classNames={{
          root: 'bg-slate-50',
          item: 'p-2',
        }} 
      />
    </InstantSearch>
  )
}


export default SearchComponent;