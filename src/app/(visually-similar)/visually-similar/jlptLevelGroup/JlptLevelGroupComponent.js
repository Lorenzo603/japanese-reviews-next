import { getDictionary } from '@/app/components/backend/DictionaryLoaderComponent';
import KanjiCardLinkComponent from './KanjiCardLinkComponent';
import Image from 'next/image';

export const JlptLevelGroupComponent = async (props) => {

    const fullKanjiDictionary = await getDictionary('kanji_full_reduced');
    const kanjiList = fullKanjiDictionary
        .filter(item => item['data'].hasOwnProperty('categories') && item['data']['categories'].includes(`jlpt${props.jlptLevelNumber}`))

    return (
        <main>
            <div>
                <div className='flex flex-row gap-6 pb-4'>
                    <h1 className='text-4xl'>JLPT Level {props.jlptLevelNumber}</h1>
                    <Image src={`/img/medals/medal-${props.medal}.svg`} alt="" width={32} height={32} />
                </div>
                <div className='flex flex-row 
                mb-6
                border-2 border-blue-900 rounded-md p-2
                bg-blue-50 text-blue-900
                items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>
                    <p className='m-0'>Kanjis that have no visual similarities with any other kanji have been dimmed out.</p>
                </div>

                <div>
                    <ul className='flex flex-row flex-wrap gap-2'>
                        {
                            kanjiList.map(kanji => {
                                const hasSimilarKanji = kanji['data'].hasOwnProperty('visually_similar_subject_ids')
                                    && kanji['data']['visually_similar_subject_ids'].length > 0;
                                return (
                                    <KanjiCardLinkComponent key={kanji["id"]}
                                        kanjiSlug={kanji["data"]["slug"]}
                                        kanjiMeaning={kanji["data"]["meanings"][0]["meaning"]}
                                        kanjiHasSimilarities={hasSimilarKanji}
                                    />
                                )
                            })
                        }
                    </ul>
                </div>
            </div>

        </main>
    );
}

export default JlptLevelGroupComponent;