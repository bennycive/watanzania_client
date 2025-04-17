'use client'
import React from 'react'
import AdSpaceSkeleton from '@/components/skeletons/AdSpaceSkeleton'
import StyleTitleSkeleton from '@/components/skeletons/featureStyles/StyleTitleSkeleton'
import StyleTwoSkeletonCard from './StyleTwoSkeletonCard'

const StyleTwoSkeleton = () => {

  return (
    <div className='styleTwo'>
      <AdSpaceSkeleton />

      <section className='container'>
        <StyleTitleSkeleton />

        <div className="grid lg:grid-cols-8 gap-4">
          <div className='grid lg:grid-cols-1 gap-4 lg:col-span-2'>
            <StyleTwoSkeletonCard />
            <StyleTwoSkeletonCard />
          </div>
          <div className='lg:col-span-4'>
            <StyleTwoSkeletonCard middleCard={true} />
          </div>
          <div className='grid lg:grid-cols-1 gap-4 lg:col-span-2'>
            <StyleTwoSkeletonCard />
            <StyleTwoSkeletonCard />
          </div>
        </div>

      </section>
    </div>
  )
}

export default StyleTwoSkeleton;