'use client'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { morePagesSelector } from '../store/reducers/morePagesReducer'
import Layout from '../layout/Layout'
import Breadcrumb from '../breadcrumb/Breadcrumb'
import { useRouter } from 'next/router'
import DetailPageSkeleton from '../skeletons/DetailPageSkeleton'
import { NoDataFound } from '@/utils/helpers'

const SocialPages = () => {

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const router = useRouter();
    const slug = router?.query?.slug;


    const pageData = useSelector(morePagesSelector)

    useEffect(() => {
        if (slug && pageData?.length > 0) {
            // Find the page object with matching slug
            const page = pageData.find(page => page.slug === slug)
            // If a matching page is found, set its data
            console.log('page', page)
            if (page) {
                setData([page])
                setLoading(false)
            } else {
                // If no matching page is found, handle accordingly (e.g., show a not found message)
                setLoading(false)
                setData([])
            }
        }
    }, [slug, pageData])

    useEffect(() => {
        // console.log('dataPagesMore =>', data)
    }, [data])



    return (
        <Layout>
            <Breadcrumb secondElement={slug} />
            {
                loading ? <DetailPageSkeleton />
                    :
                    <section className='morePagesSect container mt-8 md:mt-12 pb-1'>
                        {
                            data[0]?.page_content ?
                                <div
                                    className='p-3 mb-0'
                                    dangerouslySetInnerHTML={{ __html: data && data[0]?.page_content }}
                                ></div> :
                                <div>
                                    <NoDataFound />
                                </div>
                        }
                    </section>
            }
        </Layout>
    )
}

export default SocialPages