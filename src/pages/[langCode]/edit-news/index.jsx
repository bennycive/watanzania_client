'use client'
import Meta from '@/components/commonComponents/seo/Meta';
import { translate } from '@/utils/helpers.jsx';
import dynamic from 'next/dynamic'
const EditNews = dynamic(() => import('../../../components/pagesComponent/editNews /EditNews.jsx'), { ssr: false })

const index = () => {

  const webName = process.env.NEXT_PUBLIC_WEB_NAME;

  return (
    <>
      <Meta title={`${webName} | ${translate('editNewsLbl')}`} description='' keywords='' ogImage='' pathName='' schema='' />
      <EditNews />
    </>
  )
}

export default index
