'use client'

import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import { LoadingSpinner } from './LoadingSpinner';

export const SelectLevel = (props) => {

    function handleLevelNumberClick(index) {
        props.handleLevelSelect(index);
        document.body.click();
    }

    const popover = (
        <Popover id="popover-basic">
            <Popover.Body>
                <div className="grid grid-cols-6">
                    {Array.from({ length: 61 }, (_, i) => i + 1).map(index => {
                        return (
                            <button key={'level-number-' + index}
                                className="text-white border-1 border-blue-600 p-2 hover:bg-blue-600"
                                onClick={() => { handleLevelNumberClick(index); }}>
                                {index}
                            </button>
                        );
                    })}
                </div>
            </Popover.Body>
        </Popover>
    );

    return (
        <OverlayTrigger variant="dark" trigger="click" placement="right" rootClose="true" overlay={popover}>
            <Button className='border-1 border-blue-600 p-2 hover:bg-blue-600'>
                {props.level || <LoadingSpinner className='loading-spinner' />}
            </Button>
        </OverlayTrigger >
    );
}

export default SelectLevel;