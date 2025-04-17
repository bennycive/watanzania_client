import React from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
} from "@/components/ui/drawer"
import { translate } from '@/utils/helpers'
import { useSelector } from 'react-redux'
import { settingsSelector } from '../store/reducers/settingsReducer'
import { usePathname } from 'next/navigation'
import { MdOutlineClose } from "react-icons/md";

const OpenInAppPopUp = ({ IsOpenInApp,OnHide }) => {

  const systemSettingsData = useSelector(settingsSelector);

  const path = usePathname();

  const companyName = systemSettingsData?.data?.web_setting?.web_name;

  function openInApp() {
        var sanitizedCompanyName = companyName.trim().toLowerCase().replace(/\s+/g, '-');
        var appScheme = `${'news'}://${window.location.hostname}${path}`;
        var androidAppStoreLink = systemSettingsData?.data?.web_setting?.android_app_link;
        var iosAppStoreLink = systemSettingsData?.data?.web_setting?.ios_app_link;
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        var isAndroid = /android/i.test(userAgent);
        var isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
        var appStoreLink = isAndroid ? androidAppStoreLink : (isIOS ? iosAppStoreLink : androidAppStoreLink);

        // For iOS, we need a different approach
        if (isIOS) {
            // Set a flag in sessionStorage
            sessionStorage.setItem('appRedirectAttempt', Date.now().toString());

            // Attempt to open the app
            window.location.href = appScheme;

            // Check if we redirected successfully by seeing if this code runs after a delay
            setTimeout(function () {
                const redirectAttempt = sessionStorage.getItem('appRedirectAttempt');
                const now = Date.now();
                // If less than 2 seconds passed, app didn't open
                if (redirectAttempt && (now - parseInt(redirectAttempt)) < 2000) {
                    if (confirm(`${companyName} app is not installed. Would you like to download it from the app store?`)) {
                        window.location.href = iosAppStoreLink;
                    }
                }
                // Clear the flag
                sessionStorage.removeItem('appRedirectAttempt');
            }, 2000);
        } else {
            // Android handling (your existing code)
            window.location.href = appScheme;
            setTimeout(function () {
                if (document.hidden || document.webkitHidden) {
                    // App opened successfully
                } else {
                    // App is not installed
                    if (confirm(`${companyName} app is not installed. Would you like to download it from the app store?`)) {
                        window.location.href = appStoreLink;
                    }
                }
            }, 1000);
        }
    }

  return (
    <div className='openInAppPopUp'>
      <Drawer open={IsOpenInApp} onOpenChange={OnHide}>
        <DrawerContent >
          <div className='flex items-center justify-between py-4 px-6'>
            <div className='flex items-center gap-3'>
              <DrawerClose>
                <MdOutlineClose size={22} color='gray' />
              </DrawerClose>
              <div>
                <h6 className='font-[600]'>{`${translate('viewIn')} ${companyName} ${translate('app')}`}</h6>
              </div>
            </div>
            <div>
              <button className='commonBtn' onClick={openInApp}>{translate('open')}</button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default OpenInAppPopUp