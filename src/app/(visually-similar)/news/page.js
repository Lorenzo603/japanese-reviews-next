import Breadcrumb from "@/app/components/breadcrumbs/Breadcrumb";
import Link from "next/link";


export default function NewsPage() {



    return (
        <div className="w-full">
            <div className="mx-auto max-w-7xl px-6 pb-6">
                <Breadcrumb isKanjiPage={false} />
                <main>
                    <div className="max-w-2xl">
                        <section>
                            <h1 className="text-4xl text-pink-800 font-bold">News</h1>
                            <section>
                                <div className="py-4">
                                    <div className="flex flex-row gap-4">
                                        <h2 className="text-2xl font-bold pb-2">Welcome!</h2>
                                        {/* <span>- date here</span> */}
                                    </div>
                                    <div>
                                        <p>
                                            Welcome to the site, you can find info here.
                                        </p>
                                        <p>
                                            The code for this site is available on Github.
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </section>
                        <hr />
                    </div>
                </main>
            </div>
        </div>

    )
}
