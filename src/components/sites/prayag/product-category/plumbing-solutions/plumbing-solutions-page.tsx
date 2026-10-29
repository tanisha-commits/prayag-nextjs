import Link from "next/link";
import { PcatPage } from "../pcat-page";
import "./plumbing-solutions.css";

const BANNER = "/sites/prayag/files/styles";

// Source order, labels and (copy-pasted) alt texts verbatim from https://prayagindia.com/plumbing-solutions.
const subcategories = [
  { label: "HDPE", href: "/hdpe", image: "/sites/prayag/files/2026-10/main-banner-hdpe.webp", alt: "Bromo Vertical " },
  { label: "Agritec", href: "/agritech", image: "/sites/prayag/files/2026-09/hero-section.webp", alt: "Bromo Vertical " },
  {
    label: "SWR Pipe",
    href: "/swr-plumbing-solution",
    image: `${BANNER}/wide/public/2026-09/section1.webp`,
    alt: "Bromo Vertical ",
  },
  {
    label: "Cpvc Pipes",
    href: "/cpvc-plumbing-solution",
    image: `${BANNER}/wide/public/2026-09/img1.png`,
    alt: "Bromo Vertical ",
  },
  {
    label: "Casing Pipes ",
    href: "/casing-pipes",
    image: `${BANNER}/wide/public/2026-08/Casing-pipe-banner.webp`,
    alt: "Bromo Vertical ",
  },
  {
    label: "Composite Pipes ",
    href: "/composite-pipes",
    image: "/sites/prayag/files/2026-07/Composite_pipecategroy.webp",
    alt: "Bromo Vertical ",
  },
  {
    label: "UGD Pipes & Fittings",
    href: "/ugd-pipes-fittings",
    image: "/sites/prayag/files/2026-07/UDG-pipes_BANNER.webp",
    alt: "Therma Horizontal",
  },
  {
    label: "uPVC Column Pipes",
    href: "/upvc-column-pipes",
    image: "/sites/prayag/files/2026-05/banner-main.webp",
    alt: "Nile Vertical ",
  },
  { label: "PPR Pipes", href: "/ppr-pipes", image: "/sites/prayag/files/2026-08/PPR-main-banner.webp", alt: "Pico Vertical " },
  // Source href is "/PVC-O%20Pipes", which the live site redirects to /pvc-o-pipes.
  { label: "PVC-O Pipes", href: "/pvc-o-pipes", image: "/sites/prayag/files/2026-09/cpvcO.webp", alt: "PVC-O Pipes" },
];

/** Plumbing Solutions hub (source taxonomy term page): banner + grid of the 10 sub-categories. */
export function PlumbingSolutionsPage() {
  return (
    <PcatPage slug="plumbing-solutions">
      <div className="breadcrumb_main">
        <div className="container-fluid p-0 m-0">
          <div className="row">
            <div className="col-md-6">
              <div className="breadcrumb_image">
                {/* eslint-disable-next-line @next/next/no-img-element -- source srcset/sizes kept 1:1 */}
                <img
                  src={`${BANNER}/medium/public/2026-08/Plumbing-pipe.png`}
                  srcSet={`${BANNER}/thumbnail/public/2026-08/Plumbing-pipe.png 300w, ${BANNER}/thumbnail/public/2026-08/Plumbing-pipe.png 600w, ${BANNER}/large/public/2026-08/Plumbing-pipe.png 1200w, ${BANNER}/wide/public/2026-08/Plumbing-pipe.png 2000w`}
                  sizes="(max-width: 300px) 300px, (max-width: 600px) 600px, (max-width: 1200px) 1200px, 2000px"
                  alt="Plumbing Solutions"
                  width={800}
                  height={450}
                  className="img-fluid"
                  decoding="async"
                  fetchPriority="high"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="breadcrumb_title">
                <h1 className="black_title">Plumbing Solutions</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="category_page" style={{ paddingTop: 50 }}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="row filter_prod">
                <div className="row">
                  {subcategories.map((item) => (
                    <div key={item.href} className="col-6 col-sm-6 col-md-4">
                      <Link href={item.href}>
                        <div className="product_p_box">
                          <div className="pro_p_img">
                            {/* eslint-disable-next-line @next/next/no-img-element -- source intrinsic sizing kept 1:1 */}
                            <img src={item.image} alt={item.alt} />
                          </div>
                          <h6>{item.label}</h6>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PcatPage>
  );
}
