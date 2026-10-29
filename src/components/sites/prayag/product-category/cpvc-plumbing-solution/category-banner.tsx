/** Local copies of the Drupal image-style derivatives the source banner <img> references. */
export type BannerImage = { medium: string; thumbnail: string; large: string; wide: string };

/**
 * Source `.breadcrumb_main` banner (shared by the cPVC and UGD pages): image left, page title
 * right. The srcset is the source's verbatim, including the thumbnail derivative listed twice
 * (300w and 600w) by the Drupal template.
 */
export function CategoryBanner({ image, alt, title }: { image: BannerImage; alt: string; title: string }) {
  return (
    <div className="breadcrumb_main">
      <div className="container-fluid p-0 m-0">
        <div className="row">
          <div className="col-md-6">
            {/* eslint-disable-next-line @next/next/no-img-element -- 1:1 port keeps the source <img> with its intrinsic size/srcset */}
            <img
              src={image.medium}
              srcSet={`${image.thumbnail} 300w, ${image.thumbnail} 600w, ${image.large} 1200w, ${image.wide} 2000w`}
              sizes="(max-width: 300px) 300px, (max-width: 600px) 600px, (max-width: 1200px) 1200px, 2000px"
              alt={alt}
              width={800}
              height={450}
              className="img-fluid"
              decoding="async"
            />
          </div>
          <div className="col-md-6">
            <div className="breadcrumb_title">
              <h1 className="black_title">{title}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** "Know More" arrow of the source `.prayag-btn` links. */
export function ArrowIcon() {
  return (
    <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M21.2308 5.99866C21.2211 5.78469 21.1301 5.53538 20.9771 5.37908L15.9807 0.279282C15.6418 -0.0128267 14.993 -0.133765 14.6154 0.204859C14.2436 0.537901 14.2533 1.18352 14.6251 1.51656L18.1381 5.09813H0.937304C0.420215 5.09813 0 5.50188 0 5.99864C0 6.49542 0.420245 6.89914 0.937304 6.89914H18.1381L14.6251 10.4807C14.3055 10.7877 14.2455 11.4557 14.6154 11.7924C14.9834 12.1292 15.6573 12.0213 15.9807 11.718L20.9771 6.61819C21.1475 6.4433 21.2308 6.23868 21.2308 5.99866Z"
        fill="black"
      />
    </svg>
  );
}
