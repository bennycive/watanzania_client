'use client'
import Image from 'next/image';
import { FiCalendar } from 'react-icons/fi'
import { BsBookmark } from 'react-icons/bs';
import Link from 'next/link';
import { currentLangCode, formatDate, placeholderImage } from '@/utils/helpers';

const NewsCard = ({ subDropCard, bookmarkCard, element, tagCard, setbookmarkApi, categorySlug, subCateSlug }) => {

  const currLangCode = currentLangCode();

  return (
    <div className={`w-full rounded-lg h-max ${subDropCard ? 'bg-transparent' : 'bg-white dark:secondaryBg'}`} key={element?.title}>
      {/* Image Section */}
      <div className="relative">
        <Link href={{ pathname: `${categorySlug ? `/${currLangCode}/categories-news/${categorySlug}/${element?.slug}` : subCateSlug ? `/${currLangCode}/categories-news/sub-category/${subCateSlug}/${element?.slug}` : ` / ${currLangCode} /news/${element?.slug}`}`, query: { language_id: element?.language_id } }} title='detail-pae'>
          <Image
            src={element?.image}
            alt={element?.title}
            width={0}
            height={0}
            onError={placeholderImage}
            loading='lazy'
            className={`object-cover w-full ${subDropCard ? 'h-[194px]' : 'h-[250px] md:h-[300px]'}  commonRadius transition-all duration-500 hover:-translate-y-2`}
          />
        </Link>
        <div className="absolute top-2 left-2 categoryTag">
          {tagCard ? element?.tag_name : bookmarkCard ? element?.category_name : element?.category?.category_name}
        </div>
      </div>

      {/* Text Section */}
      <div className="p-4 relative text-start">
        {
          bookmarkCard &&
          <span className='secondaryBg text-white flexCenter rounded-full h-[40px] w-[40px] absolute -top-4 right-4 mb-4 border-[4px] border-white cursor-pointer' onClick={(e) => setbookmarkApi(element?.news_id)}><BsBookmark size={18} /></span>
        }
        <Link href={{ pathname: `/${currLangCode}/news/${element?.slug}`, query: { language_id: element?.language_id } }} title='detail-pae'>
          <h4 className={`text-[20px] font-[600] mb-2 line-clamp-2 textPrimary ${bookmarkCard ? 'mt-4' : ''}`}>
            {element?.title}
          </h4>
        </Link>
        {!subDropCard &&
          <Link href={{ pathname: `/${currLangCode}/news/${element?.slug}`, query: { language_id: element?.language_id } }} title='detail-pae'>

            <div className="flex items-center textSecondary">
              <FiCalendar className="mr-2 mt-1" size={18} />
              <span className='textSecondary text-[18px] font-[500]'>
                {formatDate(element?.published_date)}
              </span>
            </div>
          </Link>
        }
      </div>
    </div >
  );
};

export default NewsCard;
