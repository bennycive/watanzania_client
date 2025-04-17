import { GET_SETTINGS } from "@/utils/api/api";
import axios from "axios";
import Document, { Html, Head, Main, NextScript } from "next/document";

const CustomDocument = ({ favicon }) => {
  return (
    <Html lang="en" version={process.env.NEXT_PUBLIC_WEB_VERSION} seo={process.env.NEXT_PUBLIC_SEO}>
      <Head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' />
        <link href="https://fonts.googleapis.com/css2?family=Zilla+Slab:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet">
        </link>
        <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet"></link>

        {/* Favicon */}
        {
          process?.env?.NEXT_PUBLIC_SEO === 'true' &&
          <link rel="icon" href={favicon && favicon ? favicon : './favicon.png'} sizes="32x32" type="image/png" />
        }

        {/* Google Tag Manager Script */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_MEASUREMENT_ID}`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${process.env.NEXT_PUBLIC_MEASUREMENT_ID}');
    `,
          }}
        />
        {/* Google Tag Manager Script Ends*/}

        {/* add to any script */}
        <script async src="https://static.addtoany.com/menu/page.js"></script>
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

CustomDocument.getInitialProps = async (ctx) => {
  const initialProps = await Document.getInitialProps(ctx)

  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_END_POINT}/${GET_SETTINGS}`
    )
    const favicon = res.data?.data?.web_setting?.favicon_icon
    return {
      ...initialProps,
      favicon
    }
  } catch (error) {
    console.error('Error fetching favicon:', error)
    return {
      ...initialProps,
      favicon: null
    }
  }
}

export default CustomDocument