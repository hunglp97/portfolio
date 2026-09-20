// HLP Data — Portfolio Script (Taste-skill clean, theme switcher, i18n with IP auto-detection)

const I18N_DICT = {
  en: {
    nav_datasets: 'Datasets',
    nav_pipeline: 'Architecture',
    nav_stack: 'Stack',
    nav_experience: 'Track Record',
    nav_contact_btn: 'Contact',
    mobile_contact_me: 'Contact Me',

    hero_status: 'Available for Enterprise Scraping Contracts & Bespoke Feeds',
    hero_headline: 'Autonomous data pipelines & resilient web crawlers at scale.',
    hero_subtext: 'Specializing in high-throughput collection infrastructure that bypasses modern anti-bot systems (Cloudflare Turnstile, WAF) and delivers verified, 100% schema-compliant datasets directly to enterprise S3 data lakes.',
    hero_cta_explore: 'Explore Datasets',
    hero_cta_hire: 'Request Custom Feed',
    hero_cta_cv: 'Print CV (PDF)',

    metric_lbl_1: 'Verified Properties (PT & UK)',
    metric_lbl_2: 'Catalog SKUs (FMCG & Luxury)',
    metric_lbl_3: 'Buyer Acceptance Rate',
    metric_lbl_4: 'PII Risk (Strict Catalog Only)',

    terminal_title: 'buyer_audit.sh • live feed',
    terminal_tag_engine: 'Native AppleScript + CDP Engine',
    terminal_tag_s3: 'S3 Ingestion Ready',

    datasets_heading: 'Verified Commercial Datasets & Production Feeds',
    datasets_desc: 'Production-grade datasets extracted from high-friction targets, pre-audited against strict buyer schemas, and ready for immediate S3 deployment.',

    ds1_badge: 'Real Estate • Portugal',
    ds1_status: 'Commercial Ready',
    ds1_name: 'Idealista Portugal Nationwide Property Feed',
    ds1_summary: 'Comprehensive nationwide property intelligence across 13 Portuguese districts (Lisboa, Porto, Algarve, Setúbal, Braga, Coimbra, etc.). Features normalized square-meter pricing, exact bedroom/bathroom counts, floor levels, terrace/garage amenities, and clean geocodes.',
    ds1_th_prop: 'Sample Property',
    ds1_th_price: 'Price',
    ds1_th_area: 'Area',
    ds1_th_region: 'Region',
    ds1_preview_tag: '🔒 Sample Preview: 3 of 2,640 records',
    ds1_preview_footer: 'Full commercial feed delivered via private S3 / API',
    ds1_meta_records: '<strong>2,640</strong> records',
    ds1_meta_cols: '<strong>32</strong> columns',
    ds1_meta_freq: '<strong>Daily/Weekly</strong> feed',
    ds1_btn: 'Request Sample / License Feed',

    ds2_badge: 'Retail & FMCG • Portugal',
    ds2_status: 'Verified Commercial Feed',
    ds2_name: 'Continente Supermarket FMCG Intelligence Catalog',
    ds2_summary: "Granular pricing, brand taxonomy, and promotion intelligence for Portugal's leading supermarket chain. Features complete 3-level category hierarchy, markdown discount tracking, normalized unit prices (€/kg, €/L), and packaging dimensions.",
    ds2_th_sku: 'SKU / Product',
    ds2_th_std: 'Standard',
    ds2_th_promo: 'Promo',
    ds2_th_unit: 'Unit Price',
    ds2_preview_tag: '🔒 Sample Preview: 3 of 2,059 SKUs',
    ds2_preview_footer: 'Full commercial feed delivered via private S3 / API',
    ds2_meta_records: '<strong>2,059</strong> SKUs',
    ds2_meta_cols: '<strong>31</strong> columns',
    ds2_meta_s3: '<strong>S3 verified</strong>',
    ds2_btn: 'Request Sample / License Feed',

    ds3_badge: 'Luxury Fashion • Global',
    ds3_status: 'Buyer Audit: 100/100',
    ds3_name: 'Farfetch Global Luxury Fashion & Designer Feed',
    ds3_summary: 'Curated intelligence covering premier luxury fashion houses: Jacquemus, Valentino Garavani, Balmain, Bottega Veneta, Saint Laurent, Christian Louboutin, Tom Ford, and Moncler. Full 35-attribute FASHION-PDP schema tracking original prices, markdowns, multi-currency values, inventory status, and high-res media links.',
    ds3_th_brand: 'Brand / Item',
    ds3_th_price: 'Price (USD)',
    ds3_th_cat: 'Category',
    ds3_th_origin: 'Origin',
    ds3_preview_tag: '🔒 Sample Preview: 3 of 120 items',
    ds3_preview_footer: 'Full commercial feed delivered via private S3 / API',
    ds3_meta_records: '<strong>120</strong> verified SKUs',
    ds3_meta_cols: '<strong>35</strong> cols (FASHION-PDP)',
    ds3_meta_audit: '<strong>100 / 100</strong> Buyer Audit',
    ds3_btn: 'Request Sample / License Feed',

    ds4_badge: 'Real Estate • United Kingdom',
    ds4_status: 'Buyer Audit: 100/100',
    ds4_name: 'Rightmove London & Prime UK Property Feed',
    ds4_summary: 'Comprehensive market intelligence covering 500 verified properties across Greater London and Prime Central London. 100% compliant with REAL-ESTATE-BASIC schema across 32 mandatory attributes: GPS geocoordinates, floor area sqm, asking prices, bedroom/bathroom configurations, EPC energy ratings, and floor plan links.',
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
    ds4_btn: 'Request Sample / License Feed',

    pipeline_heading: 'Autonomous Pipeline Architecture',
    pipeline_desc: 'Engineered for resilience, zero human intervention, and deterministic cloud delivery.',
    step1_title: 'Resilient Ingestion Engine',
    step1_desc: 'Hybrid architecture combining Chrome DevTools Protocol (CDP) socket control with native OS-level IPC bridges. Neutralizes Cloudflare Turnstile, fingerprint entropy, and dynamic canvas challenges with realistic human behavioral jitter.',
    step2_title: 'Deterministic Schema Gates',
    step2_desc: 'Strict programmatic validation checks 100% of rows before delivery. Guarantees schema adherence (32-col Real Estate, 31-col FMCG, 35-col Luxury), strict positive pricing bounds, valid coordinates, and UTF-8-SIG semicolon formatting.',
    step3_title: 'Autonomous Cloud Delivery & Handshake',
    step3_desc: 'Direct automated delivery to buyer Amazon S3 storage buckets. The pipeline monitors automated acceptance receipts (approved.txt), handles retry backoffs, and logs settlement metrics automatically.',

    stack_heading: 'Core Technical Stack',
    stack_desc: 'Tools, frameworks, and protocols deployed across daily high-throughput extraction.',
    stack_cat1: 'Scraping & Automation',
    stack_cat2: 'Data Infrastructure & Cloud',
    stack_cat3: 'Marketplaces & Governance',
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
    stack_item_compliance: '<strong>GDPR & Ethical Crawling:</strong> 100% public catalog data, zero PII',
    stack_item_paypal: '<strong>PayPal Business:</strong> Verified commercial billing',

    record_heading: 'Track Record & Milestones',
    record_desc: 'Demonstrated reliability delivering commercial datasets to global marketplaces and enterprise buyers.',
    record_badge_active: 'Active',
    record_role1: 'Lead Data Engineer & Founder • HLP Data Studio',
    record_desc1: 'Architecting and commercializing high-throughput web collection systems for European retail and real estate portals. Maintained a 100% buyer acceptance rate on Amazon S3 cloud deliveries and established verified commercial seller standing.',
    record_role2: 'Software Automation & Backend Engineer',
    record_desc2: 'Engineered resilient backend scrapers, API integrations, and cloud ingestion workflows. Developed automated testing suites to validate live schema integrity and eliminate silent data rot in high-volume production jobs.',

    contact_heading: 'Need a custom dataset or specialized scraping pipeline?',
    contact_sub: 'Available for bespoke data engineering contracts, recurring marketplace cloud feeds, and anti-bot bypass consulting.',
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

    hero_status: 'Sẵn sàng nhận hợp đồng Trích xuất Dữ liệu & Luồng cấp Đám mây',
    hero_headline: 'Kiến trúc sư pipeline dữ liệu & web crawler quy mô lớn.',
    hero_subtext: 'Chuyên sâu xây dựng hạ tầng thu thập tự động hóa cao, vượt qua các rào cản anti-bot hiện đại (Cloudflare Turnstile, WAF) và bàn giao bộ dữ liệu chuẩn 100% schema trực tiếp vào data lake AWS S3.',
    hero_cta_explore: 'Xem Các Bộ Dữ Liệu',
    hero_cta_hire: 'Đặt Hàng Luồng Dữ Liệu',
    hero_cta_cv: 'Xuất CV Kỹ Sư (PDF)',

    metric_lbl_1: 'Bất động sản đã nghiệm thu (BĐN & Anh)',
    metric_lbl_2: 'Mã sản phẩm thương mại (Bán lẻ & Xa xỉ)',
    metric_lbl_3: 'Tỷ lệ Nghiệm thu từ Buyer',
    metric_lbl_4: 'Rủi ro PII (Dữ liệu danh mục 100% sạch)',

    terminal_title: 'buyer_audit.sh • đang vận hành',
    terminal_tag_engine: 'Động cơ Native AppleScript + CDP',
    terminal_tag_s3: 'Sẵn sàng đẩy dữ liệu S3',

    datasets_heading: 'Bộ Dữ Liệu Thương Mại & Luồng Cấp Đã Kiểm Định',
    datasets_desc: 'Các sản phẩm dữ liệu cấp thương mại bóc tách từ các hệ thống phức tạp, vượt qua kiểm định schema khắt khe của buyer và sẵn sàng đồng bộ trực tiếp vào AWS S3.',

    ds1_badge: 'Bất động sản • Bồ Đào Nha',
    ds1_status: 'Sẵn sàng thương mại',
    ds1_name: 'Dữ liệu Thị trường Bất động sản Toàn quốc Idealista Bồ Đào Nha',
    ds1_summary: 'Toàn bộ thông tin thị trường bất động sản cấu trúc hóa qua 13 quận trọng điểm Bồ Đào Nha (Lisboa, Porto, Algarve, Setúbal, Braga, Coimbra,...). Chuẩn hóa đơn giá theo m², số phòng ngủ/tắm, cao độ tầng, tiện ích sân vườn/gara và tọa độ địa lý.',
    ds1_th_prop: 'Mẫu bất động sản',
    ds1_th_price: 'Giá bán',
    ds1_th_area: 'Diện tích',
    ds1_th_region: 'Khu vực',
    ds1_preview_tag: '🔒 Xem mẫu: 3 trong 2.640 bản ghi',
    ds1_preview_footer: 'Luồng dữ liệu thương mại đầy đủ cấp qua AWS S3 / API bảo mật',
    ds1_meta_records: '<strong>2.640</strong> bản ghi',
    ds1_meta_cols: '<strong>32</strong> trường dữ liệu',
    ds1_meta_freq: 'Cập nhật <strong>Hàng ngày/Tuần</strong>',
    ds1_btn: 'Yêu Cầu File Mẫu / Cấp Bản Quyền',

    ds2_badge: 'Bán lẻ & FMCG • Bồ Đào Nha',
    ds2_status: 'Luồng thương mại đã duyệt',
    ds2_name: 'Danh mục Định giá & Khuyến mãi Siêu thị FMCG Continente',
    ds2_summary: 'Bóc tách chi tiết giá niêm yết, cấu trúc phân cấp danh mục 3 tầng và dữ liệu giảm giá của chuỗi siêu thị dẫn đầu Bồ Đào Nha. Hỗ trợ theo dõi biến động khuyến mãi, đơn giá quy đổi chuẩn (€/kg, €/L) và quy cách đóng gói.',
    ds2_th_sku: 'Sản phẩm / Mặt hàng',
    ds2_th_std: 'Giá gốc',
    ds2_th_promo: 'Khuyến mãi',
    ds2_th_unit: 'Đơn vị',
    ds2_preview_tag: '🔒 Xem mẫu: 3 trong 2.059 sản phẩm',
    ds2_preview_footer: 'Luồng dữ liệu thương mại đầy đủ cấp qua AWS S3 / API bảo mật',
    ds2_meta_records: '<strong>2.059</strong> mặt hàng',
    ds2_meta_cols: '<strong>31</strong> trường dữ liệu',
    ds2_meta_s3: '<strong>Đã kiểm duyệt S3</strong>',
    ds2_btn: 'Yêu Cầu File Mẫu / Cấp Bản Quyền',

    ds3_badge: 'Thời trang Xa xỉ • Toàn cầu',
    ds3_status: 'Nghiệm thu Buyer: 100/100',
    ds3_name: 'Luồng Dữ liệu Định giá Hàng Xa xỉ Toàn cầu Farfetch',
    ds3_summary: 'Dữ liệu tinh hoa từ các thương hiệu thời trang cao cấp thế giới: Jacquemus, Valentino, Balmain, Bottega Veneta, Saint Laurent, Christian Louboutin, Tom Ford và Moncler. Đáp ứng chuẩn xác 35 trường schema FASHION-PDP gồm giá gốc, giá sale, đa tiền tệ, tình trạng tồn kho và link ảnh gốc.',
    ds3_th_brand: 'Thương hiệu / Mặt hàng',
    ds3_th_price: 'Giá (USD)',
    ds3_th_cat: 'Phân loại',
    ds3_th_origin: 'Xuất xứ',
    ds3_preview_tag: '🔒 Xem mẫu: 3 trong 120 sản phẩm',
    ds3_preview_footer: 'Luồng dữ liệu thương mại đầy đủ cấp qua AWS S3 / API bảo mật',
    ds3_meta_records: '<strong>120</strong> sản phẩm xác thực',
    ds3_meta_cols: '<strong>35</strong> cột (FASHION-PDP)',
    ds3_meta_audit: '<strong>100 / 100</strong> Nghiệm thu Buyer',
    ds3_btn: 'Yêu Cầu File Mẫu / Cấp Bản Quyền',

    ds4_badge: 'Bất động sản • Vương quốc Anh',
    ds4_status: 'Nghiệm thu Buyer: 100/100',
    ds4_name: 'Dữ liệu Bất động sản London & Thị trường Trọng điểm Anh Rightmove',
    ds4_summary: 'Dữ liệu thị trường toàn diện bao gồm 500 bất động sản tại Greater London và trung tâm thủ đô London. Tuân thủ 100% schema REAL-ESTATE-BASIC với 32 thuộc tính bắt buộc: tọa độ GPS chính xác, diện tích sàn m², giá chào bán, phân bổ phòng ngủ/tắm, chứng chỉ năng lượng EPC và link sơ đồ nhà.',
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
    ds4_btn: 'Yêu Cầu File Mẫu / Cấp Bản Quyền',

    pipeline_heading: 'Kiến Trúc Pipeline Vận Hành Tự Động',
    pipeline_desc: 'Được thiết kế tối ưu cho tính bền bỉ, vận hành không cần con người can thiệp và bàn giao đám mây xác định.',
    step1_title: 'Động Cơ Thu Thập Kháng Anti-Bot',
    step1_desc: 'Kiến trúc lai kết hợp điều khiển socket cấp thấp Chrome DevTools (CDP) và cầu nối native AppleScript. Vô hiệu hóa Cloudflare Turnstile, fingerprint entropy và thử thách canvas động với độ trễ vi mô mô phỏng thao tác người dùng thật.',
    step2_title: 'Cổng Kiểm Định Schema Nghiêm Ngặt',
    step2_desc: 'Kiểm tra tự động 100% bản ghi trước khi xuất dữ liệu. Cam kết chuẩn xác tuyệt đối theo schema (32 cột BĐS, 31 cột FMCG, 35 cột Xa xỉ), biên độ giá dương, tọa độ chuẩn xác và định dạng UTF-8-SIG phân tách dấu chấm phẩy.',
    step3_title: 'Phân Phối S3 & Nghiệm Thu Tự Động',
    step3_desc: 'Dữ liệu nộp trực tiếp vào bucket Amazon S3 của sàn hoặc doanh nghiệp. Hệ thống tự động bắt tín hiệu nghiệm thu (approved.txt), tự xử lý cơ chế retry và ghi nhận giao dịch thanh toán không cần can thiệp thủ công.',

    stack_heading: 'Công Nghệ Lõi Vận Hành',
    stack_desc: 'Bộ công cụ, thư viện và giao thức thực chiến được triển khai trong các tác vụ thu thập tải trọng cao.',
    stack_cat1: 'Cào Dữ Liệu & Tự Động Hóa',
    stack_cat2: 'Hạ Tầng Dữ Liệu & Điện Toán Đám Mây',
    stack_cat3: 'Sàn Thương Mại & Chuẩn Pháp Lý',
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
    stack_item_compliance: '<strong>GDPR & Thu Thập Đạo Đức:</strong> 100% dữ liệu công khai, không thu thập PII',
    stack_item_paypal: '<strong>PayPal Business:</strong> Thanh toán thương mại đã xác thực',

    record_heading: 'Hồ Sơ Năng Lực & Kinh Nghiệm Thực Chiến',
    record_desc: 'Minh chứng năng lực qua các hợp đồng dữ liệu thương mại nộp thành công cho sàn quốc tế và đối tác doanh nghiệp.',
    record_badge_active: 'Hiện tại',
    record_role1: 'Kỹ sư Dữ liệu Trưởng & Nhà sáng lập • HLP Data Studio',
    record_desc1: 'Thiết kế kiến trúc và thương mại hóa hệ thống trích xuất dữ liệu quy mô lớn cho các cổng bán lẻ và bất động sản châu Âu. Duy trì tỷ lệ nghiệm thu 100% trên các đợt giao nhận Amazon S3 và xác lập uy tín thương mại doanh nghiệp.',
    record_role2: 'Kỹ sư Tự Động Hóa & Lập Trình Backend',
    record_desc2: 'Phát triển scraper backend, tích hợp API và luồng xử lý cloud ingestion. Xây dựng các bộ kiểm thử tự động xác thực tính toàn vẹn schema, triệt tiêu lỗi ngầm trong các tác vụ tải trọng lớn.',

    contact_heading: 'Cần đặt hàng dữ liệu riêng hoặc giải pháp vượt anti-bot?',
    contact_sub: 'Sẵn sàng tiếp nhận hợp đồng cào dữ liệu theo yêu cầu, luồng cấp dữ liệu định kỳ qua S3 và tư vấn giải pháp kỹ thuật chuyên sâu.',
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
