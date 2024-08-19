'use client';

import { Hits, InstantSearch, SearchBox } from "react-instantsearch";
import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";

export const SearchComponent = () => {

    const typesenseInstantsearchAdapter = new TypesenseInstantsearchAdapter({
        server: {
            apiKey: "", // Be sure to use an API key that only allows search operations
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
            query_by: "slug,meanings,readings",
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
        <InstantSearch indexName="kanjis" searchClient={proxySearchClient} future={{preserveSharedStateOnUnmount: true,}}>
            <SearchBox />
            <Hits />
        </InstantSearch>
    )
}


export default SearchComponent;