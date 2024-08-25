import { getDictionary } from "@/app/components/backend/DictionaryLoaderComponent";
import KanjiCardLinkComponent from "@/app/components/visually-similar/KanjiCardLinkComponent";
var wanakana = require('wanakana');

export default async function VisuallySimilarKanji({ params }) {

    const fullKanjiDictionary = await getDictionary('kanji_full_reduced');
    const kanji = fullKanjiDictionary
        .filter(item => item['id'] === parseInt(params.kanjiId))[0]["data"];

    const readings = kanji['readings'];
    const readingsKun = readings.filter(reading => !reading.hasOwnProperty('type') || reading['type'] === 'kunyomi');
    const readingsOn = readings.filter(reading => reading['type'] === 'onyomi');
    const readingsNames = readings.filter(reading => reading['type'] === 'nanori');

    const visuallySimilarKanjiIds = kanji['visually_similar_subject_ids'];

    return (
        <main>
            <div className="p-4">


                <div>
                    <section>
                        <h1 className="sr-only">Kanji</h1>
                        <div className="japanese-font text-6xl pb-4">{kanji['slug']}</div>
                    </section>

                    <section>
                        <h2 className="text-2xl">Meanings</h2>
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
                    </section>

                    <section>
                        <h2 className="text-2xl">Readings</h2>
                        {readingsKun.length > 0 &&
                            <section>
                                <h3 className="text-lg">Kun'yomi</h3>
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
                            </section>
                        }

                        {readingsOn.length > 0 &&
                            <section>
                                <h3 className="text-lg">On'yomi</h3>
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
                            </section>
                        }

                        {readingsNames.length > 0 &&
                            <section>
                                <h3 className="text-lg">Nanori</h3>
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
                            </section>
                        }

                    </section>
                </div>


                <div>
                    {
                        visuallySimilarKanjiIds.length > 0 &&
                        <section>
                            <h1 className="text-2xl">Visually Similar Kanji</h1>
                            <ul className='flex flex-row flex-wrap m-0 p-0 gap-2'>
                                {
                                    Array.from(visuallySimilarKanjiIds)
                                        .map(visuallySimilarKanjiId => {
                                            const visuallySimilarKanji = fullKanjiDictionary
                                                .filter(item => item['id'] === visuallySimilarKanjiId)[0]["data"];
                                            return (
                                                <KanjiCardLinkComponent
                                                    kanjiId={visuallySimilarKanjiId}
                                                    kanjiSlug={visuallySimilarKanji["slug"]}
                                                    kanjiMeaning={visuallySimilarKanji["meanings"][0]["meaning"]}
                                                />
                                            );
                                        })
                                }
                            </ul>
                        </section>
                    }
                </div>
            </div>
        </main>
    )
}

