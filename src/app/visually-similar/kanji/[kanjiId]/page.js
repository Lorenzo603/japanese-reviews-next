
export default function VisuallySimilarKanji({ params }) {

    return (

        <main className='text-white'>
            This is {params.kanjiId}
            {/* Curret kanji */}
            <section>
                <div>
                    <h1>SLUG</h1>
                    <h2>Meanings</h2>
                    <h2>Readings</h2>
                </div>
            </section>

            {/* Visually similar kanjis */}
            <section>

                {/* TODO: Loop */}
                <div>
                    <h1>SLUG</h1>
                    <h2>Meanings</h2>
                    <h2>Readings</h2>
                </div>

            </section>
        </main>

    )
}

