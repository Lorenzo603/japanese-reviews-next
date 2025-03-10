'use client'

import MultiRangeSliderComponent from './MultiRangeSlider/MultiRangeSliderComponent';
import { useState, useEffect } from 'react';
import { getCookie, setCookie } from 'cookies-next';
import StartQuizButton from '../(dashboard)/components/StartQuizButton';

export const VisuallySimilarKanji = (props) => {

    const [loading, setLoading] = useState(false);

    const [visMinValue, setVisMinValue] = useState(Number.NaN);
    const [visMaxValue, setVisMaxValue] = useState(Number.NaN);

    useEffect(() => {
        const storedMin = Number(getCookie('visMinValue'));
        const storedMax = Number(getCookie('visMaxValue'));
        setVisMinValue(!Number.isNaN(storedMin) ? storedMin : 10);
        setVisMaxValue(!Number.isNaN(storedMax) ? storedMax : 40);
    }, []);


    function handleMultiRangeSliderChange({ min, max }) {
        setVisMinValue(min);
        setCookie('visMinValue', min, { sameSite: true });
        setVisMaxValue(max);
        setCookie('visMaxValue', max, { sameSite: true });
        //console.log(`min = ${min}, max = ${max}`);
    }

    function onVisSimFormSubmit(event) {
        event.preventDefault();
        setLoading(true);
        props.handleLevelSelection(visMinValue, visMaxValue);
    }

    return (
        <div className='p-4 rounded-md border-2 border-blue-600'>
            <h4 className='text-xl pb-4'>Visually Similar Kanjis</h4>

            <form id="vis-sim-form" onSubmit={onVisSimFormSubmit}>
                <div className='flex flex-row flex-wrap gap-4 items-center'>
                    <div>Level Range:</div>
                    <div>
                        {(!Number.isNaN(visMinValue) && !Number.isNaN(visMaxValue)) &&
                            <MultiRangeSliderComponent
                                min={1}
                                max={60}
                                onChange={handleMultiRangeSliderChange}
                                minStartValue={visMinValue}
                                maxStartValue={visMaxValue}
                            />}
                    </div>
                    <StartQuizButton loading={loading} disabled={loading} />
                </div>
            </form>
        </div>
    );
}



export default VisuallySimilarKanji;