import JlptLevelGroupComponent from '@/app/(visually-similar)/visually-similar/jlptLevelGroup/JlptLevelGroupComponent';
import Breadcrumb from '@/app/components/breadcrumbs/Breadcrumb';

export default function VisuallySimilarJlptLevel2() {

    return (
        <div className='w-full mx-auto max-w-7xl px-6 pb-6'>
            <Breadcrumb isKanjiPage={false}/>
            <JlptLevelGroupComponent jlptLevelNumber={2} medal="platinum" />
        </div>
    )
}

