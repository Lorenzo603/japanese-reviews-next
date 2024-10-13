'use client';

import { useState, useEffect, useRef } from 'react';
import { ScoreComponent } from './ScoreComponent';

export const HeaderMenu = (props) => {
    const [focusModeEnabled, setFocusModeEnabled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false); // To handle dropdown visibility
    const dropdownRef = useRef(null); // Reference to the dropdown for detecting outside clicks

    function toggleFocusMode() {
        setFocusModeEnabled(!focusModeEnabled);
        setDropdownOpen(false); // Close the dropdown when the option is selected
    }

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const SessionMenu = (props) => {
        return (
            <div className="relative" ref={dropdownRef}>
                {/* Dropdown Toggle Button */}
                <button
                    onClick={toggleDropdown}
                    className="bg-slate-800 hover:bg-blue-600 text-white px-4 py-2"
                >
                    <span className='flex gap-x-2 items-center'>
                        {!focusModeEnabled && <span>Settings</span>}
                        <span className='text-2xl'>&#9662;</span>
                    </span>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                    <div className="absolute left-0 mt-1 w-48 bg-slate-900 text-white shadow-lg rounded-sm z-10">
                        <button
                            onClick={toggleFocusMode}
                            className="block w-full text-left px-4 py-2 hover:bg-slate-700"
                        >
                            {focusModeEnabled ? "Disable Focus Mode" : "Enable Focus Mode"}
                        </button>
                        <button
                            onClick={() => {
                                props.endSessionHandler();
                                setDropdownOpen(false); // Close the dropdown when the option is selected
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-slate-700"
                        >
                            End Session
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-row justify-between gap-x-4">
            <div className="text-left">
                <SessionMenu endSessionHandler={props.endSessionHandler} />
            </div>
            <div>
                {!focusModeEnabled && (
                    <ScoreComponent
                        totalAnswers={props.totalAnswers}
                        totalCorrect={props.totalCorrect}
                        totalReviews={props.totalReviews}
                    />
                )}
            </div>
        </div>
    );
};

export default HeaderMenu;
