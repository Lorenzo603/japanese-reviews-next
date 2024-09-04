import Link from 'next/link';

export const KanjiCardLinkComponent = async (props) => {

    return (
        <li className={`${props.kanjiHasSimilarities ? 'bg-pink-500' : 'bg-pink-300'} 
            rounded-md p-2 hover:bg-pink-600`}>
            <Link className="no-underline text-white"
                href={`/visually-similar/kanji/${props.kanjiId}`}
            >
                <div className='flex flex-col w-24'>
                    <div className='japanese-font text-5xl flex justify-center text-center'>
                        {props.kanjiSlug}
                    </div>
                    <div className='flex justify-center text-center pt-2'>
                        {props.kanjiMeaning}
                    </div>

                </div>
            </Link>
        </li>
    );
}

export default KanjiCardLinkComponent;