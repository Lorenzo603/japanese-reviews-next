import { getDictionary } from '@/app/components/backend/DictionaryLoaderComponent';

export const JlptLevelGroupComponent = async (props) => {

    const fullKanjiDictionary = await getDictionary('kanji_full');
    const kanjiList = fullKanjiDictionary
        .filter(item => item['data'].hasOwnProperty('categories') && item['data']['categories'].includes(`jlpt${props.jlptLevelNumber}`))
    
    return (
        <main className='text-white'>
            This is JLPT Level {props.jlptLevelNumber}

            <section>

                <ul>
                    {kanjiList.map(kanji => <li key={kanji["id"]}>{kanji["data"]["slug"]}</li>)}
                </ul>

            </section>
        </main>
    );
}

export default JlptLevelGroupComponent;