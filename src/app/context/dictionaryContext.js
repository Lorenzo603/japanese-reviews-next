'use client'

import { createContext, useContext, useMemo, useState } from "react";

const DictionaryContext = createContext({})

export const DictionaryContextProvider = ({ children }) => {
    const [fullKanjiDictionary, setFullKanjiDictionary] = useState([]);
    const [fullVocabularyDictionary, setFullVocabularyDictionary] = useState([]);
    const providerValue = useMemo(() => ({
        fullKanjiDictionary, setFullKanjiDictionary,
        fullVocabularyDictionary, setFullVocabularyDictionary
    }), [fullKanjiDictionary, fullVocabularyDictionary]);

    return (
        <DictionaryContext.Provider value={providerValue}>
            {children}
        </DictionaryContext.Provider>
    )
};

export const useDictionaryContext = () => useContext(DictionaryContext);