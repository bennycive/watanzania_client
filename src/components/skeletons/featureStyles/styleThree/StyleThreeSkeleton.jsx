'use client'
import AdSpaceSkeleton from '@/components/skeletons/AdSpaceSkeleton'
import StyleTitleSkeleton from '@/components/skeletons/featureStyles/StyleTitleSkeleton'
import StyleThreeSkeletonCardOne from './StyleThreeSkeletonCardOne'
import StyleThreeSkeletonCardTwo from './styleThreeSkeletonCardTwo'

const StyleThreeSkeletonSkeleton = () => {
  return (
    <div className='styleThree'>
      <AdSpaceSkeleton />

      <section className='container'>
        <StyleTitleSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          <div className="relative col-span-6">
            <StyleThreeSkeletonCardOne />
          </div>

          <div className="col-span-6 flex flex-col gap-4">
            <>
              <StyleThreeSkeletonCardTwo />
              <StyleThreeSkeletonCardTwo />
            </>

          </div>
        </div>



      </section>
    </div>
  )
}

export default StyleThreeSkeletonSkeleton