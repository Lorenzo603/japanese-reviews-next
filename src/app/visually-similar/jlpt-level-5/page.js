import FooterComponent from '@/app/components/nav/FooterComponent';
import HeaderComponent from '@/app/components/nav/HeaderComponent';
import JlptLevelGroupComponent from '@/app/components/visually-similar/jlptLevelGroup/JlptLevelGroupComponent';

export default function VisuallySimilarJlptLevel5() {

    return (
        <div className='text-white'>
            <HeaderComponent />
            <JlptLevelGroupComponent jlptLevelNumber={5} />
            <FooterComponent />
        </div>

    )
}

