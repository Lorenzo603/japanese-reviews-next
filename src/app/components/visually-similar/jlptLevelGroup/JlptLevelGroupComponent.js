import { getDictionary } from '@/app/components/backend/DictionaryLoaderComponent';
import Link from 'next/link';

export const JlptLevelGroupComponent = async (props) => {

    const fullKanjiDictionary = await getDictionary('kanji_full');
    const kanjiList = fullKanjiDictionary
        .filter(item => item['data'].hasOwnProperty('categories') && item['data']['categories'].includes(`jlpt${props.jlptLevelNumber}`))

    return (
        <section>
            <div className='p-4'>
                <h1>JLPT Level {props.jlptLevelNumber}</h1>
                <ul className='flex flex-row flex-wrap m-0 p-0 gap-2'>
                    {kanjiList.map(kanji =>
                        <Link
                            className="no-underline bg-pink-500 text-white 
                                border border-pink-500 rounded-md
                                p-2
                                hover:bg-pink-600"
                            href={`/visually-similar/kanji/${kanji["id"]}`}
                        >
                            <li key={kanji["id"]}>
                                <div className='flex flex-col w-24'>
                                    <div className='japanese-font text-5xl flex justify-center text-center'>
                                        {kanji["data"]["slug"]}
                                    </div>
                                    <div className='flex justify-center text-center pt-2'>
                                        {kanji["data"]["meanings"][0]["meaning"]}
                                    </div>

                                </div>
                            </li>
                        </Link>
                    )}
                </ul>
            </div>

        </section>
    );
}

export default JlptLevelGroupComponent;