import Link from "next/link";
import { Highlight } from "react-instantsearch";
var wanakana = require('wanakana');

const HitComponent = ({ hit }) => {

    return (
        <Link className="no-underline text-slate-900"
            href={`/visually-similar/kanji/${hit.id}`} >
            <div className="flex gap-4">
                <div className="text-5xl">
                    <span>{hit.slug}</span>
                </div>
                <div className="flex-col">
                    <div>
                        <Highlight hit={hit} attribute="meanings" tagname="mark"
                            classNames={{
                                highlighted: 'bg-pink-200 p-0',
                            }}
                        />
                    </div>
                    {hit.readingsKun.length > 0 &&
                        <div>
                            Kun:&nbsp;{hit.readingsKun.join(", ")}
                        </div>
                    }
                    {hit.readingsOn.length > 0 &&
                        <div>
                            On:&nbsp;{hit.readingsOn.map(reading => wanakana.toKatakana(reading)).join(", ")}
                        </div>
                    }
                    {hit.readingsNames.length > 0 &&
                        <div>
                            Name:&nbsp;{hit.readingsNames.join(", ")}
                        </div>
                    }
                </div>

            </div>
        </Link>
    )

}

export default HitComponent;
