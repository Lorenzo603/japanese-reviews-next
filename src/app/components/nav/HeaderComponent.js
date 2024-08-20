import Link from "next/link";
import LoginButton from "../buttons/login/LoginButton";

const HeaderComponent = () => {
    return (
        <header>
            <div className="flex justify-between bg-pink-200 p-4">
                <div>
                    <nav className="flex space-x-4">
                        <Link href="/">Home</Link>
                        <Link className="hidden md:inline" href="/#browse-by-jlpt-level">Browse by JLPT level</Link>
                    </nav>
                </div>
                <div>
                    <LoginButton />
                </div>
            </div>
        </header>
    );
}

export default HeaderComponent;