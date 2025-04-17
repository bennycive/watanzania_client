'use client'
import Meta from '@/components/commonComponents/seo/Meta';
import { translate } from '@/utils/helpers.jsx';
import dynamic from 'next/dynamic'

const ProfileUpdate = dynamic(() => import('../../../components/pagesComponent/ProfileUpdate.jsx'), { ssr: false })

const index = () => {

  const webName = process.env.NEXT_PUBLIC_WEB_NAME;

  return (
    <>
      <Meta title={`${webName} | ${translate('update-profile')}`} description='' keywords='' ogImage='' pathName='' schema='' />
      <ProfileUpdate />
    </>
  )
}

export default index
