import React from 'react'
import { FacebookIcon, FacebookShareButton, TwitterShareButton, WhatsappIcon, WhatsappShareButton, XIcon } from 'react-share';
import { BsLink45Deg } from 'react-icons/bs';
import { translate } from '@/utils/helpers';
import toast from 'react-hot-toast';

const SeoShare = ({ url, title, hashtag }) => {

    const currentUrl = new URL(url);
    const params = new URLSearchParams(currentUrl.search);

    // Remove existing 'share=true' if present
    params.delete('share');

    // Append 'share=true' only once
    params.append('share', 'true');

    // Construct the final URL
    const finalUrl = `${currentUrl.origin}${currentUrl.pathname}?${params.toString()}`;

    // console.log('finalUrl =>',finalUrl); 

    const handleCopyUrl = async (e) => {
        e.preventDefault();
        // Get the current URL from the router
        try {
            // Use the Clipboard API to copy the URL to the clipboard
            await navigator.clipboard.writeText(finalUrl);
            toast.success("URL copied to clipboard!");
        } catch (error) {
            console.error("Error copying to clipboard:", error);
        }
    };

    return (
        <div className='flex items-center gap-4'>
            <span className='textPrimary font-[600] uppercase'>{translate('shareLbl')}  :</span>
            <FacebookShareButton
                url={finalUrl}
                title={title}
                hashtag={hashtag}
            >
                <FacebookIcon size={40} round />
            </FacebookShareButton>
            <WhatsappShareButton
                url={finalUrl}
                title={title}
                hashtag={hashtag}
            >
                <WhatsappIcon size={40} round />
            </WhatsappShareButton>
            <TwitterShareButton
                url={finalUrl}
                title={title}
                hashtag={hashtag}
            >
                <XIcon size={40} round />
            </TwitterShareButton>
            <button onClick={handleCopyUrl} className='primaryBg w-[40px] h-[40px] flexCenter text-white rounded-full'>
                <BsLink45Deg size={30} />
            </button>

        </div>
    )
}

export default SeoShare
