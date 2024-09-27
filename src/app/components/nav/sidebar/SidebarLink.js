import Link from "next/link";

const SidebarLink = (props) => {

    return (
        <Link href={props.href} className="w-full" onClick={props.onClick}>
            <div className="flex flex-row gap-x-2 items-center">
                {props.icon}
                {props.title}
            </div>
        </Link>
    );
}

export default SidebarLink;