'use client'

import { Col, Row } from 'react-bootstrap';
import { SelectModeButton } from './SelectModeButtonComponent';

export const RadioSelectModeComponent = (props) => {

    return (

        <Row className='align-items-center'>
            <Col className='col-2 select-title'>
                {props.config.title}
            </Col>
            {
                props.config.options.map(
                    option => {
                        return (
                            <Col className='col-2'>
                                <SelectModeButton key={option.id}
                                    id={option.id}
                                    onClickHander={props.config.onClickHandler}
                                    checked={option.isChecked()}>
                                    {option.label}
                                </SelectModeButton>
                            </Col>);
                    }
                )
            }

        </Row>

    );
}

export default RadioSelectModeComponent;