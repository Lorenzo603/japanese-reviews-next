import { getDictionary } from "@/app/components/backend/DictionaryLoaderComponent";
var wanakana = require('wanakana');

export default async function VisuallySimilarKanji({ params }) {

    const fullKanjiDictionary = await getDictionary('kanji_full');
    const kanji = fullKanjiDictionary
        .filter(item => item['id'] === parseInt(params.kanjiId))[0]["data"];

    const readings = kanji['readings'];
    const readingsKun = readings.filter(reading => !reading.hasOwnProperty('type') || reading['type'] === 'kunyomi');
    const readingsOn = readings.filter(reading => reading['type'] === 'onyomi');
    const readingsNames = readings.filter(reading => reading['type'] === 'nanori');

    const visuallySimilarKanjiIds = kanji['visually_similar_subject_ids'];

    return (
        <main>
            <section>
                <div>
                    <h1 className="japanese-font">{kanji['slug']}</h1>

                    <h2>Meanings</h2>
                    <ul>
                        {
                            kanji['meanings']
                                .map(meaning => meaning['meaning'])
                                .map(meaning => {
                                    return (
                                        <li key={meaning}>
                                            {meaning}
                                        </li>
                                    )
                                })
                        }
                    </ul>

                    <h2>Readings</h2>
                    {readingsKun.length > 0 &&
                        <>
                            <h3>Kun'yomi</h3>
                            <ul>
                                {
                                    readingsKun
                                        .map(reading => reading['reading'])
                                        .map(reading => {
                                            return (
                                                <li key={reading} className="japanese-font">
                                                    {reading}
                                                </li>
                                            )
                                        })
                                }
                            </ul>
                        </>
                    }

                    {readingsOn.length > 0 &&
                        <>
                            <h3>On'yomi</h3>
                            <ul>
                                {
                                    readingsOn
                                        .map(reading => reading['reading'])
                                        .map(reading => {
                                            return (
                                                <li key={reading} className="japanese-font">
                                                    {wanakana.toKatakana(reading)}
                                                </li>
                                            )
                                        })
                                }
                            </ul>
                        </>
                    }

                    {readingsNames.length > 0 &&
                        <>
                            <h3>Nanori</h3>
                            <ul>
                                {
                                    readingsNames
                                        .map(reading => reading['reading'])
                                        .map(reading => {
                                            return (
                                                <li key={reading} className="japanese-font">
                                                    {reading}
                                                </li>
                                            )
                                        })
                                }
                            </ul>
                        </>
                    }


                </div>
            </section>

            {
                visuallySimilarKanjiIds.length > 0 &&
                <section>
                    <h2>Visually Similar Kanjis</h2>
                    <ul>
                        {
                            Array.from(visuallySimilarKanjiIds)
                                .map(visuallySimilarKanjiId => {
                                    const visuallySimilarKanji = fullKanjiDictionary
                                        .filter(item => item['id'] === visuallySimilarKanjiId)[0]["data"];
                                    return (
                                        <li key={visuallySimilarKanjiId}>
                                            <a className="japanese-font" href={`/visually-similar/kanji/${visuallySimilarKanjiId}`}>
                                                {visuallySimilarKanji["slug"]}
                                            </a>
                                        </li>
                                    );
                                })
                        }
                    </ul>
                </section>
            }

        </main>
    )
}

