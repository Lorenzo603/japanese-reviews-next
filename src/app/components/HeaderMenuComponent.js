'use client'

import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { ScoreComponent } from './ScoreComponent';

export const HeaderMenu = (props) => {

    const [focusModeEnabled, setFocusModeEnabled] = useState(false);

    function toggleFocusMode() {
        setFocusModeEnabled(!focusModeEnabled);
    }

    const SessionMenu = (props) => {
        return (
            <Dropdown>
                <Dropdown.Toggle>
                    {!focusModeEnabled &&
                        <div className='bg-slate-800'>Settings</div>
                    }
                </Dropdown.Toggle>
                <Dropdown.Menu variant="dark">
                    <Dropdown.Item onClick={toggleFocusMode}>{focusModeEnabled ? "Disable Focus Mode" : "Enable Focus Mode"}</Dropdown.Item>
                    <Dropdown.Item onClick={props.endSessionHandler}>End Session</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    return (
        <div className='flex flex-row justify-between gap-x-4'>
            <div className='text-left'>
                <SessionMenu endSessionHandler={props.endSessionHandler} />
            </div>
            <div>
                {!focusModeEnabled && <ScoreComponent totalAnswers={props.totalAnswers} totalCorrect={props.totalCorrect} totalReviews={props.totalReviews} />}
            </div>
        </div>
    );
}

export default HeaderMenu;