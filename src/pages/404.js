'use client'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('@/components/layout/Layout'), { ssr: false })
import Image from 'next/image'
import React from 'react'
import noPageFoundImg from '../assets/Images/error.svg'
import { placeholderImage, translate } from '@/utils/helpers'
import { FaArrowLeft } from 'react-icons/fa6'
import Link from 'next/link'

const NotFound = () => {
    return (
        <Layout>
            <section className='container commonMT'>
                <div className='flexCenter flex-col gap-2 md:gap-3 textPrimary font-[600] text-center'>
                    <Image src={noPageFoundImg} width={0} height={0} loading='lazy' alt='no-page-found' className='w-auto h-auto' onError={placeholderImage} />
                    <h1 className='text-2xl md:text-3xl lg:text-4xl'>{translate('pageLost')}</h1>
                    <h2 className='text-xl md:text-2xl'>{translate('notFault')}</h2>
                    <Link href={'/'}>
                        <button className='flex items-center gap-1 commonBtn mt-4'>
                            {translate('back')}
                            <FaArrowLeft className='' />
                        </button>
                    </Link>
                </div>
            </section>
        </Layout>
    )
}

export default NotFound