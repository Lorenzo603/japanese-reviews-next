'use client';

import { Hits, InstantSearch, SearchBox, useInstantSearch } from "react-instantsearch";
import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";
import HitComponent from "./HitComponent";
import { useState, useEffect } from "react";

export const SearchComponent = () => {
  const [highlightIndex, setHighlightIndex] = useState(1); // Track the highlighted item index
  const [keyboardInteraction, setKeyboardInteraction] = useState(false); // Track if user is interacting via keyboard
  const [lastMouseOverIndex, setLastMouseOverIndex] = useState(null); // Track the last mouseover item

  function ResultsHook() {
    const { results } = useInstantSearch();

    if (results === undefined) {
      return;
    }

    const searchSubmitButton = document.getElementsByClassName("ais-SearchBox-submit")[0];
    if (searchSubmitButton === undefined) {
      return;
    }

    if (results.query === '') {
      searchSubmitButton.classList.remove('hidden');
    } else {
      searchSubmitButton.classList.add('hidden');
    }
  }

  const typesenseInstantsearchAdapter = new TypesenseInstantsearchAdapter({
    server: {
      apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY, // Be sure to use an API key that only allows search operations
      nodes: [
        {
          host: process.env.NEXT_PUBLIC_TYPESENSE_HOST, //localhost
          port: process.env.NEXT_PUBLIC_TYPESENSE_PORT, //8108
          path: "/typesense", // Optional. Example: If you have your typesense mounted in localhost:8108/typesense, path should be equal to '/typesense'
          protocol: "http",
        },
      ],
      cacheSearchResultsForSeconds: 2 * 60, // Cache search results from server. Defaults to 2 minutes. Set to 0 to disable caching.
      sendApiKeyAsQueryParam: false,
    },
    // The following parameters are directly passed to Typesense's search API endpoint.
    //  So you can pass any parameters supported by the search endpoint below.
    //  query_by is required.
    additionalSearchParameters: {
      query_by: "slug,meanings,readingsKun,readingsOn,readingsNames,readingsKunRomaji,readingsOnRomaji,readingsNamesRomaji",
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

  const handleKeyDown = (event, hits) => {
    setKeyboardInteraction(true); // Set keyboard interaction to true when arrow keys are used
    setLastMouseOverIndex(null);  // Clear the last mouseover index when keyboard interaction starts

    if (event.key === 'ArrowDown') {
      setHighlightIndex((prevIndex) => Math.min(prevIndex + 1, hits.length));
    } else if (event.key === 'ArrowUp') {
      setHighlightIndex((prevIndex) => Math.max(prevIndex - 1, 1));
    } else if (event.key === 'Enter') {
      const currentHit = hits[highlightIndex - 1];
      if (currentHit) {
        window.location.href = currentHit.children[0].children[0].href; // Navigate to the highlighted item's URL
      }
    }
  };

  useEffect(() => {
    const handleKeyDownEvent = (event) => {
      const hits = document.querySelectorAll('.ais-Hits-item'); // Get all hit items
      if (hits.length > 0) {
        handleKeyDown(event, hits);
      }
    };

    const handleMouseMoveEvent = () => {
      setKeyboardInteraction(false); // Re-enable mouse interaction on mouse move
    };

    window.addEventListener('keydown', handleKeyDownEvent);
    window.addEventListener('mousemove', handleMouseMoveEvent);

    return () => {
      window.removeEventListener('keydown', handleKeyDownEvent);
      window.removeEventListener('mousemove', handleMouseMoveEvent);
    };
  }, [highlightIndex]);

  return (
    <InstantSearch indexName="kanjis" searchClient={proxySearchClient}
      future={{ preserveSharedStateOnUnmount: true }}>
      <SearchBox
        classNames={{
          root: 'w-full',
          form: 'relative flex w-full h-12',
          input: 'bg-slate-50 w-72 sm:w-96 py-2 pl-2 pr-10 border-2 rounded-lg',
          submit: 'bg-slate-50 absolute top-3.5 right-4',
          submitIcon: 'w-5 h-5',
          reset: 'bg-slate-50 absolute top-3.5 right-4',
          resetIcon: 'w-5 h-5',
        }}
        placeholder="Search by kanji, meaning, or kana"
        autoFocus
      />
      <Hits
        hitComponent={({ hit }) => (
          <div
            className={`p-2 border w-72 sm:w-96 
              ${(highlightIndex === hit.__position)
                ? 'bg-pink-100'
                : (lastMouseOverIndex === hit.__position && !keyboardInteraction)
                  ? 'bg-pink-100'
                  : ''
              }`}
            onMouseOver={() => {
              if (!keyboardInteraction) {
                setLastMouseOverIndex(hit.__position); // Track last mouse over index
                setHighlightIndex(hit.__position); // Highlight the item on mouseover if not using keyboard
              }
            }}
            onClick={() => window.location.href = `/visually-similar/kanji/${hit.slug}`}
          >
            <HitComponent hit={hit} />
          </div>
        )}
        classNames={{
          root: 'bg-slate-50',
          list: 'p-0',
          item: 'ais-Hits-item', // ais-Hits-item used for selection
        }}
      />
      <ResultsHook />
    </InstantSearch>
  );
}

export default SearchComponent;
