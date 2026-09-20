// HLP Data — Portfolio Script (Taste-skill clean, theme switcher, i18n with IP auto-detection)

const I18N_DICT = {
  en: {
    nav_datasets: 'Datasets',
    nav_pipeline: 'Architecture',
    nav_stack: 'Stack',
    nav_experience: 'Track Record',
    nav_contact_btn: 'Contact',
    mobile_contact_me: 'Contact Me',

    hero_status: 'Available for Data Engineering & Cloud Crawler Contracts',
    hero_headline: 'Data engineer building resilient web crawlers & cloud feeds.',
    hero_subtext: 'I build autonomous collection pipelines that overcome modern anti-bot systems (Turnstile, WAF) and deliver verified, 100% schema-compliant datasets directly into AWS S3.',
    hero_cta_explore: 'Explore Datasets',
    hero_cta_hire: 'Hire / Request Data',
    hero_cta_cv: 'Print CV',

    metric_lbl_1: 'Properties (PT & UK)',
    metric_lbl_2: 'SKUs (Retail & Luxury)',
    metric_lbl_3: 'Buyer Audit Score',
    metric_lbl_4: 'PII Exposure (Strict B2B)',

    terminal_title: 'buyer_audit.sh • active',
    terminal_tag_engine: 'Native AppleScript + CDP Engine',
    terminal_tag_s3: 'S3 Ingestion Ready',

    datasets_heading: 'Verified Datasets & Deliverables',
    datasets_desc: 'Production-grade datasets extracted, validated, and packaged for commercial delivery.',

    ds1_badge: 'Real Estate • Portugal',
    ds1_status: 'Commercial Ready',
    ds1_name: 'Idealista Portugal Nationwide Feed',
    ds1_summary: 'Structured real estate catalog spanning 13 Portuguese districts (Lisboa, Porto, Algarve, Setúbal, Braga, Coimbra, etc.). Includes square-meter valuation, bedrooms, floor elevations, terrace/garage amenities, and normalized geocodes.',
    ds1_th_prop: 'Sample Property',
    ds1_th_price: 'Price',
    ds1_th_area: 'Area',
    ds1_th_region: 'Region',
    ds1_preview_tag: '🔒 Sample Preview: 3 of 2,640 records',
    ds1_preview_footer: 'Full commercial feed delivered via private S3 / API',
    ds1_meta_records: '<strong>2,640</strong> records',
    ds1_meta_cols: '<strong>32</strong> columns',
    ds1_meta_freq: '<strong>Daily/Weekly</strong> feed',
    ds1_btn: 'Request Sample / Purchase',

    ds2_badge: 'Retail & FMCG • Portugal',
    ds2_status: 'Verified Commercial Feed',
    ds2_name: 'Continente Supermarket FMCG Catalog',
    ds2_summary: "Full-spectrum pricing and product intelligence for Portugal's leading supermarket chain. Features 3-tier category taxonomy, promotional markdown tracking, unit prices (€/kg, €/L), and packaging dimensions.",
    ds2_th_sku: 'SKU / Product',
    ds2_th_std: 'Standard',
    ds2_th_promo: 'Promo',
    ds2_th_unit: 'Unit Price',
    ds2_preview_tag: '🔒 Sample Preview: 3 of 2,059 SKUs',
    ds2_preview_footer: 'Full commercial feed delivered via private S3 / API',
    ds2_meta_records: '<strong>2,059</strong> SKUs',
    ds2_meta_cols: '<strong>31</strong> columns',
    ds2_meta_s3: '<strong>S3 verified</strong>',
    ds2_btn: 'Request Sample / Purchase',

    ds3_badge: 'Luxury Fashion • Global',
    ds3_status: 'Buyer Audit: 100/100',
    ds3_name: 'Farfetch Global Luxury Fashion & Designer Feed',
    ds3_summary: 'Curated catalog of 120 verified luxury items across premier fashion houses: Jacquemus, Valentino Garavani, Balmain, Bottega Veneta, Saint Laurent, Christian Louboutin, Tom Ford, and Moncler. Strict 35-attribute FASHION-PDP schema with original prices, sale discounts, multi-currency values, stock availability, and image links.',
    ds3_th_brand: 'Brand / Item',
    ds3_th_price: 'Price (USD)',
    ds3_th_cat: 'Category',
    ds3_th_origin: 'Origin',
    ds3_preview_tag: '🔒 Sample Preview: 3 of 120 items',
    ds3_preview_footer: 'Full commercial feed delivered via private S3 / API',
    ds3_meta_records: '<strong>120</strong> verified SKUs',
    ds3_meta_cols: '<strong>35</strong> cols (FASHION-PDP)',
    ds3_meta_audit: '<strong>100 / 100</strong> Buyer Audit',
    ds3_btn: 'Request Sample / Purchase',

    ds4_badge: 'Real Estate • United Kingdom',
    ds4_status: 'Buyer Audit: 100/100',
    ds4_name: 'Rightmove London / UK Real Estate Intelligence',
    ds4_summary: 'Comprehensive market intelligence covering 500 verified properties across Greater London and Prime Central London. Fully compliant with REAL-ESTATE-BASIC schema across all 32 required attributes: exact GPS latitude/longitude, living area sqm, sale prices, bedroom/bathroom breakdown, energy ratings, agency info, and floor plan links.',
    ds4_th_loc: 'Property Location',
    ds4_th_price: 'Price',
    ds4_th_beds: 'Beds',
    ds4_th_agency: 'Agency',
    ds4_preview_tag: '🔒 Sample Preview: 3 of 500 listings',
    ds4_preview_footer: 'Full commercial feed delivered via private S3 / API',
    ds4_meta_records: '<strong>500</strong> verified properties',
    ds4_meta_cols: '<strong>32</strong> cols (REAL-ESTATE-BASIC)',
    ds4_meta_audit: '<strong>100 / 100</strong> Buyer Audit',
    ds4_meta_gps: '<strong>GPS & Floorplans</strong>',
    ds4_btn: 'Request Sample / Purchase',

    pipeline_heading: 'Extraction & Verification Architecture',
    pipeline_desc: 'How data flows from target DOMs to enterprise-ready data lakes with zero human intervention.',
    step1_title: 'Resilient Ingestion Engine',
    step1_desc: 'Dual-engine architecture utilizing Chrome DevTools Protocol (CDP) combined with native OS-level AppleScript bridges. Bypasses Cloudflare Turnstile, browser fingerprinting, and dynamic canvas challenges with authentic human jitter.',
    step2_title: 'Strict Schema Validation',
    step2_desc: 'Automated quality gates check 100% of rows prior to release. Enforces strict schema definitions (e.g. 32-col Real Estate, 31-col FMCG), non-negative pricing bounds, geocode boundary validation, and UTF-8-SIG encoding with semicolon delimiters.',
    step3_title: 'Autonomous Cloud Delivery',
    step3_desc: 'Data is pushed directly into Amazon S3 storage buckets (s3://enterprise-data-lake/feeds/...). The pipeline monitors automated integrity checks and cloud handshakes to confirm delivery without manual oversight.',

    stack_heading: 'Core Technical Stack',
    stack_desc: 'Tools, frameworks, and protocols deployed across daily operations.',
    stack_cat1: 'Scraping & Automation',
    stack_cat2: 'Data & Cloud',
    stack_cat3: 'Marketplaces & Protocols',
    stack_item_playwright: '<strong>Playwright & Puppeteer:</strong> Headless & headful automation',
    stack_item_cdp: '<strong>CDP (Chrome DevTools Protocol):</strong> Low-level socket control',
    stack_item_applescript: '<strong>macOS AppleScript Bridge:</strong> Native browser IPC',
    stack_item_bs4: '<strong>BeautifulSoup4 / lxml / Scrapy:</strong> High-throughput DOM parsers',
    stack_item_s3: '<strong>Amazon S3 & AWS SDK (Boto3):</strong> Cloud data lake delivery',
    stack_item_pandas: '<strong>Pandas & NumPy:</strong> Normalization & outlier filtration',
    stack_item_db: '<strong>PostgreSQL & SQLite:</strong> Local staging & deduplication',
    stack_item_docker: '<strong>Docker & Bash:</strong> Autonomous daemons & scheduled cron',
    stack_item_databoutique: '<strong>Enterprise Data Feeds:</strong> High-volume commercial data feeds & automated delivery',
    stack_item_datarade: '<strong>Datarade:</strong> Provider pipeline onboarding & enterprise feeds',
    stack_item_compliance: '<strong>GDPR & Compliance:</strong> 100% public catalog data, zero PII',
    stack_item_paypal: '<strong>PayPal Business:</strong> Verified commercial billing',

    record_heading: 'Track Record',
    record_desc: 'Professional journey in data engineering and automation.',
    record_badge_active: 'Active',
    record_role1: 'Lead Data Engineer & Founder • Independent Data Studio',
    record_desc1: 'Building and commercializing high-precision data extraction pipelines targeting top European retail and real estate portals. Achieved 100% acceptance rate on enterprise cloud deliveries and verified commercial standing.',
    record_role2: 'Software Automation & Backend Engineer',
    record_desc2: 'Engineered resilient backend scrapers, API integrations, and cloud ingestion workflows. Developed automated testing suites to validate live schema integrity and prevent silent failure modes in high-volume production jobs.',

    contact_heading: 'Need custom data or an anti-bot pipeline?',
    contact_sub: 'Available for bespoke data scraping contracts, recurring marketplace feeds, and technical consulting.',
    contact_lbl_email: 'Business Email',
    contact_lbl_paypal: 'PayPal Commercial Billing',
    contact_badge_paypal: 'Verified Business',
    contact_lbl_github: 'GitHub Code Repositories',
    contact_badge_github: 'Open Source',
    contact_cta_btn: 'Start a Conversation',

    footer_copy: '&copy; 2026 <strong>HLP Data</strong> &bull; Lead Architect: Le Phuoc Hung &bull; Built with clean, anti-slop engineering standards.',
    footer_top: 'Back to top',
    footer_terms: 'Terms & Compliance',
    footer_privacy: 'Privacy Policy',

    copy_btn_text: 'Copy',
    copied_btn_text: 'Copied!'
  },

  vi: {
    nav_datasets: 'Bộ dữ liệu',
    nav_pipeline: 'Kiến trúc',
    nav_stack: 'Công nghệ',
    nav_experience: 'Kinh nghiệm',
    nav_contact_btn: 'Liên hệ',
    mobile_contact_me: 'Liên hệ trực tiếp',

    hero_status: 'Sẵn sàng nhận hợp đồng Data Engineering & Crawler đám mây',
    hero_headline: 'Kỹ sư dữ liệu chuyên xây dựng web crawler & luồng dữ liệu đám mây.',
    hero_subtext: 'Tôi xây dựng các pipeline thu thập dữ liệu tự động, vượt qua các hệ thống anti-bot hiện đại (Turnstile, WAF) và bàn giao bộ dữ liệu chuẩn 100% schema trực tiếp vào AWS S3.',
    hero_cta_explore: 'Xem các bộ dữ liệu',
    hero_cta_hire: 'Đặt hàng / Thuê cào dữ liệu',
    hero_cta_cv: 'Xuất CV (PDF)',

    metric_lbl_1: 'Bất động sản (Bồ Đào Nha & Anh)',
    metric_lbl_2: 'Sản phẩm (Bán lẻ & Xa xỉ)',
    metric_lbl_3: 'Điểm nghiệm thu từ Buyer',
    metric_lbl_4: 'Vi phạm PII (Chuẩn B2B)',

    terminal_title: 'buyer_audit.sh • đang chạy',
    terminal_tag_engine: 'Động cơ Native AppleScript + CDP',
    terminal_tag_s3: 'Sẵn sàng đẩy dữ liệu S3',

    datasets_heading: 'Bộ Dữ Liệu Đã Nghiệm Thu & Bàn Giao',
    datasets_desc: 'Các bộ dữ liệu cấp thương mại được trích xuất, kiểm định và đóng gói sẵn sàng phân phối cho doanh nghiệp.',

    ds1_badge: 'Bất động sản • Bồ Đào Nha',
    ds1_status: 'Đã sẵn sàng thương mại',
    ds1_name: 'Dữ liệu Bất động sản Toàn quốc Idealista Bồ Đào Nha',
    ds1_summary: 'Danh mục dữ liệu bất động sản cấu trúc hóa qua 13 quận của Bồ Đào Nha (Lisboa, Porto, Algarve, Setúbal, Braga, Coimbra,...). Bao gồm định giá theo m², số phòng ngủ, số tầng, tiện ích sân thượng/gara và tọa độ GPS chuẩn hóa.',
    ds1_th_prop: 'Mẫu bất động sản',
    ds1_th_price: 'Giá bán',
    ds1_th_area: 'Diện tích',
    ds1_th_region: 'Khu vực',
    ds1_preview_tag: '🔒 Xem mẫu: 3 trong 2.640 bản ghi',
    ds1_preview_footer: 'Luồng dữ liệu thương mại đầy đủ cấp qua AWS S3 / API bảo mật',
    ds1_meta_records: '<strong>2.640</strong> bản ghi',
    ds1_meta_cols: '<strong>32</strong> trường dữ liệu',
    ds1_meta_freq: 'Cập nhật <strong>Hàng ngày/Tuần</strong>',
    ds1_btn: 'Yêu cầu mẫu / Đặt mua',

    ds2_badge: 'Bán lẻ & FMCG • Bồ Đào Nha',
    ds2_status: 'Luồng dữ liệu thương mại đã duyệt',
    ds2_name: 'Danh mục Siêu thị & Hàng tiêu dùng Continente',
    ds2_summary: 'Toàn bộ dữ liệu giá và thông tin sản phẩm của chuỗi siêu thị hàng đầu Bồ Đào Nha. Cấu trúc danh mục 3 cấp, theo dõi giảm giá khuyến mãi, đơn giá quy đổi (€/kg, €/L) và kích thước đóng gói.',
    ds2_th_sku: 'Sản phẩm / Mặt hàng',
    ds2_th_std: 'Giá gốc',
    ds2_th_promo: 'Khuyến mãi',
    ds2_th_unit: 'Đơn vị',
    ds2_preview_tag: '🔒 Xem mẫu: 3 trong 2.059 sản phẩm',
    ds2_preview_footer: 'Luồng dữ liệu thương mại đầy đủ cấp qua AWS S3 / API bảo mật',
    ds2_meta_records: '<strong>2.059</strong> mặt hàng',
    ds2_meta_cols: '<strong>31</strong> trường dữ liệu',
    ds2_meta_s3: '<strong>Đã kiểm duyệt S3</strong>',
    ds2_btn: 'Yêu cầu mẫu / Đặt mua',

    ds3_badge: 'Thời trang Xa xỉ • Toàn cầu',
    ds3_status: 'Nghiệm thu Buyer: 100/100',
    ds3_name: 'Luồng Dữ liệu Thời trang Xa xỉ Toàn cầu Farfetch',
    ds3_summary: 'Danh mục 120 sản phẩm xa xỉ chuẩn hóa từ các nhà mốt hàng đầu: Jacquemus, Valentino Garavani, Balmain, Bottega Veneta, Saint Laurent, Christian Louboutin, Tom Ford và Moncler. Đáp ứng nghiêm ngặt schema FASHION-PDP 35 trường gồm giá gốc, giá sale, đa tiền tệ, tồn kho và link ảnh.',
    ds3_th_brand: 'Thương hiệu / Mặt hàng',
    ds3_th_price: 'Giá (USD)',
    ds3_th_cat: 'Phân loại',
    ds3_th_origin: 'Xuất xứ',
    ds3_preview_tag: '🔒 Xem mẫu: 3 trong 120 sản phẩm',
    ds3_preview_footer: 'Luồng dữ liệu thương mại đầy đủ cấp qua AWS S3 / API bảo mật',
    ds3_meta_records: '<strong>120</strong> sản phẩm xác thực',
    ds3_meta_cols: '<strong>35</strong> cột (FASHION-PDP)',
    ds3_meta_audit: '<strong>100 / 100</strong> Nghiệm thu Buyer',
    ds3_btn: 'Yêu cầu mẫu / Đặt mua',

    ds4_badge: 'Bất động sản • Vương quốc Anh',
    ds4_status: 'Nghiệm thu Buyer: 100/100',
    ds4_name: 'Dữ liệu Bất động sản London & Vương quốc Anh Rightmove',
    ds4_summary: 'Dữ liệu thị trường toàn diện bao gồm 500 bất động sản tại Greater London và trung tâm London. Chuẩn hóa 100% theo schema REAL-ESTATE-BASIC với 32 trường bắt buộc: tọa độ GPS chuẩn, diện tích m², giá niêm yết, số phòng ngủ/tắm, xếp hạng năng lượng, đại lý và sơ đồ mặt sàn.',
    ds4_th_loc: 'Vị trí bất động sản',
    ds4_th_price: 'Giá bán',
    ds4_th_beds: 'Phòng ngủ',
    ds4_th_agency: 'Đại lý',
    ds4_preview_tag: '🔒 Xem mẫu: 3 trong 500 tin đăng',
    ds4_preview_footer: 'Luồng dữ liệu thương mại đầy đủ cấp qua AWS S3 / API bảo mật',
    ds4_meta_records: '<strong>500</strong> bất động sản duyệt',
    ds4_meta_cols: '<strong>32</strong> cột (REAL-ESTATE-BASIC)',
    ds4_meta_audit: '<strong>100 / 100</strong> Nghiệm thu Buyer',
    ds4_meta_gps: '<strong>GPS & Sơ đồ nhà</strong>',
    ds4_btn: 'Yêu cầu mẫu / Đặt mua',

    pipeline_heading: 'Kiến Trúc Thu Thập & Kiểm Định Dữ Liệu',
    pipeline_desc: 'Quy trình dữ liệu tự động từ DOM trang web đến Data Lake đám mây không cần can thiệp thủ công.',
    step1_title: 'Động Cơ Thu Thập Bền Bỉ',
    step1_desc: 'Kiến trúc 2 tầng kết hợp giao thức Chrome DevTools (CDP) và cầu nối native AppleScript. Vượt qua Cloudflare Turnstile, browser fingerprinting và canvas verification với độ trễ người dùng ngẫu nhiên.',
    step2_title: 'Kiểm Định Schema Nghiêm Ngặt',
    step2_desc: 'Cổng kiểm định tự động kiểm tra 100% bản ghi trước khi xuất kho. Kiểm soát cấu trúc schema (32 cột Bất động sản, 31 cột FMCG), biên độ giá dương, tọa độ địa lý hợp lệ, mã hóa UTF-8-SIG và phân tách dấu chấm phẩy.',
    step3_title: 'Phân Phối Đám Mây Tự Động',
    step3_desc: 'Dữ liệu được đẩy trực tiếp lên kho lưu trữ Amazon S3 (s3://enterprise-data-lake/feeds/...). Pipeline tự động giám sát kiểm thử toàn vẹn và handshake phản hồi xác nhận từ đối tác.',

    stack_heading: 'Công Nghệ Lõi Vận Hành',
    stack_desc: 'Bộ công cụ, thư viện và giao thức thực chiến được triển khai hàng ngày.',
    stack_cat1: 'Cào Dữ Liệu & Tự Động Hóa',
    stack_cat2: 'Xử Lý Dữ Liệu & Điện Toán Đám Mây',
    stack_cat3: 'Sàn Thương Mại & Giao Thức',
    stack_item_playwright: '<strong>Playwright & Puppeteer:</strong> Tự động hóa headless & headful',
    stack_item_cdp: '<strong>CDP (Chrome DevTools Protocol):</strong> Điều khiển socket cấp thấp',
    stack_item_applescript: '<strong>macOS AppleScript Bridge:</strong> Giao tiếp tiến trình native trên macOS',
    stack_item_bs4: '<strong>BeautifulSoup4 / lxml / Scrapy:</strong> Bóc tách DOM hiệu năng cao',
    stack_item_s3: '<strong>Amazon S3 & AWS SDK (Boto3):</strong> Giao nộp data lake đám mây',
    stack_item_pandas: '<strong>Pandas & NumPy:</strong> Chuẩn hóa & lọc nhiễu dữ liệu',
    stack_item_db: '<strong>PostgreSQL & SQLite:</strong> Lưu trữ trung gian & khử trùng lặp',
    stack_item_docker: '<strong>Docker & Bash:</strong> Tiến trình chạy nền & lập lịch tự động',
    stack_item_databoutique: '<strong>Enterprise Data Feeds:</strong> Luồng cấp dữ liệu thương mại & nộp tự động',
    stack_item_datarade: '<strong>Datarade:</strong> Kênh nhà cung cấp dữ liệu doanh nghiệp',
    stack_item_compliance: '<strong>GDPR & Tuân thủ:</strong> 100% dữ liệu công khai, không thu thập PII',
    stack_item_paypal: '<strong>PayPal Business:</strong> Thanh toán thương mại đã xác thực',

    record_heading: 'Hành Trình Nghề Nghiệp',
    record_desc: 'Quá trình hoạt động chuyên nghiệp trong lĩnh vực kỹ thuật dữ liệu và tự động hóa.',
    record_badge_active: 'Hiện tại',
    record_role1: 'Trưởng nhóm Kỹ thuật Dữ liệu & Sáng lập viên • Studio Dữ liệu Độc lập',
    record_desc1: 'Xây dựng và thương mại hóa các pipeline thu thập dữ liệu độ chính xác cao nhắm tới các cổng bán lẻ và bất động sản hàng đầu châu Âu. Đạt tỷ lệ nghiệm thu 100% trên các đợt bàn giao S3 đám mây và duy trì uy tín thương mại.',
    record_role2: 'Kỹ sư Tự Động Hóa & Lập Trình Backend',
    record_desc2: 'Phát triển scraper backend, tích hợp API và luồng xử lý cloud ingestion. Xây dựng các bộ kiểm thử tự động xác thực tính toàn vẹn schema, triệt tiêu lỗi ngầm trong các tác vụ tải trọng lớn.',

    contact_heading: 'Cần cào dữ liệu theo yêu cầu hoặc giải pháp vượt anti-bot?',
    contact_sub: 'Sẵn sàng nhận hợp đồng cào dữ liệu tùy biến, luồng cấp dữ liệu định kỳ và tư vấn giải pháp kỹ thuật.',
    contact_lbl_email: 'Email Doanh Nghiệp',
    contact_lbl_paypal: 'Thanh Toán Thương Mại PayPal',
    contact_badge_paypal: 'Doanh Nghiệp Đã Xác Minh',
    contact_lbl_github: 'Kho Mã Nguồn GitHub',
    contact_badge_github: 'Mã Nguồn Mở',
    contact_cta_btn: 'Bắt Đầu Trao Đổi',

    footer_copy: '&copy; 2026 <strong>HLP Data</strong> &bull; Kỹ sư trưởng: Lê Phước Hùng &bull; Xây dựng theo tiêu chuẩn kỹ thuật tinh gọn, chống slop.',
    footer_top: 'Lên đầu trang',
    footer_terms: 'Điều khoản & Tuân thủ',
    footer_privacy: 'Chính sách Quyền riêng tư',

    copy_btn_text: 'Sao chép',
    copied_btn_text: 'Đã chép!'
  }
};

let currentLang = 'en';

// Set active language across document
function setLanguage(lang, persist = true) {
  if (!I18N_DICT[lang]) lang = 'en';
  currentLang = lang;

  document.documentElement.lang = lang;

  // Text content replacements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (I18N_DICT[lang][key]) {
      el.textContent = I18N_DICT[lang][key];
    }
  });

  // HTML content replacements (for formatting like <strong>, &bull;)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (I18N_DICT[lang][key]) {
      el.innerHTML = I18N_DICT[lang][key];
    }
  });

  // Update switcher buttons in desktop and mobile header
  document.querySelectorAll('.lang-btn').forEach(btn => {
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  if (persist) {
    try {
      localStorage.setItem('hlp_lang', lang);
    } catch (e) {}
  }
}

// IP-based country detection + browser language fallback
async function detectInitialLanguage() {
  // 1. Check user manual override in localStorage
  try {
    const savedLang = localStorage.getItem('hlp_lang');
    if (savedLang && (savedLang === 'en' || savedLang === 'vi')) {
      setLanguage(savedLang, false);
      return;
    }
  } catch (e) {}

  // 2. Check session cache for detected country
  try {
    const cachedCountry = sessionStorage.getItem('hlp_country');
    if (cachedCountry) {
      if (cachedCountry === 'VN') {
        setLanguage('vi', false);
      } else {
        setLanguage('en', false);
      }
      return;
    }
  } catch (e) {}

  // 3. Fast immediate fallback: browser language
  const navLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
  if (navLang.startsWith('vi')) {
    setLanguage('vi', false);
  } else {
    setLanguage('en', false);
  }

  // 4. Background IP Geolocation Check (Cloudflare-backed edge API)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1600);
    const res = await fetch('https://api.country.is', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.country) {
        try {
          sessionStorage.setItem('hlp_country', data.country);
        } catch (e) {}

        // If user hasn't explicitly clicked a language button during load
        if (!localStorage.getItem('hlp_lang')) {
          if (data.country === 'VN') {
            setLanguage('vi', false);
          } else {
            setLanguage('en', false);
          }
        }
      }
    }
  } catch (err) {
    // Graceful secondary fallback: ipapi.co
    try {
      const ctrl = new AbortController();
      const tId = setTimeout(() => ctrl.abort(), 1400);
      const r2 = await fetch('https://ipapi.co/json/', { signal: ctrl.signal });
      clearTimeout(tId);
      if (r2.ok) {
        const d2 = await r2.json();
        if (d2 && d2.country_code) {
          try { sessionStorage.setItem('hlp_country', d2.country_code); } catch(e) {}
          if (!localStorage.getItem('hlp_lang') && d2.country_code === 'VN') {
            setLanguage('vi', false);
          }
        }
      }
    } catch (e2) {}
  }
}

// Theme handling (Light / Dark)
function setTheme(theme, persist = true) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', '#f8fafc');
  } else {
    document.documentElement.removeAttribute('data-theme');
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', '#090d16');
  }

  if (persist) {
    try {
      localStorage.setItem('hlp_theme', theme);
    } catch (e) {}
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  setTheme(next, true);
}

function initTheme() {
  try {
    const saved = localStorage.getItem('hlp_theme');
    if (saved) {
      setTheme(saved, false);
      return;
    }
  } catch (e) {}

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    setTheme('light', false);
  } else {
    setTheme('dark', false);
  }
}

// Copy Email Utility with localized feedback
function copyEmail(text, btnElement) {
  navigator.clipboard.writeText(text).then(() => {
    const originalText = btnElement.innerText;
    const copiedText = I18N_DICT[currentLang]?.copied_btn_text || 'Copied!';
    btnElement.innerText = copiedText;
    btnElement.style.color = '#34d399';

    setTimeout(() => {
      btnElement.innerText = I18N_DICT[currentLang]?.copy_btn_text || originalText;
      btnElement.style.color = '';
    }, 2000);
  }).catch(err => {
    console.error('Copy failed:', err);
  });
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  detectInitialLanguage();

  // Mobile drawer toggle
  const toggleBtn = document.getElementById('mobile-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (toggleBtn && mobileNav) {
    toggleBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });

    mobileNav.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.add('hidden');
      });
    });

    document.addEventListener('click', (e) => {
      if (!mobileNav.contains(e.target) && !toggleBtn.contains(e.target) && !mobileNav.classList.contains('hidden')) {
        mobileNav.classList.add('hidden');
      }
    });
  }

  // Theme toggle buttons (desktop + mobile)
  document.querySelectorAll('#theme-toggle, .mobile-theme-toggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  // Language switcher buttons (desktop + mobile)
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetLang = btn.getAttribute('data-lang');
      if (targetLang) {
        setLanguage(targetLang, true);
      }
    });
  });
});
