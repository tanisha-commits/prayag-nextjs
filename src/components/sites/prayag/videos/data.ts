// Content for /product-video, /video-tv-advertisement and /feedback-videos
// (source: prayagindia.com, node/1075, node/62, node/1076). Every YouTube id was checked
// against YouTube oEmbed — see docs/research/prayag/video-verification.md.

export type VideoCard = {
  /** YouTube id that is played. */
  id: string;
  /** Card heading, verbatim from the source. */
  title: string;
  /** Local copy of the source thumbnail. */
  thumb: string;
};

export type VideoPage = {
  banner: { image: string; imageAlt: string; title: string };
  cards: VideoCard[];
};

/** Product / feedback cards: the source appends "?autoplay=1&rel=0" on click. */
export const inlineEmbedUrl = (id: string) => `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;

/** TV page modal: theme script.js builds this URL from `data-video-id`. */
export const modalEmbedUrl = (id: string) => `https://www.youtube.com/embed/${id}?autoplay=1&feature=oembed`;

export const productVideoPage: VideoPage = {
  banner: { image: "/sites/prayag/files/2025-08/product-video.webp", imageAlt: "", title: "Product Video" },
  cards: [
    {
      id: "oVYIYvnYzGQ",
      title: "Prayag Duralife CPVC Pipe Put to the Test – Unbelievable Strength & Flexibility",
      thumb: "/sites/prayag/theme/Prayag-DuralifeCPVC_Pipe_Put_to_the_Test-Unbelievable_Strength_Flexibility.webp",
    },
    {
      id: "_Zrq98xvV-A",
      title: "Tested for Trust: Inside Prayag's Rigorous Product Testing Process",
      thumb: "/sites/prayag/theme/Tested-for-Trust.webp",
    },
    {
      id: "QaGMCSQUr6I",
      title: "This Smart Toilet Redefines Luxury Hygiene X Prayag",
      thumb: "/sites/prayag/theme/This-Smart-Toilet-Redefines-Luxury-Hygiene-X-Prayag.webp",
    },
    {
      id: "rEkCzqugSzk",
      title: "Prayag Water Tanks & Line Filters | Pure Water, Powerful Protection",
      thumb: "/sites/prayag/theme/product_video_testimonial.webp",
    },
  ],
};

export const feedbackVideosPage: VideoPage = {
  banner: { image: "/sites/prayag/files/2025-08/feedback-banner.webp", imageAlt: "feedback-banner", title: "Feedback Videos" },
  cards: [
    {
      id: "OkOliW9o9cg",
      title: "Dealer Trust Speaks for Prayag | Mr. Sanjay Manwani, Baba Sanitaryware & Hardware, Indore",
      thumb: "/sites/prayag/theme/Dealer-trust-speaker.webp",
    },
    {
      // Deliberate fix: the source plays xaTiH0hlURs ("Why Distributors Stay with Prayag…",
      // the same video as card 4). Its own thumbnail is LZXPJD1JCsM, whose oEmbed title is
      // this card's title, so that id is played here.
      id: "LZXPJD1JCsM",
      title: "Prayag CEO Nitin Aggarwal Making European Luxury Affordable for India NDTV Business Conclave",
      thumb: "/sites/prayag/files/youtube/LZXPJD1JCsM-hqdefault.jpg",
    },
    {
      id: "ZkAr1ccoclk",
      title: "🤝 Meet Yusuf Master - The Voice of Prayag in Vidarbha, Nagpur.",
      thumb: "/sites/prayag/theme/Distributor-feedback-video.webp",
    },
    {
      id: "xaTiH0hlURs",
      title: "Why Distributors Stay with Prayag for Decades | Built on Trust & Quality",
      thumb: "/sites/prayag/theme/Employee-feedback.webp",
    },
    {
      id: "y4qnh7v9j00",
      title: "Mr. V.K. Jain’s Journey with Prayag | 38 Years of Partnership",
      thumb: "/sites/prayag/theme/Distributor-feedback-video2.webp",
    },
    {
      id: "HKuT_vBvLCE",
      title: "Worked with dedication — and success followed instantly.",
      thumb: "/sites/prayag/theme/Feedback-prayag.webp",
    },
  ],
};

export const tvAdsPage: VideoPage = {
  banner: { image: "/sites/prayag/files/2024-08/Video-TV-Advertisement.webp", imageAlt: "", title: "Video / TV Advertisement" },
  cards: [
    { id: "RWDChd4E4OY", title: "Saala Khadoos Associates - Prayag India", thumb: "/sites/prayag/files/2025-10/Saala-Khadoos-Associates---Prayag-India.webp" },
    {
      id: "HW7CECdYxgw",
      title: "Prayag India Sponsors - Jolly LLB 2 | Prayag India",
      thumb: "/sites/prayag/files/2025-10/Prayag-India-Sponsors---Jolly-LLB-2-Prayag-India.webp",
    },
    {
      id: "XNfObH1tvJw",
      title: "Prayag Chrome Plated Products Technical Video.",
      thumb: "/sites/prayag/files/2025-10/Prayag-Chrome-Plated-Products-Technical-Video.webp",
    },
    {
      id: "R70VavGdDhg",
      title: "Jersey x Prayag- Your Family’s real Hero! | Prayag India",
      thumb: "/sites/prayag/files/2025-10/Jersey-x-Prayag--Your-Familys-real-Hero-Prayag-India.webp",
    },
    {
      id: "r08qriSTavE",
      title: "Fateh Movie Trailer Starring Sonu Sood & Jacqueline Fernandez Releasing 10th January 2025",
      thumb: "/sites/prayag/files/2025-10/Fateh-Movie-Trailer-Starring-Sonu-Sood-Jacqueline-Fernandez-Releasing-10th-January-2025.webp",
    },
    { id: "qRZyfrnlFNU", title: "Durga Puja", thumb: "/sites/prayag/files/2024-09/Happy-durga-Pooja.webp" },
    { id: "btKXfQddvXE", title: "Respect Freedom", thumb: "/sites/prayag/files/2024-09/Respect-Freedom.webp" },
    { id: "Xk8uf2KLW-Y", title: "Rishta Zindagi Bhar Ka", thumb: "/sites/prayag/files/2024-09/Rsita-Zindagi-Bhar-ka.webp" },
    { id: "BI_qZK8-OJs", title: "New Zeland Having Sleepless", thumb: "/sites/prayag/files/2024-09/New-zealand.webp" },
    { id: "-Dk4z_gRH4s", title: "Pakistan Home Coming", thumb: "/sites/prayag/files/2024-09/Pakistan-Home-coming.webp" },
    { id: "ao2YUTJ-bNs", title: "India vs Pakistan", thumb: "/sites/prayag/files/2024-09/Cheers-for-india.webp" },
    { id: "7Zfj8xUx0sw", title: "Prayag Cheers For India", thumb: "/sites/prayag/files/2024-09/Prayag-cheers-for-india.webp" },
    { id: "4Nqsu2O_sj8", title: "This Eid Lets Gift A New Life To Someone", thumb: "/sites/prayag/files/2024-09/This-eid-lets-giftt.webp" },
    { id: "ZgKuW9v_dYs", title: "Prayag Hai Kings Ki Choice", thumb: "/sites/prayag/files/2024-09/prayag-haii-kings-kii-choice.webp" },
  ],
};
