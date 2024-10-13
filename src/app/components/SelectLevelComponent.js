import { useState, useRef, useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export const SelectLevel = (props) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const popoverRef = useRef(null);

    function handleLevelNumberClick(index) {
        props.handleLevelSelect(index);
        setIsPopoverOpen(false);  // Close the popover after selecting a level
    }

    // Close the popover when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setIsPopoverOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [popoverRef]);

    return (
        <div className="relative inline-block">
            {/* Button to toggle popover */}
            <button
                onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                className="border-1 border-blue-600 p-2 hover:bg-blue-600 text-white"
            >
                {props.level || <LoadingSpinner className="loading-spinner" />}
            </button>

            {/* Popover Content */}
            {isPopoverOpen && (
                <div
                    ref={popoverRef}
                    className="absolute w-80 mt-2 left-0 bg-slate-800 shadow-lg z-50"
                >
                    <div className="grid grid-cols-6">
                        {Array.from({ length: 61 }, (_, i) => i + 1).map((index) => (
                            <button
                                key={'level-number-' + index}
                                className="text-white bg-slate-800 hover:bg-blue-600 
                                    border-1 border-blue-600 p-2
                                    transition"
                                onClick={() => handleLevelNumberClick(index)}
                            >
                                {index}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SelectLevel;
