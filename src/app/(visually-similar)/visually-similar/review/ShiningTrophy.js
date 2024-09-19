import Image from 'next/image';
import { useState } from 'react';

const ShiningTrophy = (props) => {
    const [shineClass, setShineClass] = useState('');

    // Activate the below useeffect in case you want shininess to be automatic on an interval

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         console.log(shineClass)
    //         setShineClass('shine');
    //         setTimeout(() => setShineClass(''), 1000); // Reset after animation duration (1s)
    //     }, 5000); // Interval for the shine effect (5s)

    //     return () => clearInterval(interval); // Cleanup on unmount
    // }, []);

    function shine() {
        setShineClass('shine');
        setTimeout(() => setShineClass(''), 1000);
    }

    return (
        <div className={`relative inline-block trophy-container overflow-hidden ${shineClass}`}
            onMouseEnter={() => shine()}>
            <Image
                src={`/img/trophies/trophy-${props.trophy}.svg`}
                alt=""
                width={64}
                height={64}
                className="trophy-image"
                style={{ width: 64, height: 64 }}
            />
        </div>
    );
};

export default ShiningTrophy;
