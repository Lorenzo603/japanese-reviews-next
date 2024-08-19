import Link from "next/link";
import LoginButton from "../buttons/login/LoginButton";

const HeaderComponent = () => {

    return (
        <header>
            <nav>
                <Link href="/">Home</Link>
                <Link href="/#browse-by-jlpt-level">Browse by JPLT level</Link>
            </nav>
            <div>
                <LoginButton />
            </div>
        </header>
    )

}

export default HeaderComponent;
