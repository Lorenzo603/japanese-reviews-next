import SearchComponent from "./SearchComponent";

export const SearchBarComponent = () => {

    return (
        <section>
            <h1 id="search" className="sr-only">Search</h1>
            <div className="w-full flex justify-center p-4">
                <div>
                    <SearchComponent />
                </div>
            </div>
        </section>
    );
}

export default SearchBarComponent;