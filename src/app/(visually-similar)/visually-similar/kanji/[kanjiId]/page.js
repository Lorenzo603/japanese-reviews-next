import { getDictionary } from "@/app/components/backend/DictionaryLoaderComponent";
import KanjiCardLinkComponent from "@/app/components/visually-similar/KanjiCardLinkComponent";
import Link from "next/link";
var wanakana = require('wanakana');

export default async function VisuallySimilarKanji({ params }) {

    const fullKanjiDictionary = await getDictionary('kanji_full_reduced');
    const kanji = fullKanjiDictionary
        .filter(item => item['id'] === parseInt(params.kanjiId))[0]["data"];

    const readings = kanji['readings'];
    const readingsKun = readings.filter(reading => !reading.hasOwnProperty('type') || reading['type'] === 'kunyomi');
    const readingsOn = readings.filter(reading => reading['type'] === 'onyomi');
    const readingsNames = readings.filter(reading => reading['type'] === 'nanori');
    const jlptLevel = getJlptLevel(kanji);

    const visuallySimilarKanjiIds = kanji['visually_similar_subject_ids'];

    function getJlptLevel(kanji) {
        const jlptCagtegories = kanji['categories'].filter(cat => cat.startsWith('jlpt'));
        if (jlptCagtegories.length > 0) {
            return jlptCagtegories[0].replace('jlpt', '');
        } else {
            return null;
        }
    }

    return (
        <main>
            <div className="w-full">
                <div className="mx-auto max-w-7xl p-6">

                    <div>
                        <section>
                            <h1 className="sr-only">Kanji</h1>
                            <div className="japanese-font text-6xl pb-4">{kanji['slug']}</div>
                        </section>

                        <section>
                            <div className="py-2">
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
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl">Readings</h2>
                            {readingsKun.length > 0 &&
                                <section>
                                    <div className="py-2">
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
                                    </div>
                                </section>
                            }

                            {readingsOn.length > 0 &&
                                <section>
                                    <div className="py-2">
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
                                    </div>
                                </section>
                            }

                            {readingsNames.length > 0 &&
                                <section>
                                    <div className="py-2">
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
                                    </div>
                                </section>
                            }

                            {
                                jlptLevel &&
                                <section>
                                    <div className="py-2">
                                        <Link href={`/visually-similar/jlpt-level-${jlptLevel}`}>
                                            <span className="bg-gray-300 font-bold p-2 rounded-lg">
                                                JLPT Level N{jlptLevel}
                                            </span>
                                        </Link>
                                    </div>
                                </section>
                            }

                        </section>
                    </div>


                    <div>
                        {
                            visuallySimilarKanjiIds.length > 0 &&
                            <section>
                                <h1 className="text-2xl py-2">Visually Similar Kanji</h1>
                                <ul className='flex flex-row flex-wrap m-0 p-0 gap-2'>
                                    {
                                        Array.from(visuallySimilarKanjiIds)
                                            .map(visuallySimilarKanjiId => {
                                                const visuallySimilarKanji = fullKanjiDictionary
                                                    .filter(item => item['id'] === visuallySimilarKanjiId)[0]["data"];
                                                return (
                                                    <KanjiCardLinkComponent key={visuallySimilarKanjiId}
                                                        kanjiId={visuallySimilarKanjiId}
                                                        kanjiSlug={visuallySimilarKanji["slug"]}
                                                        kanjiMeaning={visuallySimilarKanji["meanings"][0]["meaning"]}
                                                        kanjiHasSimilarities={true}
                                                    />
                                                );
                                            })
                                    }
                                </ul>
                            </section>
                        }
                    </div>
                </div>
            </div>
        </main>
    )
}

