import Link from "next/link";


export default function NewsPage() {



    return (
        <main>
            <div className="w-full">
                <div className="mx-auto max-w-7xl p-6">
                    <div className="max-w-2xl py-4">
                        <section>
                            <h1 className="text-2xl">News</h1>
                            <section>
                                <h2>News Title</h2>
                                <div>
                                    <div>date</div>
                                    <p>
                                        Content
                                    </p>
                                </div>    
                            </section>
                        </section>
                    </div>
                </div>
            </div>
        </main>

    )
}
