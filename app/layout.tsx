import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

// ⚠️ غيّر ده لدومين الموقع الفعلي
const SITE_URL = "https://grandeur-spaces.com";
// ⚠️ حط الـ Google Ads ID وبتوع التحويلات بتاعة الحساب اللي هتشغّل منه
const ADS_ID = "AW-XXXXXXXXXX";
const CONV_FORM = `${ADS_ID}/XXXXXXXXXXXXXXXXXXX`;
const CONV_WA = `${ADS_ID}/XXXXXXXXXXXXXXXXXXX`;
const CONV_CALL = `${ADS_ID}/XXXXXXXXXXXXXXXXXXX`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "هاسيندا رأس الحكمة بالم هيلز | أسعار وتقسيط 10 سنوات",
  description:
    "هاسيندا رأس الحكمة من بالم هيلز عند الكيلو 238 على الساحل الشمالي - 1,400 فدان و4.8 كم بيتش فرونت. أسعار استرشادية تبدأ من 11.7 مليون جنيه، 5% مقدم وتقسيط حتى 10 سنوات. موقع وكيل مبيعات معتمد - لسنا الشركة المطوّرة.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "هاسيندا رأس الحكمة بالم هيلز - الكيلو 238 الساحل الشمالي",
    description:
      "مشروع ساحلي من بالم هيلز على 1,400 فدان مع 4.8 كم بيتش فرونت. أسعار استرشادية من 11.7 مليون جنيه - تقسيط حتى 10 سنوات. عرض من وكيل مبيعات معتمد.",
    url: SITE_URL,
    siteName: "Grandeur Spaces",
    locale: "ar_EG",
    type: "website",
  },
};

const JSONLD = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Grandeur Spaces",
  alternateName: "جراندير سبيسز",
  url: SITE_URL,
  telephone: "+201001050018",
  email: "apkzoz85@gmail.com",
  address: { "@type": "PostalAddress", addressLocality: "القاهرة", addressCountry: "EG" },
  description:
    "وكيل مبيعات عقاري معتمد في مصر. لسنا شركة Palm Hills Developments ولا تابعين لها.",
  areaServed: "EG",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
        />
      </head>
      <body>
        {children}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`} strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('consent','default',{
            ad_storage:'denied', ad_user_data:'denied',
            ad_personalization:'denied', analytics_storage:'denied'
          });
          try { if (localStorage.getItem('cookie_ok')) {
            gtag('consent','update',{
              ad_storage:'granted', ad_user_data:'granted',
              ad_personalization:'granted', analytics_storage:'granted'
            });
          } } catch(e) {}
          gtag('config','${ADS_ID}');

          function trackFormLead(){ gtag('event','conversion',{'send_to':'${CONV_FORM}'}); }
          function trackWhatsapp(){ gtag('event','conversion',{'send_to':'${CONV_WA}'}); }
          function trackCall(){ gtag('event','conversion',{'send_to':'${CONV_CALL}'}); }
        `}</Script>
      </body>
    </html>
  );
}
