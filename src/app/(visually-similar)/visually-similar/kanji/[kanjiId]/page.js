import { getDictionary } from "@/app/components/backend/DictionaryLoaderComponent";
import KanjiCardLinkComponent from "@/app/(visually-similar)/visually-similar/jlptLevelGroup/KanjiCardLinkComponent";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/app/components/breadcrumbs/Breadcrumb";
var wanakana = require('wanakana');

export default async function VisuallySimilarKanji({ params }) {

    const fullKanjiDictionary = await getDictionary('kanji_full_reduced');
    const kanji = fullKanjiDictionary
        .filter(item => item['id'] === parseInt(params.kanjiId))?.[0]?.["data"];
    if (!kanji) {
        notFound();
    }

    const readings = kanji['readings'];
    const readingsKun = readings.filter(reading => !reading.hasOwnProperty('type') || reading['type'] === 'kunyomi');
    const readingsOn = readings.filter(reading => reading['type'] === 'onyomi');
    const readingsNames = readings.filter(reading => reading['type'] === 'nanori');
    const jlptLevel = getJlptLevel(kanji);

    const visuallySimilarKanjiIds = kanji['visually_similar_subject_ids'];

    function getJlptLevel(kanji) {
        if (!kanji.hasOwnProperty('categories')) {
            return null;
        }
        const jlptCagtegories = kanji['categories'].filter(cat => cat.startsWith('jlpt'));
        if (jlptCagtegories.length > 0) {
            return jlptCagtegories[0].replace('jlpt', '');
        } else {
            return null;
        }
    }

    return (
        <div className="max-w-7xl px-6 pb-6">
            <Breadcrumb />
            <main>
                <div className="min-w-64 inline-block
                        rounded-md bg-slate-50 p-8 border-2 border-slate-300 shadow">
                    <div className="flex shrink">
                        <section>
                            <h1 className="sr-only">Kanji</h1>
                            <div className="japanese-font text-9xl pb-4">{kanji['slug']}</div>
                        </section>
                    </div>
                    <div className="flex shrink py-4">
                        <section>
                            <h2 className="sr-only text-2xl">Meanings</h2>
                            <ul className="text-2xl">
                                {
                                    kanji['meanings']
                                        .map(meaning => meaning['meaning'])
                                        .join(', ')
                                }
                            </ul>
                        </section>
                    </div>

                    <div className="flex shrink">
                        <section>
                            <h2 className="sr-only text-2xl">Readings</h2>
                            {readingsKun.length > 0 &&
                                <section>
                                    <div className="flex items-center py-2">
                                        <h3 className="text-2xl font-bold">Kun:</h3>
                                        <ul className="japanese-font text-2xl px-2">
                                            {
                                                readingsKun
                                                    .map(reading => reading['reading'])
                                                    .join(', ')

                                            }
                                        </ul>
                                    </div>
                                </section>
                            }

                            {readingsOn.length > 0 &&
                                <section>
                                    <div className="flex items-center py-2">
                                        <h3 className="text-2xl font-bold">On:</h3>
                                        <ul className="japanese-font text-2xl px-2">
                                            {
                                                readingsOn
                                                    .map(reading => reading['reading'])
                                                    .map(wanakana.toKatakana)
                                                    .join(', ')
                                            }
                                        </ul>
                                    </div>
                                </section>
                            }

                            {readingsNames.length > 0 &&
                                <section>
                                    <div className="flex items-center py-2">
                                        <h3 className="text-2xl font-bold">Nanori:</h3>
                                        <ul className="japanese-font text-2xl px-2">
                                            {
                                                readingsNames
                                                    .map(reading => reading['reading'])
                                                    .join(', ')
                                            }
                                        </ul>
                                    </div>
                                </section>
                            }

                            {
                                jlptLevel &&
                                <section>
                                    <div className="py-4">
                                        <Link href={`/visually-similar/jlpt-level-${jlptLevel}`}>
                                            <span className="bg-gray-300 font-bold p-2 rounded-lg
                                                hover:bg-gray-200">
                                                JLPT Level N{jlptLevel}
                                            </span>
                                        </Link>
                                    </div>
                                </section>
                            }

                        </section>
                    </div>
                </div>


                <div>
                    {
                        visuallySimilarKanjiIds.length > 0 &&
                        <section>
                            <h1 className="text-3xl pt-6 pb-4 font-bold">Visually Similar Kanji</h1>
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
            </main>
        </div>
    )
}

