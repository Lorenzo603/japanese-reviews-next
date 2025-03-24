import Image from "next/image";
import Link from "next/link";

const Logo = () => {

	return (
		<div className="flex">
			<Link className="no-underline" href="/">
				<div className="flex items-center gap-x-2">
					<Image src="/img/logos/tomomoji-logo.png" alt=""
						width={419}
						height={106}
						style={{ width: 158, height: 40 }}
					/>
					{/* <h1 className="relative flex flex-row select-none items-baseline text-2xl font-bold mb-0">
                        <span className="tracking-tight text-pink-500 cursor-pointer">
                            To
                            <span className="text-pink-600">mo</span>
                            <span className="text-pink-700">mo</span>
                            <span className="text-pink-800">ji</span>
                        </span>
                    </h1> */}
				</div>
			</Link>
		</div>
	);
}

export default Logo;