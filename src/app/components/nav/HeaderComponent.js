import LoginButton from "../buttons/login/LoginButton";

const HeaderComponent = () => {

    return (
        <header>
            <nav>
                <a>Browse by JPLT level</a>
                <a>Browse by WK level</a>
            </nav>
            <div>
                <LoginButton />
            </div>
        </header>
    )

}

export default HeaderComponent;
