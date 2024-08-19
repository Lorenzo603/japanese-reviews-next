import { Highlight } from "react-instantsearch";
var wanakana = require('wanakana');

const HitComponent = ({ hit }) => {

    return (
        <div className="p-2">
            <a href={`/visually-similar/kanji/${hit.id}`}>
                <div className="text-lg">
                    {hit.slug}
                </div>
                <div>
                    <Highlight hit={hit} attribute="meanings" tagName="mark"
                        classNames={{
                            highlighted: 'bg-green-500 p-0',
                        }}
                    />
                </div>
                <div className="text-red-200">
                    {hit.readingsKun.join(", ")}
                </div>
                <div className="text-red-300">
                    {hit.readingsOn.map(reading => wanakana.toKatakana(reading)).join(", ")}
                </div>
                <div className="text-red-400">
                    {hit.readingsNames.join(", ")}
                </div>
            </a>
        </div>
    )

}

export default HitComponent;
