'use client'
import AdSpace from '@/components/commonComponents/adSpace/AdSpace'
import StylesTitleDiv from '@/components/commonComponents/StylesTitleDiv'
import React from 'react'
import StyleTwoCard from './StyleTwoCard'
import { currentLangCode } from '@/utils/helpers'

const StyleTwo = ({ Data }) => {

  const currLangCode = currentLangCode();

  return (
    Data &&
    <>
      {/* videoNewsSect starts from here   */}

      {Data && Data.ad_spaces && Data.id == Data.ad_spaces.ad_featured_section_id ? (
        <div className='container'>
          <AdSpace ad_url={Data.ad_spaces.ad_url} ad_img={Data.ad_spaces.web_ad_image} style_web={'two'} />
        </div>
      ) : null}

      {Data && Data?.videos?.length > 0 &&
        <div className='styleTwo container'>
          <section className=''>
            <StylesTitleDiv title={Data && Data.title} desc={Data && Data.short_description} link={`/${currLangCode}/view-all/${Data.slug}`} />

            <div className="grid lg:grid-cols-8 gap-5">
              <div className='grid lg:grid-cols-1 gap-5 lg:col-span-2'>
                <>
                  {
                    Data?.videos[0] &&
                    <StyleTwoCard Data={Data?.videos[0]} videosNewsCard={true} />
                  }
                  {
                    Data?.videos[1] &&
                    <StyleTwoCard Data={Data?.videos[1]} videosNewsCard={true} />
                  }
                </>
              </div>
              <div className='lg:col-span-4'>
                {
                  Data?.videos[2] &&
                  <StyleTwoCard Data={Data?.videos[2]} middleCard={true} videosNewsCard={true} />
                }
              </div>
              <div className='grid lg:grid-cols-1 gap-5 lg:col-span-2'>
                <>
                  {
                    Data?.videos[3] &&
                    <StyleTwoCard Data={Data?.videos[3]} videosNewsCard={true} />
                  }
                  {
                    Data?.videos[4] &&
                    <StyleTwoCard Data={Data?.videos[4]} videosNewsCard={true} />
                  }
                </>
              </div>
            </div>

          </section>
        </div>}
      {/* videoNewsSect ends from here   */}



      {/* newsSect starts from here   */}
      {Data && Data?.news?.length > 0 &&
        <div className='styleTwo container'>
          <section className=''>
            <StylesTitleDiv title={Data && Data.title} desc={Data && Data.short_description} link={`/${currLangCode}/view-all/${Data.slug}`} />

            <div className="grid lg:grid-cols-8 gap-5">
              <div className='grid lg:grid-cols-1 gap-5 lg:col-span-2'>
                <>
                  {
                    Data?.news[0] &&
                    <StyleTwoCard Data={Data?.news[0]} />
                  }
                  {
                    Data?.news[1] &&
                    <StyleTwoCard Data={Data?.news[1]} />
                  }
                </>
              </div>
              <div className='lg:col-span-4'>
                {
                  Data?.news[2] &&
                  <StyleTwoCard Data={Data?.news[2]} middleCard={true} />
                }
              </div>
              <div className='grid lg:grid-cols-1 gap-5 lg:col-span-2'>
                <>
                  {
                    Data?.news[3] &&
                    <StyleTwoCard Data={Data?.news[3]} />
                  }
                  {
                    Data?.news[4] &&
                    <StyleTwoCard Data={Data?.news[4]} />
                  }
                </>
              </div>
            </div>

          </section>
        </div>}
      {/* newsSect ends from here   */}


      {/* breakingNewsSect starts from here   */}
      {Data && Data.breaking_news?.length > 0 &&
        <div className='styleTwo container'>

          <section className=''>
            <StylesTitleDiv title={Data && Data.title} desc={Data && Data.short_description} link={`/${currLangCode}/view-all/${Data.slug}`} />

            <div className="grid lg:grid-cols-8 gap-5">
              <div className='grid lg:grid-cols-1 gap-5 lg:col-span-2'>
                <>
                  <StyleTwoCard Data={Data.breaking_news[0]} breakingNewsCard={true} />
                  <StyleTwoCard Data={Data.breaking_news[1]} breakingNewsCard={true} />
                </>
              </div>
              <div className='lg:col-span-4'>
                <StyleTwoCard Data={Data.breaking_news[2]} middleCard={true} breakingNewsCard={true} />
              </div>
              <div className='grid lg:grid-cols-1 gap-5 lg:col-span-2'>
                <>
                  <StyleTwoCard Data={Data.breaking_news[3]} breakingNewsCard={true} />
                  <StyleTwoCard Data={Data.breaking_news[4]} breakingNewsCard={true} />
                </>
              </div>
            </div>

          </section>
        </div>}
      {/* breakingNewsSect ends from here   */}

    </>
  )
}

export default StyleTwo