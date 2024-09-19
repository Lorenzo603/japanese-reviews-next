import Image from "next/image";
import Link from "next/link";

const JlptHomePageLinks = (props) => {
    const ENABLED_CSS_CLASSES = "bg-pink-500 hover:bg-pink-700";
    const DISABLED_CSS_CLASSES = "bg-gray-300 cursor-default";

    return (
        <div className="relative inline-block">
            {
                props.medal !== "" &&
                <div className="absolute top-[-3px] left-[-5px]">
                    <Image src={`/img/medals/medal-${props.medal}.svg`} alt="" width={32} height={32} style={{width: 32, height: 32}}/>
                </div>
            }

            <Link
                className={`line-clamp-1 flex flex-col items-center justify-center rounded-md 
          min-w-32 min-h-32 p-4 text-center text-base font-bold text-white shadow-sm no-underline 
          ${props.enabled ? ENABLED_CSS_CLASSES : DISABLED_CSS_CLASSES}`}
                href={props.href}
            >
                <div className="text-sm">JLPT</div>
                <div className="text-3xl">{props.level}</div>
                {!props.enabled && <div className="text-sm">Coming Soon!</div>}
            </Link>
        </div>
    );
};

export default JlptHomePageLinks;
