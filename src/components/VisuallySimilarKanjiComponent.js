'use client'

import { Col, Row, Form, Button } from 'react-bootstrap';
import MultiRangeSliderComponent from './MultiRangeSlider/MultiRangeSliderComponent';
import { LoadingSpinner } from './LoadingSpinner';
import { useState } from 'react';

export const VisuallySimilarKanji = (props) => {

    const [loading, setLoading] = useState(false);

    let visMinValue = loadfromLocalStorage('visMinValue', 21);
    let visMaxValue = loadfromLocalStorage('visMaxValue', 41);

    function loadfromLocalStorage(localStorageKey, defaultvalue) {
        const storedValue = JSON.parse(localStorage.getItem(localStorageKey));
        return storedValue !== undefined ? storedValue : defaultvalue;
    }


    function handleMultiRangeSliderChange({ min, max }) {
        visMinValue = min;
        localStorage.setItem('visMinValue', visMinValue);
        visMaxValue = max;
        localStorage.setItem('visMaxValue', visMaxValue);
        //console.log(`min = ${min}, max = ${max}`);
    }

    function onVisSimFormSubmit(event) {
        event.preventDefault();
        setLoading(true);
        props.handleLevelSelection(visMinValue, visMaxValue);
    }

    return (
        <Row className='quiz-settings'>
            <Col>
                <Row><Col><h4 className='quiz-type-title'>Visually Similar Kanjis</h4></Col></Row>

                <Row className='align-items-center p-3'>
                    <Col className="col-4 level-label">
                        Level range:
                    </Col>
                    <Col>
                        <MultiRangeSliderComponent
                            min={1}
                            max={60}
                            onChange={handleMultiRangeSliderChange}
                            minStartValue={visMinValue}
                            maxStartValue={visMaxValue}
                        />
                    </Col>
                    <Col className='col-4 p-2 d-flex flex-column'>
                        <Form id="vis-sim-form" onSubmit={onVisSimFormSubmit}>
                            <Button type='submit' className='start-quiz-button'
                                disabled={loading}>
                                {loading ? <LoadingSpinner className="loading-spinner" /> : 'Start Quiz'}
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}



export default VisuallySimilarKanji;