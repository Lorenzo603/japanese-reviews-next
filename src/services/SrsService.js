
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
    return new Date(now.getTime() + srsLevelToWaitingTimeMap[srsLevel]);
}

export const updateSrsWrongAnswer = async (elementId) => {
    const accountInfo = await (await fetch('/api/accounts')).json();
    const currentReviewArr = accountInfo[0].reviews.filter((review) => review.element_id === elementId)
    const isReviewExisting = currentReviewArr.length > 0;
    if (isReviewExisting) {
        const currentReview = currentReviewArr[0];
        sendPost('/api/accounts/reviews/update', elementId, Math.max(1, currentReview.current_srs_stage - 2));
    } else {
        sendPost('/api/accounts/reviews', elementId, 1);
    }

}

export const updateSrsCorrectAnswer = async (elementId) => {
    const accountInfo = await (await fetch('/api/accounts')).json();
    const currentReviewArr = accountInfo[0].reviews.filter((review) => review.element_id === elementId)
    const currentReview = currentReviewArr[0];
    sendPost('/api/accounts/reviews/update', elementId, Math.min(9, currentReview.current_srs_stage + 1));
}

function sendPost(url, elementId, newSrsStage) {
    fetch(url, {
        method: 'POST',
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