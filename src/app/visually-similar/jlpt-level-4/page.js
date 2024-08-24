import FooterComponent from '@/app/components/nav/FooterComponent';
import HeaderComponent from '@/app/components/nav/HeaderComponent';
import JlptLevelGroupComponent from '@/app/components/visually-similar/jlptLevelGroup/JlptLevelGroupComponent';

export default function VisuallySimilarJlptLevel4() {

    return (
        <div>
            <HeaderComponent />
            <JlptLevelGroupComponent jlptLevelNumber={4} />
            <FooterComponent />
        </div>

    )
}

