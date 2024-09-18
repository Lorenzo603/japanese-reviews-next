import JlptLevelGroupComponent from '@/app/(visually-similar)/visually-similar/jlptLevelGroup/JlptLevelGroupComponent';
import Breadcrumb from '@/app/components/breadcrumbs/Breadcrumb';

export default function VisuallySimilarJlptLevel3() {

    return (
        <div className='w-full mx-auto max-w-7xl px-6 pb-6'>
            <Breadcrumb />
            <JlptLevelGroupComponent jlptLevelNumber={3} />
        </div>
    )
}

