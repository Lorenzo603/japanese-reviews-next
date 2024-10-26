import JlptLevelGroupComponent from '@/app/(visually-similar)/visually-similar/jlptLevelGroup/JlptLevelGroupComponent';
import Breadcrumb from '@/app/components/breadcrumbs/Breadcrumb';

export default function VisuallySimilarJlptLevel5() {

    return (
        <div className='w-full mx-auto max-w-7xl px-6 pb-6'>
            <Breadcrumb isKanjiPage={false} />
            <JlptLevelGroupComponent jlptLevelNumber={5} medal="bronze" />
        </div>
    )
}

