'use client'
import AdSpace from '@/components/commonComponents/adSpace/AdSpace';
import StyleFourCard from './StyleFourCard';
import StylesTitleDiv from '@/components/commonComponents/StylesTitleDiv';
import { currentLangCode } from '@/utils/helpers';

const StyleFour = ({ Data }) => {

  const currLangCode = currentLangCode()

  return (
    Data &&
    <>
      {/* ad spaces */}
      {Data.ad_spaces && Data.id == Data.ad_spaces.ad_featured_section_id ? (
        <div className='container'>
          <AdSpace ad_url={Data.ad_spaces.ad_url} ad_img={Data.ad_spaces.web_ad_image} style_web={'four'} />
        </div>
      ) : null}

      {/* videoSect starts from here  */}
      <>
        {Data.videos && Data.videos?.length > 0 &&
          <div className='styleFour container'>
            <StylesTitleDiv title={Data && Data.title} desc={Data && Data.short_description} link={`/${currLangCode}/view-all/${Data.slug}`} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {
                Data.videos?.map((item, index) => (
                  <div key={index}>
                    <StyleFourCard value={item} videoSect={true} />
                  </div>
                ))

              }
            </div>
          </div>

        }
      </>
      {/* videoSect ends from here  */}


      {/* newsSect starts from here  */}
      <>
        {Data && Data.news?.length > 0 &&
          <div className='styleFour container'>
            <StylesTitleDiv title={Data && Data.title} desc={Data && Data.short_description} link={`/${currLangCode}/view-all/${Data.slug}`} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {
                Data?.news?.map((item, index) => (
                  <div key={index}>
                    <StyleFourCard value={item} />
                  </div>
                ))

              }
            </div>
          </div>

        }
      </>
      {/* newsSect ends from here  */}


      {/* breakingNewsSect starts from here  */}
      <>
        {Data && Data.breaking_news?.length > 0 &&

          <div className='styleFour container'>
            <StylesTitleDiv title={Data && Data.title} desc={Data && Data.short_description} link={`/${currLangCode}/view-all/${Data.slug}`} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {
                Data && Data.breaking_news?.map((item, index) => (
                  <div key={index}>
                    <StyleFourCard value={item} breakingNewsSect={true} />
                  </div>
                ))

              }
            </div>
          </div>

        }
      </>
      {/* breakingNewsSect ends from here  */}

    </>
  )
}

export default StyleFour