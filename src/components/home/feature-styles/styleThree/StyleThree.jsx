'use client'
import AdSpace from '@/components/commonComponents/adSpace/AdSpace'
import StylesTitleDiv from '@/components/commonComponents/StylesTitleDiv'
import StyleThreeCardTwo from './styleThreeCardTwo'
import StyleThreeCardOne from './StyleThreeCardOne.jsx'
import { currentLangCode } from '@/utils/helpers'

const StyleThree = ({ Data }) => {

  const currLangCode = currentLangCode();

  return (
    Data &&
    <>

      {/* ad spaces */}
      {Data.ad_spaces && Data.id == Data.ad_spaces.ad_featured_section_id ? (
        <div className='container'>
          <AdSpace ad_url={Data.ad_spaces.ad_url} ad_img={Data.ad_spaces.web_ad_image} style_web={'three'} />
        </div>
      ) : null}

      {/* videoNewsSect starts from here  */}
      {Data && Data.videos?.length > 0 && <section className='styleThree container'>

        <StylesTitleDiv title={Data && Data.title} desc={Data && Data.short_description} link={`/${currLangCode}/view-all/${Data.slug}`} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          <div className="relative col-span-6">
            <StyleThreeCardOne Data={Data?.videos[0]} videoNewsCard={true} />
          </div>

          <div className="col-span-6 flex flex-col gap-5">
            <>
              <StyleThreeCardTwo Data={Data?.videos[1]} sideCards={true} videoNewsCard={true} />
              <StyleThreeCardTwo Data={Data?.videos[2]} sideCards={true} videoNewsCard={true} />
            </>

          </div>
        </div>
      </section>
      }
      {/* videoNewsSect ends  here  */}


      {/* newsSect starts from here  */}
      {Data && Data.news?.length > 0 && <section className='styleThree container'>
        <StylesTitleDiv title={Data && Data.title} desc={Data && Data.short_description} link={`/${currLangCode}/view-all/${Data.slug}`} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          <div className="relative col-span-6">
            <StyleThreeCardOne Data={Data?.news[0]} />
          </div>

          <div className="col-span-6 flex flex-col gap-5">
            <>
              <StyleThreeCardTwo Data={Data?.news[1]} sideCards={true} />
              <StyleThreeCardTwo Data={Data?.news[2]} sideCards={true} />
            </>

          </div>
        </div>
      </section>
      }
      {/* newsSect ends  here  */}

      {/* breakingNewsSect starts from here  */}
      {Data && Data.breaking_news?.length > 0 && <section className='styleThree container'>
        <StylesTitleDiv title={Data && Data.title} desc={Data && Data.short_description} link={`/${currLangCode}/view-all/${Data.slug}`} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          <div className="relative col-span-6">
            <StyleThreeCardOne Data={Data?.breaking_news[0]} breakingNewsCard={true} />
          </div>

          <div className="col-span-6 flex flex-col gap-5">
            <>
              <StyleThreeCardTwo Data={Data?.breaking_news[1]} sideCards={true} breakingNewsCard={true} />
              <StyleThreeCardTwo Data={Data?.breaking_news[2]} sideCards={true} breakingNewsCard={true} />
            </>

          </div>
        </div>
      </section>
      }
      {/* breakingNewsSect ends  here  */}

    </>
  )
}

export default StyleThree