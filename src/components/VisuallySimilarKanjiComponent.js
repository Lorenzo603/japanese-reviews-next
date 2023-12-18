'use client'

import { Col, Row, Form, Button } from 'react-bootstrap';
import MultiRangeSliderComponent from './MultiRangeSlider/MultiRangeSliderComponent';
import { LoadingSpinner } from './LoadingSpinner';
import { useState, useEffect } from 'react';
import { getCookie, setCookie } from 'cookies-next';

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
        <Row className='quiz-settings'>
            <Col>
                <Row><Col><h4 className='quiz-type-title'>Visually Similar Kanjis</h4></Col></Row>

                <Form id="vis-sim-form" onSubmit={onVisSimFormSubmit}>
                    <Row className='align-items-center p-3'>
                        <Col className="col-2 level-label">
                            Level Range:
                        </Col>
                        <Col className="col-8">
                            {(!Number.isNaN(visMinValue) && !Number.isNaN(visMaxValue)) &&
                                <MultiRangeSliderComponent
                                    min={1}
                                    max={60}
                                    onChange={handleMultiRangeSliderChange}
                                    minStartValue={visMinValue}
                                    maxStartValue={visMaxValue}
                                />}
                        </Col>
                        <Col className='col-2 p-2 d-flex flex-column'>

                            <Button type='submit' className='start-quiz-button'
                                disabled={loading}>
                                {loading ? <LoadingSpinner className="loading-spinner" /> : 'Start Quiz'}
                            </Button>

                        </Col>
                    </Row>
                </Form>
            </Col>
        </Row>
    );
}



export default VisuallySimilarKanji;