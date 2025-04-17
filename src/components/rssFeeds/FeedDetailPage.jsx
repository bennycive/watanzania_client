import React, { useState, useEffect } from 'react'
import Layout from '../layout/Layout'
import { useRouter } from 'next/router'
import { getRssFeedsApi } from '@/utils/api/api'
import FeedCard from './FeedCard'
import FeedCardSkeleton from '../skeletons/FeedCardSkeleton'
import { NoDataFound } from '@/utils/helpers'

const FeedDetailPage = () => {

    const router = useRouter();
    const [feedData, setFeedData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchRssDetail = async () => {
        setIsLoading(true);
        try {
            const feedId = router?.query?.feedid;
            const { data } = await getRssFeedsApi.getRssFeedDetails({ feed_id: feedId });
            if (!data?.error) {
                setFeedData(data?.data?.channel?.item)
                setIsLoading(false);
            }
            else {
                console.log('error =>',data?.message)
                setFeedData([])
                setIsLoading(false);
            }
        } catch (error) {
            console.log("Error", error)
            setFeedData([])
            setIsLoading(false);
        }
    }
    useEffect(() => {
        fetchRssDetail()
    }, [])

    return (
        <Layout>
            <section className='container commonMT'>

                <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {
                        isLoading ? [...Array(4)].map((_, index) => (
                            <FeedCardSkeleton index={index} />
                        ))
                            :

                            feedData && feedData.length > 0 &&
                            feedData?.map((item, index) => {
                                return <FeedCard data={item} index={index} />
                            })


                    }
                </div>
                {
                    feedData?.length < 1 && !isLoading &&
                    <div className=''>
                        {NoDataFound()}
                    </div>
                }
            </section>
        </Layout>
    )
}

export default FeedDetailPage