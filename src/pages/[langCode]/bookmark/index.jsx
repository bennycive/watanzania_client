import Meta from '@/components/commonComponents/seo/Meta';
import { translate } from '@/utils/helpers';
import dynamic from 'next/dynamic'
const Bookmark = dynamic(() => import('@/components/pagesComponent/Bookmark'), { ssr: false })

const index = () => {

  const webName = process.env.NEXT_PUBLIC_WEB_NAME;

  return (
    <>
      <Meta title={`${webName} | ${translate('bookmark')}`} description='' keywords='' ogImage='' pathName='' schema='' />
      <Bookmark />
    </>
  )
}

export default index
