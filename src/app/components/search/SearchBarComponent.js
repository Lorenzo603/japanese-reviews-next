import SearchComponent from "./SearchComponent";

export const SearchBarComponent = () => {

    return (
        <div className="bg-gradient-to-b from-sky-100 to-slate-50">
            <h1 id="search" className="sr-only">Search</h1>
            <div className="flex justify-center p-4">
                <div>
                    <SearchComponent />
                </div>
            </div>
        </div>
    );
}

export default SearchBarComponent;