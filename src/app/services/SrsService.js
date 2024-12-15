// TODO: Do this on Backend


export const updateReviewPrompt = async(kanjiId, mode, correct) => {
    sendRequest('/api/reviews', 'PUT', kanjiId, mode, correct);
}

function clampSrsStage(score) {
    return Math.max(1, Math.min(9, score));
}


export const updateSrsWrongAnswer = async (elementId) => {
    const reviewData = await (await fetch('/api/reviews')).json();
    const currentReviewArr = reviewData.reviews.filter((review) => review.element_id === elementId)
    const isReviewExisting = currentReviewArr.length > 0;
    if (isReviewExisting) {
        const currentReview = currentReviewArr[0];
        sendRequest('/api/reviews', 'PUT', elementId, clampSrsStage(currentReview.current_srs_stage - 2));
    } else {
        const reviews = await (await fetch(`/api/reviews/${elementId}`)).json();
        console.log('reviews:', reviews);
        if (reviews.length === 0) {
            sendRequest('/api/reviews', 'POST', elementId, 1);
        } else {
            // TODO: review this logic, this branch is not possible?
            sendRequest('/api/reviews', 'PUT', elementId, 1);
        }
    }

}

function sendRequest(url, method, elementId, mode, correct) {
    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            element_id: elementId,
            mode: mode,
            correct: correct
        })
    })
        .then((res) => {
            console.log('Adding/updating element to reviews result:', res.status);
            res.json();
        })
}