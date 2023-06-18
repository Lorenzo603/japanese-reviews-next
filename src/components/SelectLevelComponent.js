'use client'

import { Button, Col, OverlayTrigger, Popover, Row } from "react-bootstrap";

export const SelectLevel = (props) => {

    function handleLevelNumberClick(index) {
        props.handleLevelSelect(index);
        document.body.click();
    }

    const popover = (
        <Popover id="popover-basic">
            <Popover.Body>
                <Row>
                    {Array.from({ length: 61 }, (_, i) => i + 1).map(index => {
                        return (
                            <Col key={'level-number-' + index} className='col-2 level-number'>
                                <Button onClick={() => { handleLevelNumberClick(index); }}>{index}</Button>
                            </Col>
                        );
                    })}
                </Row>
            </Popover.Body>
        </Popover>
    );

    return (
        <OverlayTrigger variant="dark" trigger="click" placement="right" rootClose="true" overlay={popover}>
            <Button className='selectedLevel'>{props.level || <span>🌀</span>}</Button>
        </OverlayTrigger >
    );
}

export default SelectLevel;