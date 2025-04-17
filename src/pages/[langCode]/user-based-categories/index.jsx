'use client'
import Meta from '@/components/commonComponents/seo/Meta';
import { translate } from '@/utils/helpers.jsx';
import dynamic from 'next/dynamic'

const UserBasedCategories = dynamic(() => import('../../../components/pagesComponent/UserBasedCategories.jsx'), { ssr: false })

const index = () => {

  const webName = process.env.NEXT_PUBLIC_WEB_NAME;

  return (
    <>
      <Meta title={`${webName} | ${translate('userBasedCat')}`} description='' keywords='' ogImage='' pathName='' schema='' />
      <UserBasedCategories />
    </>
  )
}

export default index
