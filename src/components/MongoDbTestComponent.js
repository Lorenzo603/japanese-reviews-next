import { useEffect, useState } from 'react';

export const MongoDbTestComponent = () => {

    const [lastSelectedLevel, setLastSelectedLevel] = useState(null);

    useEffect(() => {
        fetch('/api/accounts')
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setLastSelectedLevel(Number(data[0].lastSelectedLevel));
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <p>Level: {lastSelectedLevel}</p>
    );
}

export default MongoDbTestComponent;