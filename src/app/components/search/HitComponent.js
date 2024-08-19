import { Highlight } from "react-instantsearch";

const HitComponent = ({ hit }) => {

    return (
        <div className="p-2">
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
            <div className="text-red-400">
                {hit.readings.join(", ")}
            </div>
            
        </div>
    )

}

export default HitComponent;
