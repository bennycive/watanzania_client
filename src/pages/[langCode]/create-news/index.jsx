'use client'
import Meta from '@/components/commonComponents/seo/Meta';
import { translate } from '@/utils/helpers.jsx';
import dynamic from 'next/dynamic'
const CreateNews = dynamic(() => import('../../../components/pagesComponent/createNews/CreateNews.jsx'), { ssr: false })

const index = () => {

  const webName = process.env.NEXT_PUBLIC_WEB_NAME;

  return (
    <>
      <Meta title={`${webName} | ${translate('createNewsLbl')}`} description='' keywords='' ogImage='' pathName='' schema='' />
      <CreateNews />
    </>
  )
}

export default index
