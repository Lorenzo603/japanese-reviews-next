import { getDictionary } from '@/app/components/backend/DictionaryLoaderComponent';
import KanjiCardLinkComponent from '../KanjiCardLinkComponent';

export const JlptLevelGroupComponent = async (props) => {

    const fullKanjiDictionary = await getDictionary('kanji_full_reduced');
    const kanjiList = fullKanjiDictionary
        .filter(item => item['data'].hasOwnProperty('categories') && item['data']['categories'].includes(`jlpt${props.jlptLevelNumber}`))

    return (
        <section>
            <div className='p-4'>
                <h1>JLPT Level {props.jlptLevelNumber}</h1>
                <ul className='flex flex-row flex-wrap m-0 p-0 gap-2'>
                    {
                        kanjiList.map(kanji => {
                            const hasSimilarKanji = kanji['data'].hasOwnProperty('visually_similar_subject_ids')
                                && kanji['data']['visually_similar_subject_ids'].length > 0;
                            return (
                                <KanjiCardLinkComponent
                                    kanjiId={kanji["id"]}
                                    kanjiSlug={kanji["data"]["slug"]}
                                    kanjiMeaning={kanji["data"]["meanings"][0]["meaning"]}
                                    kanjiHasSimilarities={hasSimilarKanji}
                                />
                            )
                        })
                    }
                </ul>
            </div>

        </section>
    );
}

export default JlptLevelGroupComponent;