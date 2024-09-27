import Link from "next/link";

const HeaderLinkComponent = (props) => {

    return (
        <div className="flex items-center">
            <Link title={props.title}
                className="no-underline 
                            font-bold text-blue-900
                            items-center 
                            hidden sm:flex 
                            rounded-md gap-x-2 px-2 py-2.5
                            hover:bg-slate-50"
                href={props.href}>
                {props.icon}
                <span className="hidden lg:inline">{props.text}</span>
            </Link>
        </div>
    );
}

export default HeaderLinkComponent;