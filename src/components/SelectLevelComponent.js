import { useEffect, useState } from "react";
import { Button, Col, OverlayTrigger, Popover, Row } from "react-bootstrap";

export const SelectLevel = (props) => {

    const [level, _setLevel] = useState(null);
    const setLevel = (newLastSelectedLevel) => {
        _setLevel(newLastSelectedLevel);
        fetch('/api/accounts', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ newLastSelectedLevel: newLastSelectedLevel })
        })
            .then((res) => {
                console.log('POST last selected level response status:', res.status);
                res.json();
            })
    }

    function handleLevelNumberClick(index) {
        setLevel(index);
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

    useEffect(() => {
        fetch('/api/accounts')
            .then((res) => res.json())
            .then((data) => {
                console.log('GET last selected level:', data);
                _setLevel(Number(data[0].last_selected_level));
            })
    }, []);

    return (
        <OverlayTrigger variant="dark" trigger="click" placement="right" rootClose="true" overlay={popover}>
            <Button className='selectedLevel'>{level || <span>🌀</span>}</Button>
        </OverlayTrigger >
    );
}

export default SelectLevel;