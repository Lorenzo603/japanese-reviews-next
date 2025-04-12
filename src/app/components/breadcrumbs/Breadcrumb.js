import ArrowChevronRightSvg from "./ArrowChevronRightSvg";
import HomeIconSvg from "./HomeIconSvg";
import Link from "next/link";

export const Breadcrumb = (props) => {

	if (!props.isKanjiPage) {
		return (
			<ul className="flex items-center py-4">
				<li className="flex flex-row items-center">
					<Link href="/" className="flex items-center gap-x-1">
						<HomeIconSvg />
						<span>Home</span>
					</Link>
				</li>
			</ul>
		)
	}

	return (
		<ul className="flex items-center py-4">
			<li className="flex flex-row items-center">
				<Link href="/" className="flex items-center gap-x-1">
					<HomeIconSvg />
					<span>Home</span>
				</Link>
			</li>
			{
				props.jlptLevel &&
				<li className="flex flex-row items-center">
					<Link href={`/visually-similar/jlpt-level-${props.jlptLevel}`} className="flex items-center">
						<ArrowChevronRightSvg />
						<span>JLPT {props.jlptLevel}</span>
					</Link>
				</li>
			}

		</ul>
	)
};

export default Breadcrumb;
