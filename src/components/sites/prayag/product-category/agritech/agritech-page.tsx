import { PcatPage } from "../pcat-page";
import { SlickCarousel, type SlickSettings } from "../slick-carousel";
import { SplitRevealSection } from "../split-reveal";
import { TabGroup } from "../hdpe/tab-group";
import "./agritech.css";

// Slick settings verbatim from the page's inline scripts. The first script initialises every
// .js-cfs-slider (FITTINGS_SLICK) and .ngp-features-slider (NGP_SLICK, ahead of the theme's Drupal
// behavior); the second then re-initialises only the visible #pane-nylon slider with its own
// options (NYLON_SLICK: 2 slides below 1200px, dots instead of arrows below 768px).
const NGP_SLICK: SlickSettings = {
  infinite: true,
  swipe: true,
  adaptiveHeight: false,
  arrows: true,
  dots: false,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 1 } },
    { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
};

const FITTINGS_SLICK: SlickSettings = {
  infinite: true,
  swipe: true,
  adaptiveHeight: true,
  arrows: true,
  dots: false,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
};

const NYLON_SLICK: SlickSettings = {
  slidesToShow: 3,
  slidesToScroll: 1,
  infinite: true,
  arrows: true,
  dots: false,
  responsive: [
    { breakpoint: 1200, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1, dots: true, arrows: false } },
  ],
};

/** https://prayagindia.com/agritech (taxonomy term 219), content between the header and the footer. */
export function AgritechPage() {
  return (
    <PcatPage slug="agritech">
      <div className="breadcrumb_main">
        <div className="container-fluid p-0">
          <div className="row">
            <div className="col-md-6">
              {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
              <img src="/sites/prayag/files/2026-09/hero-section.webp" sizes="(max-width: 300px) 300px, (max-width: 600px) 600px, (max-width: 1200px) 1200px, 2000px" alt="Agritech" width="800" height="450" className="img-fluid" decoding="async" fetchPriority="high" />
            </div>
            <div className="col-md-6">
              <div className="breadcrumb_title">
                <h1 className="black_title">Agritec</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="prayag-section overflow-hidden">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-12 col-md-7">
              <div className="prayag-content-box">
                <h2>Agritec Pipes</h2>
                <p className="prayag-subtitle">for Reliable Agricultural Water Flow</p>
                <p>
                  Prayag Agritec Pipes offer a dependable piping solution for irrigation and water distribution applications. Designed as part of an integrated range of agricultural pipes and fittings, the Agritec range is available across multiple pressure classes and sizes to support different agricultural water-flow requirements.
                </p>
              </div>
            </div>
            <div className="col-12 col-md-5 p-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
              <img src="/sites/prayag/files/2026-09/2nd-section.webp" alt="" />
            </div>
          </div>
        </div>
      </section>
      <section className="ngp-section" style={{ background: "#1a1a1a", padding: "60px 0" }}>
        <div className="container-fluid">
          <h2 className="text-center" style={{ color: "#fff" }}>Why Choose <strong>Prayag Agritec</strong> Pipes?</h2>
          <SlickCarousel className="ngp-features-slider" style={{ color: "#fff" }} settings={NGP_SLICK} aria-label="Why Choose Prayag Agritec Pipes?">
            <div className="ngp-feature-item">
              <div className="ngp-icon-circle">
                <svg width="120" height="120" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_18_3)">
                    <path fillRule="evenodd" clipRule="evenodd" d="M334.582 231.411C334.582 228.491 332.201 226.118 329.267 226.118H70.3151C67.3808 226.118 65 228.491 65 231.411V348.708C65 351.629 67.3806 354 70.3151 354H329.267C332.201 354 334.582 351.629 334.582 348.708V231.411ZM323.952 236.705V343.414H75.6271V236.705H323.952ZM112.737 180.703C107.317 175.452 99.6742 168.054 99.6742 168.054C97.5802 166.01 94.2096 166.053 92.1599 168.149C90.1187 170.244 90.1609 173.599 92.2654 175.632L114.311 196.996C116.373 198.996 119.658 198.996 121.72 196.996L143.987 175.42C146.092 173.379 146.136 170.032 144.095 167.936C142.043 165.84 138.684 165.798 136.58 167.831L123.368 180.64L123.463 52.2935C123.463 49.3711 121.082 47 118.148 47C115.215 47 112.832 49.3709 112.832 52.2828L112.737 180.703ZM276.067 180.703C270.646 175.452 263.004 168.054 263.004 168.054C260.899 166.01 257.541 166.053 255.489 168.149C253.448 170.244 253.49 173.599 255.595 175.632L277.64 196.996C279.703 198.996 282.987 198.996 285.049 196.996L307.319 175.42C309.423 173.379 309.465 170.032 307.424 167.936C305.374 165.84 302.004 165.798 299.91 167.831L286.697 180.64L286.783 52.2935C286.794 49.3711 284.412 47 281.479 47C278.545 47 276.164 49.3709 276.154 52.2828L276.067 180.703ZM194.402 180.703C188.982 175.452 181.339 168.054 181.339 168.054C179.234 166.01 175.876 166.053 173.825 168.149C171.783 170.244 171.826 173.599 173.93 175.632L195.976 196.996C198.038 198.996 201.322 198.996 203.385 196.996L225.654 175.42C227.758 173.379 227.801 170.032 225.759 167.936C223.708 165.84 220.339 165.798 218.245 167.831L205.033 180.64L205.128 52.2935C205.128 49.3711 202.747 47 199.814 47C196.88 47 194.499 49.3709 194.499 52.2828L194.402 180.703Z" fill="white" />
                  </g>
                  <defs>
                    <clipPath id="clip0_18_3">
                      <rect width="400" height="400" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <span className="ngp-feature-label">Multiple Pressure Classes</span>
              <p className="ngp_para">Available in PN-4, PN-6 and PN-10 configurations to suit different system requirements.</p>
            </div>
            <div className="ngp-feature-item">
              <div className="ngp-icon-circle">
                <svg width="120" height="120" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_18_10)">
                    <path d="M349.449 52.3369C349.069 51.3962 348.322 50.6467 347.385 50.2645C347.312 50.2205 347.239 50.2205 347.166 50.2205C346.815 50.1176 346.405 50 345.995 50H53.7143C51.6505 50 49.9672 51.6902 49.9672 53.7625V347.12C49.9233 348.134 50.2599 349.119 51.0503 349.898C51.7969 350.618 52.7336 351 53.7143 351C53.7583 351 53.7875 350.956 53.8314 350.956H345.996C348.06 350.956 349.744 349.266 349.744 347.193V53.7639C349.744 53.3523 349.626 52.9408 349.524 52.5587C349.48 52.4852 349.48 52.4117 349.451 52.3382L349.449 52.3369ZM342.248 343.427H62.7889L134.029 271.896V325.129C134.029 327.202 135.712 328.892 137.776 328.892C139.84 328.892 141.524 327.202 141.524 325.129L141.509 262.917C141.509 262.388 141.436 261.858 141.216 261.373C141.099 261.109 140.923 260.918 140.762 260.697C140.645 260.55 140.572 260.359 140.426 260.212C139.752 259.536 138.816 259.081 137.762 259.081H75.6709C73.607 259.081 71.9237 260.771 71.9237 262.843C71.9237 264.915 73.607 266.606 75.6709 266.606H128.775L57.4627 338.124V57.5246H336.922L265.625 129.128V75.8071C265.625 73.7348 263.942 72.0446 261.878 72.0446C259.814 72.0446 258.131 73.7348 258.131 75.8071V138.151C258.131 139.21 258.541 140.15 259.258 140.826C259.404 140.973 259.594 141.047 259.741 141.164C259.96 141.311 260.151 141.502 260.414 141.62C260.868 141.811 261.395 141.914 261.878 141.914H323.925C325.989 141.914 327.672 140.224 327.672 138.151C327.672 136.079 325.989 134.389 323.925 134.389H270.98L342.252 62.8265L342.248 343.427Z" fill="white" />
                  </g>
                  <defs>
                    <clipPath id="clip0_18_10">
                      <rect width="400" height="400" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <span className="ngp-feature-label">Multiple Pipe Sizes</span>
              <p className="ngp_para">The Agritec Pipe range includes sizes from 90 mm to 160 mm in the listed pipe range.</p>
            </div>
            <div className="ngp-feature-item">
              <div className="ngp-icon-circle">
                <svg width="120" height="120" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_18_46)">
                    <path d="M352.811 183.042H318.759C312.517 183.042 307.409 188.129 307.409 194.346V199.998H256.334V126.522H262.009C268.252 126.522 273.36 121.435 273.36 115.218V81.3045C273.36 75.087 268.252 70 262.009 70H137.153C130.91 70 125.802 75.087 125.802 81.3045V115.218C125.802 121.435 130.91 126.522 137.153 126.522H142.828V199.998H91.7531V194.346C91.7531 188.129 86.6453 183.042 80.4025 183.042H46.3506C40.1078 183.042 35 188.129 35 194.346V318.696C35 324.913 40.1078 330 46.3506 330H80.4025C86.6453 330 91.7531 324.913 91.7531 318.696V313.043H307.415V318.696C307.415 324.913 312.523 330 318.766 330H352.817C359.06 330 364.168 324.913 364.168 318.696V194.346C364.168 188.129 359.06 183.042 352.817 183.042H352.811ZM137.15 81.3015H262.006V115.215H137.15V81.3015ZM244.983 126.519V203.333C227.731 221.137 205.995 222.607 199.581 222.607C175.802 222.607 160.081 209.381 154.178 203.389V126.519L244.983 126.519ZM80.4025 318.696H46.3506V194.346H80.4025V318.696ZM91.7531 301.739V211.303H146.067C153.104 218.425 171.605 233.912 199.584 233.912C207.132 233.912 232.728 232.216 253.047 211.303H307.418V301.739H91.7531ZM352.817 318.696H318.766V194.346H352.817V318.696Z" fill="white" />
                  </g>
                  <defs>
                    <clipPath id="clip0_18_46">
                      <rect width="400" height="400" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <span className="ngp-feature-label">Complete Fittings Range</span>
              <p className="ngp_para">A dedicated range of agricultural fittings helps create a complete piping system.</p>
            </div>
            <div className="ngp-feature-item">
              <div className="ngp-icon-circle">
                <svg width="120" height="120" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_18_7)">
                    <path d="M221.996 195.868C211.819 149.81 106.069 149.863 95.8591 195.725C95.4345 197.534 95.2292 199.361 95.2292 201.308C95.2292 225.77 95.2511 231.513 95.2696 232.895C95.1403 232.893 95.2776 360.385 95.2292 360.461C95.2292 363.52 97.7084 365.999 100.767 365.999C103.825 365.999 106.304 363.52 106.304 360.461V254.579C133.84 277.887 183.932 277.865 211.519 254.639V360.462C211.519 363.521 213.999 366 217.057 366C220.115 366 222.595 363.521 222.595 360.462C222.545 360.221 222.689 233.058 222.545 232.858C222.574 231.039 222.595 224.808 222.595 201.309C222.595 199.362 222.389 197.535 221.997 195.869L221.996 195.868ZM201.324 218.265C176.777 235.321 134.524 235.348 112.144 214.368C134.45 192.653 183.356 192.64 205.678 214.367C204.385 215.761 202.944 217.031 201.325 218.265L201.324 218.265ZM106.674 198.113C115.317 163.874 202.627 163.877 211.18 198.256C211.622 200.124 211.625 202.251 211.223 204.179C183.284 181.238 134.543 181.234 106.598 204.179C106.185 202.143 106.195 200.16 106.673 198.113L106.674 198.113ZM106.615 234.605C106.46 234.002 106.377 233.438 106.347 232.826C106.347 232.825 106.346 232.825 106.346 232.824C106.334 232.246 106.325 228.865 106.317 224.216C134.597 247.595 183.242 247.592 211.506 224.208C211.5 228.919 211.49 232.348 211.476 232.826C211.446 233.438 211.363 234.003 211.148 234.854C202.482 269.105 115.148 269.123 106.615 234.605L106.615 234.605Z" fill="white" />
                    <path d="M338.898 77.4972C338.898 75.3526 338.654 73.3521 338.19 71.5293C326.371 21.4839 201.979 21.5489 190.13 71.3724C189.627 73.3521 189.383 75.3527 189.383 77.4972C189.383 104.358 189.411 110.744 189.432 112.306C189.285 112.426 189.436 155.384 189.383 155.567C189.383 158.625 191.862 161.104 194.921 161.104C197.979 161.104 200.458 158.625 200.458 155.566V134.184C231.971 161.823 296.237 161.803 327.824 134.257V277.393C327.824 280.452 330.303 282.931 333.362 282.931C336.42 282.931 338.899 280.452 338.899 277.393C338.842 277.11 339.011 112.502 338.842 112.263C338.874 110.261 338.899 103.384 338.899 77.4984L338.898 77.4972ZM319.009 93.7457C291.141 116.103 233.995 116.253 207.261 91.841C233.982 67.2043 294.274 67.1892 321.02 91.8387C320.378 92.5043 319.715 93.1308 319.01 93.7457H319.009ZM200.902 73.9416C211.575 35.4499 316.85 35.4499 327.42 74.0985C328.099 76.707 327.888 79.658 327.053 82.2549C294.935 55.5695 233.368 55.5589 201.232 82.2549C200.375 79.538 200.179 76.7299 200.902 73.9416ZM200.834 114.247C200.652 113.586 200.547 112.935 200.509 112.257C200.49 111.525 200.48 106.87 200.472 100.749C232.814 128.415 295.465 128.409 327.811 100.746C327.802 106.954 327.792 111.665 327.776 112.246C327.738 112.928 327.633 113.582 327.381 114.514C316.686 153.015 211.381 153.041 200.834 114.247Z" fill="white" />
                    <path d="M305.657 183.256C302.599 183.256 300.12 185.735 300.12 188.793V305.084C300.12 308.142 302.599 310.621 305.657 310.621C308.716 310.621 311.195 308.142 311.195 305.084V188.793C311.195 185.735 308.716 183.256 305.657 183.256Z" fill="white" />
                    <path d="M67.5392 83.0272H150.604C153.662 83.0272 156.141 80.548 156.141 77.4896C156.141 74.4312 153.662 71.9519 150.604 71.9519H83.6441L98.635 60.2606C104.314 55.7856 97.5632 47.0973 91.8215 51.5274L64.1333 73.123C60.0009 76.1319 62.4213 83.1991 67.5389 83.0272H67.5392Z" fill="white" />
                    <path d="M119.507 123.512C113.809 127.993 120.61 136.676 126.321 132.245L154.009 110.65C158.134 107.639 155.724 100.573 150.602 100.745H67.5376C64.4794 100.745 62 103.225 62 106.283C62 109.341 64.4792 111.821 67.5376 111.821H134.497L119.507 123.512Z" fill="white" />
                  </g>
                  <defs>
                    <clipPath id="clip0_18_7">
                      <rect width="400" height="400" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <span className="ngp-feature-label">Multiple Fitting Sizes</span>
              <p className="ngp_para">
                Agriculture fittings are available across a broad size range, extending from 63 mm to 200 mm in several fitting categories.
              </p>
            </div>
          </SlickCarousel>
        </div>
      </section>
      <section className="main_filled_scrolled_sec">
        <div className="msf-track">
          <div className="msf-stage">
            <div className="msf-slide-wrap">
              <div className="msf-image-wrap">
                <picture>
                  <source media="(max-width: 767px)" srcSet="/sites/prayag/theme/agritec/mobile-banner-agri.webp" type="image/webp" />
                  <source media="(min-width: 768px)" srcSet="/sites/prayag/files/2026-09/agritech-banner.webp" type="image/webp" />
                  <img className="msf-image" src="/sites/prayag/files/2026-09/agritech-banner.webp" alt="Smarter Water Distribution. Stronger Agricultural Systems." />
                </picture>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <a href="#agri-advantage-details" className="prayag-btn">
            <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.2308 5.99866C21.2211 5.78469 21.1301 5.53538 20.9771 5.37908L15.9807 0.279282C15.6418 -0.0128267 14.993 -0.133765 14.6154 0.204859C14.2436 0.537901 14.2533 1.18352 14.6251 1.51656L18.1381 5.09813H0.937304C0.420215 5.09813 0 5.50188 0 5.99864C0 6.49542 0.420245 6.89914 0.937304 6.89914H18.1381L14.6251 10.4807C14.3055 10.7877 14.2455 11.4557 14.6154 11.7924C14.9834 12.1292 15.6573 12.0213 15.9807 11.718L20.9771 6.61819C21.1475 6.4433 21.2308 6.23868 21.2308 5.99866Z" fill="black" />
            </svg>
            {" "}
            View Product Range
          </a>
        </div>
      </section>
      <SplitRevealSection id="agri-advantage-details">
        <div className="psr-container">
          <div className="psr-image-col">
            <div className="psr-image-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
              <img className="psr-image" src="/sites/prayag/files/2026-09/What-is-Prayag-Agritec-Pipe.webp" alt="What is Prayag Agritec Pipe" />
            </div>
          </div>
          <div className="psr-content-col">
            <div className="psr-content">
              <span className="psr-eyebrow">Agricultural Piping Solutions for Water Distribution</span>
              <h2>What is Prayag Agritec Pipe?</h2>
              <p className="psr-description">Prayag Agritec Pipe is an agricultural piping solution designed for water distribution systems.</p>
              <p className="psr-description">
                The range includes different pressure classifications and pipe sizes, along with a corresponding range of agricultural fittings for creating practical and adaptable piping networks. Agritec Pipes are available in PN-4, PN-6 and PN-10 variants. The listed pipe sizes range from 90 mm to 160 mm, with individual configurations varying by pressure class. The range is supported by agricultural fittings including couplers, equal tees, 90° elbows, end caps and other connection/reduction fittings, depending on the pressure class and fitting series.
              </p>
              <a href="#agri-fittings-heading" className="prayag-btn">
                <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.2308 5.99866C21.2211 5.78469 21.1301 5.53538 20.9771 5.37908L15.9807 0.279282C15.6418 -0.0128267 14.993 -0.133765 14.6154 0.204859C14.2436 0.537901 14.2533 1.18352 14.6251 1.51656L18.1381 5.09813H0.937304C0.420215 5.09813 0 5.50188 0 5.99864C0 6.49542 0.420245 6.89914 0.937304 6.89914H18.1381L14.6251 10.4807C14.3055 10.7877 14.2455 11.4557 14.6154 11.7924C14.9834 12.1292 15.6573 12.0213 15.9807 11.718L20.9771 6.61819C21.1475 6.4433 21.2308 6.23868 21.2308 5.99866Z" fill="black" />
                </svg>
                {" "}
                Know More
              </a>
            </div>
          </div>
        </div>
      </SplitRevealSection>
      <section className="ka-applications pt-0">
        <div className="container-fluid">
          <p className="ka-eyebrow">Where our pipes work</p>
          <h2 className="ka-title">Applications</h2>
          <p className="ka-intro">Prayag Agritec Pipes are built for dependable water distribution across agricultural and farm settings.</p>
          <div className="ka-grid ka-grid--single-row" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
            <div className="ka-card">
              <div className="ka-image">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img src="/sites/prayag/files/2026-09/Agricultural-Irrigation.webp" alt="" />
              </div>
              <div className="ka-card-body">
                <h3>Agricultural Irrigation</h3>
              </div>
            </div>
            <div className="ka-card">
              <div className="ka-image">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img src="/sites/prayag/files/2026-09/Farm-Water-Distribution.webp" alt="Farm Water Distribution" />
              </div>
              <div className="ka-card-body">
                <h3>Farm Water Distribution</h3>
              </div>
            </div>
            <div className="ka-card">
              <div className="ka-image">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img src="/sites/prayag/files/2026-09/Agricultural-Water-Supply-Networks.webp" alt="" />
              </div>
              <div className="ka-card-body">
                <h3>Agricultural Water Supply Networks</h3>
              </div>
            </div>
            <div className="ka-card">
              <div className="ka-image">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img src="/sites/prayag/files/2026-09/field-water-distribution.webp" alt="" />
              </div>
              <div className="ka-card-body">
                <h3>Field Water Distribution</h3>
              </div>
            </div>
            <div className="ka-card">
              <div className="ka-image">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img src="/sites/prayag/files/2026-09/Irrigation-Pipeline-Systems.webp" alt="" />
              </div>
              <div className="ka-card-body">
                <h3>Irrigation Pipeline Systems</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="prayag-work-section">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12 p-0">
              <div className="visual-wrapper">
                {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                <img src="/sites/prayag/files/2026-09/Features-Benefits.webp" alt="Prayag Agritec Pipe features and benefits" className="img-fluid main-img" />
              </div>
            </div>
            <div className="col-lg-6 col-md-12 p-0">
              <div className="prayag_work_content">
                <h2>Features &amp; Benefits</h2>
                <ul className="advantages_list">
                  <li>
                    <strong>Multiple Pressure Options</strong>
                    {" "}
                    — Choose from PN-4, PN-6 and PN-10 pipe configurations according to system requirements.
                  </li>
                  <li><strong>Wide Size Availability</strong> — The listed Agritec Pipe range covers 90 mm, 110 mm and 160 mm sizes.</li>
                  <li>
                    <strong>Complete Fitting Compatibility</strong>
                    {" "}
                    — A dedicated agricultural fitting range includes couplers, equal tees, elbows and end caps.
                  </li>
                  <li><strong>Broad Fitting Range</strong> — Fittings are available in multiple sizes, with several categories extending up to 200 mm.</li>
                  <li>
                    <strong>Multiple Connection Options</strong>
                    {" "}
                    — The range includes standard fittings as well as reducer fittings and bushes for different connection requirements.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Source keeps this Bootstrap modal but no button opens it (the Features section has no Read More); it stays hidden. */}
      <div className="modal fade" id="prayagReadMoreModal" tabIndex={-1} aria-labelledby="prayagReadMoreModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="prayagReadMoreModalLabel">Prayag Agritec Pipes — Features &amp; Benefits</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <p>
                Prayag Agritec Pipes are designed to give agricultural and irrigation systems dependable performance across a wide range of operating pressures and sizes. With PN-4, PN-6 and PN-10 pressure classifications available, the range can be matched to the specific demands of different water-distribution setups, from field-level irrigation to broader farm water supply networks.
              </p>
              <p>
                The listed Agritec Pipe range covers 90 mm, 110 mm and 160 mm sizes, supported by a complete range of compatible agricultural fittings — including couplers, equal tees, elbows, elbow variants, and end caps — with several fitting categories extending up to 200 mm.
              </p>
              <p>
                Beyond standard fittings, the range also includes reducer fittings and bushes to handle transitions between different pipe sizes, giving installers flexibility when designing or adapting a piping network. By offering pipes and compatible fittings together as part of one integrated agricultural range, Prayag simplifies sourcing and ensures better compatibility across the entire system.
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn prayag-modal-close-btn" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <section className="prayag-specs" aria-labelledby="agri-fittings-heading">
        <div className="container-fluid">
          <div className="prayag-specs__header" style={{ flexDirection: "column" }}>
            <h2 id="agri-fittings-heading">Specifications</h2>
          </div>
          <TabGroup
            listId="prayagAgriFittingsTabs"
            listClassName="nav prayag-specs__tabs"
            tabClassName="prayag-specs__tab"
            contentClassName="tab-content prayag-specs__content"
            paneClassName="tab-pane fade"
            activePaneClassName="show active"
            contentId="prayagAgriFittingsTabsContent"
            items={[
              {
                tabId: "tab-agri-smart-pipe",
                paneId: "pane-agri-smart-pipe",
                label: "Agritec Pipe Specifications",
                panel: (
                  <div className="prayag-specs__table-wrap">
                    <table className="prayag-specs__table">
                      <thead>
                        <tr>
                          <th>Specification</th>
                          <th>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td data-label="Specification">Product Range</td>
                          <td data-label="Details">Agritec Pipe</td>
                        </tr>
                        <tr>
                          <td data-label="Specification">Application</td>
                          <td data-label="Details">Agriculture / Water Distribution</td>
                        </tr>
                        <tr>
                          <td data-label="Specification">Pressure Classes</td>
                          <td data-label="Details">PN-4, PN-6, PN-10</td>
                        </tr>
                        <tr>
                          <td data-label="Specification">Available Pipe Sizes</td>
                          <td data-label="Details">90 mm, 110 mm, 160 mm</td>
                        </tr>
                        <tr>
                          <td data-label="Specification">Pipe Name</td>
                          <td data-label="Details">Smart Agri Pipe</td>
                        </tr>
                        <tr>
                          <td data-label="Specification">Fittings</td>
                          <td data-label="Details">Coupler, Equal Tee, 90° Elbow, End Cap and other fittings</td>
                        </tr>
                        <tr>
                          <td data-label="Specification">Fitting Size Range</td>
                          <td data-label="Details">63 mm–200 mm depending on fitting type and pressure class</td>
                        </tr>
                      </tbody>
                    </table>
                    <p className="prayag-specs__note">
                      *The catalogue specifically lists PN-4 pipes in 90, 110 and 160 mm, PN-6 pipes in 90, 110 and 160 mm, and PN-10 in 110 mm.
                    </p>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>
      <section className="prayag-fitting-specs pt-0" aria-labelledby="fitting-ecosystem-heading">
        <div className="container-fluid">
          <header className="prayag-fitting-specs__header">
            <h2 id="fitting-ecosystem-heading">Types of Agriculture Fittings:</h2>
          </header>
          <TabGroup
            listId="prayagFittingTabs"
            listLabel="Fitting material types"
            listClassName="nav prayag-fitting-specs__tabs"
            tabClassName="prayag-fitting-specs__tab"
            contentClassName="tab-content prayag-fitting-specs__content"
            paneClassName="tab-pane fade"
            activePaneClassName="show active"
            contentId="prayagFittingTabsContent"
            paneTabIndex={0}
            items={[
              {
                tabId: "tab-nylon",
                paneId: "pane-nylon",
                label: "Fittings (Based on Pressure Nominal)",
                panel: (
                  <SlickCarousel className="cfs-slider js-cfs-slider" settings={NYLON_SLICK} aria-label="Thermotech Blue Fittings product range">
                    <div>
                      <article className="cfs-card">
                        <figure className="cfs-card__figure">
                          {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                          <img src="/sites/prayag/theme/agritec/Agri---PIPE-Photoroom.webp" alt="White Equal Tee" loading="lazy" width="600" height="400" className="cfs-card__img" />
                        </figure>
                        <div className="cfs-card__body">
                          <h3 className="cfs-card__title">Pipe</h3>
                          <ul className="cfs-card__meta">
                            <li><strong>Range:</strong> 90 to 160</li>
                          </ul>
                        </div>
                      </article>
                    </div>
                    <div>
                      <article className="cfs-card">
                        <figure className="cfs-card__figure">
                          {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                          <img src="/sites/prayag/theme/agritec/Agri---REDUCER-COUPLER.webp" alt="White Equal Tee" loading="lazy" width="600" height="400" className="cfs-card__img" />
                        </figure>
                        <div className="cfs-card__body">
                          <h3 className="cfs-card__title">Coupler</h3>
                          <ul className="cfs-card__meta">
                            <li><strong>Range:</strong> 63 to 200</li>
                          </ul>
                        </div>
                      </article>
                    </div>
                    <div>
                      <article className="cfs-card">
                        <figure className="cfs-card__figure">
                          {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                          <img src="/sites/prayag/theme/agritec/Agri---EQUAL-TEE.webp" alt="White Female Threaded Elbow 90°" loading="lazy" width="600" height="400" className="cfs-card__img" />
                        </figure>
                        <div className="cfs-card__body">
                          <h3 className="cfs-card__title">Equal Tee</h3>
                          <ul className="cfs-card__meta">
                            <li><strong>Range:</strong> 63 to 200</li>
                          </ul>
                        </div>
                      </article>
                    </div>
                    <div>
                      <article className="cfs-card">
                        <figure className="cfs-card__figure">
                          {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                          <img src="/sites/prayag/theme/agritec/Agri---ELBOW.webp" alt="Blue Coupler" loading="lazy" width="600" height="400" className="cfs-card__img" />
                        </figure>
                        <div className="cfs-card__body">
                          <h3 className="cfs-card__title">Elbow</h3>
                          <ul className="cfs-card__meta">
                            <li><strong>Range:</strong> 63 to 200</li>
                          </ul>
                        </div>
                      </article>
                    </div>
                    <div>
                      <article className="cfs-card">
                        <figure className="cfs-card__figure">
                          {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                          <img src="/sites/prayag/theme/agritec/COUPLER-1-.webp" alt="Blue Coupler" loading="lazy" width="600" height="400" className="cfs-card__img" />
                        </figure>
                        <div className="cfs-card__body">
                          <h3 className="cfs-card__title">Elbow 90°</h3>
                          <ul className="cfs-card__meta">
                            <li><strong>Range:</strong> 75 to 110</li>
                          </ul>
                        </div>
                      </article>
                    </div>
                    <div>
                      <article className="cfs-card">
                        <figure className="cfs-card__figure">
                          {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                          <img src="/sites/prayag/theme/agritec/Agri---END-CAP.webp" alt="Blue Coupler" loading="lazy" width="600" height="400" className="cfs-card__img" />
                        </figure>
                        <div className="cfs-card__body">
                          <h3 className="cfs-card__title">End Cap</h3>
                          <ul className="cfs-card__meta">
                            <li><strong>Range:</strong> 63 to 200</li>
                          </ul>
                        </div>
                      </article>
                    </div>
                  </SlickCarousel>
                ),
              },
              {
                tabId: "tab-brass",
                paneId: "pane-brass",
                label: "Fittings (Based on 2.5 to 10 Kilograms)",
                panel: (
                  <SlickCarousel className="cfs-slider js-cfs-slider" settings={FITTINGS_SLICK} aria-label="Puretech White Fittings product range">
                    <div>
                      <article className="cfs-card">
                        <figure className="cfs-card__figure">
                          {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                          <img src="/sites/prayag/theme/agritec/3-meters.webp" alt="White Equal Tee" loading="lazy" width="600" height="400" className="cfs-card__img" />
                        </figure>
                        <div className="cfs-card__body">
                          <h3 className="cfs-card__title">Pipe 3 Metre</h3>
                          <ul className="cfs-card__meta">
                            <li><strong>Range:</strong> 90 to 200</li>
                          </ul>
                        </div>
                      </article>
                    </div>
                    <div>
                      <article className="cfs-card">
                        <figure className="cfs-card__figure">
                          {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                          <img src="/sites/prayag/theme/agritec/5-meters.webp" alt="White Equal Tee" loading="lazy" width="600" height="400" className="cfs-card__img" />
                        </figure>
                        <div className="cfs-card__body">
                          <h3 className="cfs-card__title">Pipe 5 Metre</h3>
                          <ul className="cfs-card__meta">
                            <li><strong>Range:</strong> 90 to 200</li>
                          </ul>
                        </div>
                      </article>
                    </div>
                    <div>
                      <article className="cfs-card">
                        <figure className="cfs-card__figure">
                          {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                          <img src="/sites/prayag/theme/agritec/6-meters.webp" alt="White Female Threaded Elbow 90°" loading="lazy" width="600" height="400" className="cfs-card__img" />
                        </figure>
                        <div className="cfs-card__body">
                          <h3 className="cfs-card__title">Pipe 6 Metre</h3>
                          <ul className="cfs-card__meta">
                            <li><strong>Range:</strong> 90 to 200</li>
                          </ul>
                        </div>
                      </article>
                    </div>
                    <div>
                      <article className="cfs-card">
                        <figure className="cfs-card__figure">
                          {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                          <img src="/sites/prayag/theme/agritec/COUPLER-1-.webp" alt="Blue Coupler" loading="lazy" width="600" height="400" className="cfs-card__img" />
                        </figure>
                        <div className="cfs-card__body">
                          <h3 className="cfs-card__title">Coupler</h3>
                          <ul className="cfs-card__meta">
                            <li><strong>Range:</strong> 63 to 200</li>
                          </ul>
                        </div>
                      </article>
                    </div>
                    <div>
                      <article className="cfs-card">
                        <figure className="cfs-card__figure">
                          {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                          <img src="/sites/prayag/theme/agritec/EQUAL-TEE-1-.webp" alt="Blue Equal Tee" loading="lazy" width="600" height="400" className="cfs-card__img" />
                        </figure>
                        <div className="cfs-card__body">
                          <h3 className="cfs-card__title">Equal Tee</h3>
                          <ul className="cfs-card__meta">
                            <li><strong>Range:</strong> 63 to 200</li>
                          </ul>
                        </div>
                      </article>
                    </div>
                    <div>
                      <article className="cfs-card">
                        <figure className="cfs-card__figure">
                          {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                          <img src="/sites/prayag/theme/agritec/ELBOW-1-.webp" alt="Blue Elbow" loading="lazy" width="600" height="400" className="cfs-card__img" />
                        </figure>
                        <div className="cfs-card__body">
                          <h3 className="cfs-card__title">Elbow</h3>
                          <ul className="cfs-card__meta">
                            <li><strong>Range:</strong> 20 to 200</li>
                          </ul>
                        </div>
                      </article>
                    </div>
                    <div>
                      <article className="cfs-card">
                        <figure className="cfs-card__figure">
                          {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                          <img src="/sites/prayag/theme/agritec/ELBOW-1-.webp" alt="Blue Pipe" loading="lazy" width="600" height="400" className="cfs-card__img" />
                        </figure>
                        <div className="cfs-card__body">
                          <h3 className="cfs-card__title">Elbow 45°</h3>
                          <ul className="cfs-card__meta">
                            <li><strong>Range:</strong> 20 to 160</li>
                          </ul>
                        </div>
                      </article>
                    </div>
                    <div>
                      <article className="cfs-card">
                        <figure className="cfs-card__figure">
                          {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                          <img src="/sites/prayag/theme/agritec/ELBOW-1-.webp" alt="Blue Elbow 90°" loading="lazy" width="600" height="400" className="cfs-card__img" />
                        </figure>
                        <div className="cfs-card__body">
                          <h3 className="cfs-card__title">Elbow 90°</h3>
                          <ul className="cfs-card__meta">
                            <li><strong>Range:</strong> 40 to 200</li>
                          </ul>
                        </div>
                      </article>
                    </div>
                    <div>
                      <article className="cfs-card">
                        <figure className="cfs-card__figure">
                          {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                          <img src="/sites/prayag/theme/agritec/END-CAP.webp" alt="Blue End Cap" loading="lazy" width="600" height="400" className="cfs-card__img" />
                        </figure>
                        <div className="cfs-card__body">
                          <h3 className="cfs-card__title">End Cap</h3>
                          <ul className="cfs-card__meta">
                            <li><strong>Range:</strong> 40 to 200</li>
                          </ul>
                        </div>
                      </article>
                    </div>
                    <div>
                      <article className="cfs-card">
                        <figure className="cfs-card__figure">
                          {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                          <img src="/sites/prayag/theme/agritec/Agri---REDUCER-COUPLER.webp" alt="Blue End Cap" loading="lazy" width="600" height="400" className="cfs-card__img" />
                        </figure>
                        <div className="cfs-card__body">
                          <h3 className="cfs-card__title">Reducer Coupler</h3>
                          <ul className="cfs-card__meta">
                            <li><strong>Range:</strong> 75 x 50 to 160 x 110</li>
                          </ul>
                        </div>
                      </article>
                    </div>
                    <div>
                      <article className="cfs-card">
                        <figure className="cfs-card__figure">
                          {/* eslint-disable-next-line @next/next/no-img-element -- source <img> kept 1:1 (intrinsic sizing) */}
                          <img src="/sites/prayag/theme/agritec/REDUCER-TEE.webp" alt="Blue End Cap" loading="lazy" width="600" height="400" className="cfs-card__img" />
                        </figure>
                        <div className="cfs-card__body">
                          <h3 className="cfs-card__title">Reducer Tee</h3>
                          <ul className="cfs-card__meta">
                            <li><strong>Range:</strong> 75 x 50 to 160 x 110</li>
                          </ul>
                        </div>
                      </article>
                    </div>
                  </SlickCarousel>
                ),
              },
            ]}
          />
        </div>
      </section>
    </PcatPage>
  );
}
