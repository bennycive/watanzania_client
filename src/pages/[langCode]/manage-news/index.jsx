'use client'
import Meta from '@/components/commonComponents/seo/Meta';
import { translate } from '@/utils/helpers.jsx';
import dynamic from 'next/dynamic'
const ManageNews = dynamic(() => import('../../../components/pagesComponent/ManageNews.jsx'), { ssr: false })

const index = () => {

  const webName = process.env.NEXT_PUBLIC_WEB_NAME;

  return (
    <>
      <Meta title={`${webName} | ${translate('manageNewsLbl')}`} description='' keywords='' ogImage='' pathName='' schema='' />
      <ManageNews />
    </>
  )
}

export default index
