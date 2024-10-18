import Link from "next/link";
import { Highlight } from "react-instantsearch";

const HitComponent = ({ hit }) => {


    function highlightKanaBasedOnRomajiMatch(hit) {
        for (let i = 0; i < hit._highlightResult.readingsKunRomaji.length; i++) {
            if (hit._highlightResult.readingsKunRomaji[i].matchLevel === 'full') {
                hit._highlightResult.readingsKun[i].value = `<mark>${hit._highlightResult.readingsKun[i].value}</mark>`
            }
        }
        for (let i = 0; i < hit._highlightResult.readingsOnRomaji.length; i++) {
            if (hit._highlightResult.readingsOnRomaji[i].matchLevel === 'full') {
                hit._highlightResult.readingsOn[i].value = `<mark>${hit._highlightResult.readingsOn[i].value}</mark>`
            }
        }
        for (let i = 0; i < hit._highlightResult.readingsNamesRomaji.length; i++) {
            if (hit._highlightResult.readingsNamesRomaji[i].matchLevel === 'full') {
                hit._highlightResult.readingsNames[i].value = `<mark>${hit._highlightResult.readingsNames[i].value}</mark>`
            }
        }
    }

    highlightKanaBasedOnRomajiMatch(hit);

    return (
        <Link className="no-underline text-slate-900"
            href={`/visually-similar/kanji/${hit.slug}`} >

            <div className="flex gap-4">
                <div className="font-japanese text-5xl">
                    {hit.slug}
                </div>
                <div className="flex-col">
                    <div className="font-bold pb-2">
                        <Highlight hit={hit} attribute="meanings"
                            classNames={{
                                highlighted: 'bg-pink-200 p-0',
                            }}
                        />
                    </div>
                    {hit.readingsKun.length > 0 &&
                        <div className="font-japanese flex gap-x-2">
                            <span>Kun:</span>
                            <Highlight hit={hit} attribute="readingsKun"
                                separator="、"
                                classNames={{
                                    highlighted: 'bg-pink-200 p-0',
                                }}
                            />
                        </div>
                    }
                    {hit.readingsOn.length > 0 &&
                        <div className="font-japanese flex gap-x-2">
                            <span>On:</span>
                            <Highlight hit={hit} attribute="readingsOn"
                                separator="、"
                                classNames={{
                                    highlighted: 'bg-pink-200 p-0',
                                }}
                            />
                        </div>
                    }
                    {hit.readingsNames.length > 0 &&
                        <div className="font-japanese flex gap-x-2">
                            <span>Name:</span>
                            <Highlight hit={hit} attribute="readingsNames"
                                separator="、"
                                classNames={{
                                    highlighted: 'bg-pink-200 p-0',
                                }}
                            />
                        </div>
                    }
                </div>

            </div>
        </Link>
    )

}

export default HitComponent;
