import { store } from "@/components/store/store";
import "@/styles/globals.css";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import PushNotificationLayout from "@/components/firebaseNotification/PushNotification";
import { Router } from 'next/router'
import NProgress from 'nprogress'

// CSS File Here
import 'nprogress/nprogress.css'
import 'react-loading-skeleton/dist/skeleton.css'

export default function App({ Component, pageProps }) {

  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })

  return <main>
    <Provider store={store}>
      <Toaster position='top-center' containerClassName='toast-custom' />
      <PushNotificationLayout>
        <Component {...pageProps} />
      </PushNotificationLayout>
    </Provider>
  </main>
}
