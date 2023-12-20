
const srsLevelToWaitingTimeMap = {
    1: (4 * 60 * 60 * 1000), // 4 hours
    2: (8 * 60 * 60 * 1000), // 8 hours
    3: (24 * 60 * 60 * 1000), // 1 day
    4: (2 * 24 * 60 * 60 * 1000), // 2 days
    5: (7 * 24 * 60 * 60 * 1000), // 1 week
    6: (2 * 7 * 24 * 60 * 60 * 1000), // 2 weeks
    7: (4 * 7 * 24 * 60 * 60 * 1000), // 1 month
    8: (4 * 4 * 7 * 24 * 60 * 60 * 1000), // 4 months
    9: (100 * 12 * 4 * 7 * 24 * 60 * 60 * 1000), // Forever
};

function calculateUnlockDate(srsLevel) {
    const now = new Date();
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return new Date(now.getTime() + srsLevelToWaitingTimeMap[srsLevel]);
}


// C C // avoid double correct answer if I already responded correctly once
// C W // this should still result in srs -2
// W C // avoid adding correct answer if I already responded wrongly once
// W W // -4
export const updateSingleSrsAfterReview = async(score, kanjiId, reviewSet) => {
    const currentSrsStage = reviewSet.filter(review => review.element_id === kanjiId)[0].current_srs_stage;
    const newSrsStage = clampSrsStage(currentSrsStage + normalizeSrsScore(score));
    sendRequest('/api/reviews', 'PUT', kanjiId, newSrsStage);
}

export const updateSrsAfterReview = async (scoreMap, reviewSet) => {
    scoreMap.forEach((value, key) => {
        updateSingleSrsAfterReview(value.score, key, reviewSet);
    });
}

// Adjust score at the end
// +2 --> +1
// -1 --> -2
function normalizeSrsScore(score) {
    return score === 2 ? 1 : score === -1 ? -2 : score;
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
        sendRequest('/api/reviews', 'POST', elementId, 1);
    }

}

function sendRequest(url, method, elementId, newSrsStage) {
    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            element_id: elementId,
            current_srs_stage: newSrsStage,
            unlock_date: calculateUnlockDate(newSrsStage)
        })
    })
        .then((res) => {
            console.log('Adding/updating element to reviews result:', res.status);
            res.json();
        })
}