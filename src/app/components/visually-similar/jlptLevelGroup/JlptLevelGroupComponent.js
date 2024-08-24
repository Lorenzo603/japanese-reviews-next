import { getDictionary } from '@/app/components/backend/DictionaryLoaderComponent';

export const JlptLevelGroupComponent = async (props) => {

    const fullKanjiDictionary = await getDictionary('kanji_full');
    const kanjiList = fullKanjiDictionary
        .filter(item => item['data'].hasOwnProperty('categories') && item['data']['categories'].includes(`jlpt${props.jlptLevelNumber}`))

    return (
        <section>
            <h1>JLPT Level {props.jlptLevelNumber}</h1>
            <ul>
                {kanjiList.map(kanji =>
                    <li key={kanji["id"]}>
                        <a className="japanese-font" href={`/visually-similar/kanji/${kanji["id"]}`}>
                            {kanji["data"]["slug"]}
                        </a>
                    </li>
                )}
            </ul>

        </section>
    );
}

export default JlptLevelGroupComponent;