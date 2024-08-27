'use client'

import { useVisuallySimilarQuizContext } from "@/app/context/visuallySimilarQuizContext";

export default function VisuallySimilarReview() {

    const { promptSet, multichoiceInput, typingInput } = useVisuallySimilarQuizContext();

    return (
        <main>
            <div className="w-full">
                <div className="mx-auto max-w-7xl p-6">
                    <div className="max-w-2xl py-4">
                        <section>
                            <p>{promptSet[0]["data"]["slug"]}</p>
                            <p className="japanese-font">{promptSet[1]["data"]["slug"]}</p>
                            <p>{promptSet[2]["data"]["slug"]}</p>
                       
                        </section>
                    </div>
                </div>
            </div>
        </main>
    )
}
