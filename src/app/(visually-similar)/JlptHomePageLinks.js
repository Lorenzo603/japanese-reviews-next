import Link from "next/link";

const JlptHomePageLinks = (props) => {

    const ENABLED_CSS_CLASSES = "bg-pink-500 hover:bg-pink-700";
    const DISABLED_CSS_CLASSES = "bg-gray-300 cursor-default";

    return (
        <Link className={`line-clamp-1 flex flex-col items-center justify-center rounded-md 
            min-w-32 min-h-32
            p-4 text-center text-base font-bold text-white shadow-sm 
            no-underline ${props.enabled ? ENABLED_CSS_CLASSES : DISABLED_CSS_CLASSES}`} href={props.href}>
            <div className="text-sm">JLPT</div>
            <div className="text-3xl">{props.level}</div>
            {!props.enabled && <div className="text-sm">Coming Soon!</div>}
        </Link>
    );
}

export default JlptHomePageLinks;