import HeaderComponent from '@/app/components/nav/HeaderComponent';
import JlptLevelGroupComponent from '@/app/components/visually-similar/jlptLevelGroup/JlptLevelGroupComponent';

export default function VisuallySimilarJlptLevel4() {

    return (
        <div className='text-white'>
            <HeaderComponent />
            <JlptLevelGroupComponent jlptLevelNumber={4} />
        </div>

    )
}

