export const DEFAULT_PROMPTS_JSON = [
    {
        "mode": "meaning",
        "correct": null,
        "answered": false
    },
    {
        "mode": "reading",
        "correct": null,
        "answered": false
    }
]


// C C // avoid double correct answer if I already responded correctly once
// C W // this should still result in srs -2
// W C // avoid adding correct answer if I already responded wrongly once
// W W // -4
export function calculateNewSrsStage(currentSrsStage, prompts) {
    const numWrongAnswers = prompts.filter(prompt => prompt.correct === false).length;
    const score = numWrongAnswers === 0 ? 1 : numWrongAnswers === 1 ? -2 : -4;
    return clampSrsStage(currentSrsStage + score);
}

export function clampSrsStage(score) {
    return Math.max(1, Math.min(9, score));
}

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

export function calculateUnlockDate(srsLevel) {
    const now = new Date();
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return new Date(now.getTime() + srsLevelToWaitingTimeMap[srsLevel]);
}