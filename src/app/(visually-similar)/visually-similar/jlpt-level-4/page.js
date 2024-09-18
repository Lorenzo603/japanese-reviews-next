import JlptLevelGroupComponent from '@/app/(visually-similar)/visually-similar/jlptLevelGroup/JlptLevelGroupComponent';
import Breadcrumb from '@/app/components/breadcrumbs/Breadcrumb';

export default function VisuallySimilarJlptLevel4() {

    return (
        <div className='w-full mx-auto max-w-7xl px-6 pb-6'>
            <Breadcrumb />
            <JlptLevelGroupComponent jlptLevelNumber={4} />
        </div>
    )
}

