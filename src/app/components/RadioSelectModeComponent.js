'use client'

import { Col, Row } from 'react-bootstrap';

export const RadioSelectModeComponent = (props) => {

    return (

        <Row className='align-items-center p-3'>
            <Col className='col-4 select-title'>
                {props.title}
            </Col>

            {props.children}

        </Row>

    );
}

export default RadioSelectModeComponent;