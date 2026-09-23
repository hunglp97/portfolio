// HLP Data — Portfolio Script (Taste-skill clean, theme switcher, i18n [EN | ES | PT] with IP auto-detection)

const LUSOPHONE_COUNTRIES = ['PT', 'BR', 'AO', 'MZ', 'CV', 'GW', 'ST', 'TL'];
const HISPANOPHONE_COUNTRIES = ['ES', 'MX', 'AR', 'CO', 'CL', 'PE', 'VE', 'EC', 'GT', 'CU', 'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PR', 'PA', 'UY', 'GQ'];

const I18N_DICT = {
  en: {
    nav_datasets: 'Datasets',
    nav_pipeline: 'Infrastructure',
    nav_stack: 'Stack',
    nav_experience: 'Reliability',
    nav_contact_btn: 'Contact',
    mobile_contact_me: 'Request Custom Dataset',

    hero_status: 'Production Web Data Infrastructure & Commercial Feeds',
    hero_headline: 'Reliable web data for business intelligence.',
    hero_subtext: 'Structured product, pricing, retail, and real-estate datasets with reliable refresh schedules, historical tracking, and production-ready delivery through API, CSV, JSON, or S3.',
    hero_cta_explore: 'Get Sample Data',
    hero_cta_hire: 'Request Custom Dataset',
    hero_cta_cv: 'Explore Use Cases',

    metric_lbl_1: 'Verified Properties (PT & UK)',
    metric_lbl_2: 'Catalog SKUs (FMCG & Luxury)',
    metric_lbl_3: 'Buyer Acceptance Rate',
    metric_lbl_4: 'PII Risk (Strict Catalog Only)',

    terminal_title: 'buyer_audit.sh • live feed',
    terminal_tag_engine: 'Resilient Collection Infrastructure',
    terminal_tag_s3: 'S3 Ingestion Ready',

    datasets_heading: 'Verified Commercial Datasets & Production Feeds',
    datasets_desc: 'Production-grade datasets extracted from complex targets, pre-audited against strict buyer schemas, and ready for immediate S3 deployment.',

    ds1_badge: 'Real Estate • Portugal',
    ds1_status: 'Commercial Ready',
    ds1_name: 'Idealista Portugal Nationwide Property Feed',
    ds1_summary: 'Nationwide sale-listing coverage across all 13 Portuguese districts (Lisboa, Porto, Faro, Setúbal, Braga, Coimbra and 7 more). 2,640 listings with 100% fill on asking price, price per m², floor area and bedroom count, plus advertised amenities. Median asking price €572,500. Geocoordinates, bathroom counts and agency attribution are not collected for this source.',
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
    ds2_preview_tag: '🔒 Sample Preview: 3 of 11,711 SKUs',
    ds2_preview_footer: 'Full commercial feed delivered via private S3 / API',
    ds2_meta_records: '<strong>11,711</strong> SKUs',
    ds2_meta_cols: '<strong>31</strong> columns',
    ds2_meta_s3: '<strong>S3 verified</strong>',
    ds2_btn: 'Request Sample / License Feed',

    ds3_badge: 'Luxury Handbags • Global',
    ds3_status: 'Buyer Audit: 100/100',
    ds3_name: 'Farfetch Luxury Handbag Catalog',
    ds3_summary: 'Curated catalog of 960 women’s handbag listings across 125 premier luxury designer brands including Jacquemus, Valentino Garavani, Balmain, Bottega Veneta, Saint Laurent, and Tom Ford. 35-attribute FASHION-PDP schema tracking transactional and original prices, SKU identifiers, and high-res media links.',
    ds3_th_brand: 'Brand / Item',
    ds3_th_price: 'Price (USD)',
    ds3_th_cat: 'Category',
    ds3_th_origin: 'Origin',
    ds3_preview_tag: '🔒 Sample Preview: 3 of 960 items',
    ds3_preview_footer: 'Full commercial feed delivered via private S3 / API',
    ds3_meta_records: '<strong>960</strong> handbag SKUs',
    ds3_meta_cols: '<strong>35</strong> cols (FASHION-PDP)',
    ds3_meta_audit: '<strong>100 / 100</strong> Buyer Audit',
    ds3_btn: 'Request Sample / License Feed',

    ds4_badge: 'Real Estate • United Kingdom',
    ds4_status: 'Buyer Audit: 100/100',
    ds4_name: 'Rightmove UK National Real Estate Census',
    ds4_summary: 'A complete national census of the UK residential sale market: 544,502 verified listings covering 100% of all 3,121 postal outcodes across England, Scotland and Wales — 402 regions and 61 property types. 100% compliant with REAL-ESTATE-BASIC across 32 attributes: WGS84 geocoordinates, floor area in m², asking and original prices, price per m², bedroom and bathroom counts, and listing agency. Zero duplicate listing IDs; every product URL absolute.',
    ds4_th_loc: 'Property Location',
    ds4_th_price: 'Price',
    ds4_th_beds: 'Beds',
    ds4_th_agency: 'Agency',
    ds4_preview_tag: '🔒 Sample Preview: 3 of 544,502 listings',
    ds4_preview_footer: 'Full commercial feed delivered via private S3 / API',
    ds4_meta_records: '<strong>544,502</strong> verified properties',
    ds4_meta_cols: '<strong>32</strong> cols (REAL-ESTATE-BASIC)',
    ds4_meta_audit: '<strong>100 / 100</strong> Buyer Audit',
    ds4_meta_gps: '<strong>GPS + 3,121 Outcodes</strong>',
    ds4_btn: 'Request Sample / License Feed',

    pipeline_heading: 'Data Infrastructure & Quality Pipeline',
    pipeline_desc: 'Engineered for resilience, continuous schema validation, and deterministic cloud delivery.',
    step1_title: 'Resilient Collection Infrastructure',
    step1_desc: 'High-throughput collection infrastructure engineered to handle dynamic website structures and large-scale public data feeds with continuous reliability.',
    step2_title: 'Deterministic Schema & Quality Gates',
    step2_desc: 'Strict programmatic validation audits 100% of rows before delivery. Guarantees schema adherence (32-col Real Estate, 31-col FMCG, 35-col Luxury), strict positive pricing bounds, valid coordinates, and UTF-8-SIG semicolon formatting.',
    step3_title: 'Enterprise Cloud Delivery & Synchronization',
    step3_desc: 'Direct automated delivery to buyer Amazon S3 storage buckets or REST API endpoints. Automated acceptance verification monitors receipts (approved.txt), handles retry backoffs, and logs delivery metrics.',

    stack_heading: 'Core Technical Stack',
    stack_desc: 'Tools, frameworks, and protocols deployed across daily high-throughput extraction.',
    stack_cat1: 'Data Extraction & Automation',
    stack_cat2: 'Data Infrastructure & Cloud',
    stack_cat3: 'Marketplaces & Governance',
    stack_item_playwright: '<strong>Playwright & Puppeteer:</strong> Headless & dynamic DOM collection',
    stack_item_cdp: '<strong>CDP (Chrome DevTools Protocol):</strong> Resilient browser automation',
    stack_item_applescript: '<strong>Native IPC Bridges:</strong> High-reliability automation pipelines',
    stack_item_bs4: '<strong>BeautifulSoup4 / lxml / Scrapy:</strong> High-throughput DOM parsers',
    stack_item_s3: '<strong>Amazon S3 & AWS SDK (Boto3):</strong> Cloud data lake delivery',
    stack_item_pandas: '<strong>Pandas & NumPy:</strong> Normalization & outlier filtration',
    stack_item_db: '<strong>PostgreSQL & SQLite:</strong> Local staging & deduplication',
    stack_item_docker: '<strong>Docker & Bash:</strong> Autonomous daemons & scheduled cron',
    stack_item_databoutique: '<strong>Enterprise Data Feeds:</strong> High-volume commercial data feeds & automated delivery',
    stack_item_datarade: '<strong>Datarade:</strong> Provider pipeline onboarding & enterprise feeds',
    stack_item_compliance: '<strong>GDPR & Ethical Crawling:</strong> 100% public catalog data, zero PII',
    stack_item_paypal: '<strong>PayPal Business:</strong> Verified commercial invoicing',

    record_heading: 'Track Record & Milestones',
    record_desc: 'Demonstrated reliability delivering commercial datasets to global marketplaces and enterprise buyers.',
    record_badge_active: 'Active',
    record_role1: 'Lead Data Engineer & Founder • HLP Data',
    record_desc1: 'Architecting and commercializing high-throughput web collection systems for European retail and real estate portals. Maintained a 100% buyer acceptance rate on Amazon S3 cloud deliveries and established verified commercial seller standing.',
    record_role2: 'Software Automation & Backend Engineer',
    record_desc2: 'Engineered resilient backend data collectors, API integrations, and cloud ingestion workflows. Developed automated testing suites to validate live schema integrity and eliminate silent data rot in high-volume production jobs.',

    contact_heading: 'Need data from a specific public website?',
    contact_sub: 'Tell us the websites, schemas, refresh frequencies, and delivery formats required for your business intelligence.',
    contact_lbl_email: 'Commercial Inquiries',
    contact_lbl_paypal: 'Commercial Invoicing',
    contact_badge_paypal: 'Verified Merchant',
    contact_lbl_github: 'Open Source Repositories',
    contact_badge_github: 'Open Source',
    contact_cta_btn: 'Request Custom Dataset',

    footer_copy: '&copy; 2026 <strong>HLP Data</strong> &bull; Commercial web data infrastructure. All rights reserved.',
    footer_top: 'Back to top',
    footer_terms: 'Terms & Compliance',
    footer_privacy: 'Privacy Policy',

    copy_btn_text: 'Copy',
    copied_btn_text: 'Copied!',

    btn_inspect_schema: 'Inspect Schema & Sample',
    modal_tab_sample: 'Sample Data (10 Rows)',
    modal_tab_schema: 'Schema Dictionary & SLA',
    modal_btn_download: 'Download Sample CSV (20 Rows)',
    modal_btn_license: 'License Full Commercial Feed',

    nav_analytics: 'Intelligence',
    nav_explore: 'Live Explorer',
    hero_cta_analytics: 'Live Intelligence',
    analytics_badge: 'Production Data Analytics',
    analytics_heading: 'Market Intelligence & Econometric Trends',
    analytics_desc: 'Going beyond raw CSV scraping: aggregated price densities, cross-district disparity, and retail markdown dynamics computed directly from verified census feeds.',
    chart1_title: 'Portugal Housing Disparity: Median Asking Price & €/m² by District',
    chart1_insight: '<strong>Key Market Insight:</strong> Lisbon commands a 43.2% premium over Porto (€4,747/m²) and nearly 4x over the central interior. 100% census coverage across all 13 major Portuguese districts.',
    chart2_title: 'Supermarket Retail Intelligence: Promotion Rate vs Discount Depth',
    chart2_insight: '<strong>Key Retail Insight:</strong> Grocery pricing strategy exhibits sharp bifurcation: staples (Dairy, Household) maintain strict price discipline, whereas infant care and alcohol utilize aggressive loss-leader promotional markdowns.',
    analytics_cta_title: 'Looking for Bespoke Market Intelligence or Custom Hedonic Models?',
    analytics_cta_desc: 'We deliver customized time-series inflation tracking, automated price disparity alerts, and institutional data pipelines tailored for hedge funds and retail analysts.',
    analytics_cta_btn: 'Request Custom Analytics Feed'
  },

  es: {
    nav_datasets: 'Datasets',
    nav_analytics: 'Inteligencia',
    nav_explore: 'Explorador en Vivo',
    nav_pipeline: 'Infraestructura',
    nav_stack: 'Tecnologías',
    nav_experience: 'Fiabilidad',
    nav_contact_btn: 'Contacto',
    mobile_contact_me: 'Solicitar Dataset a Medida',

    hero_status: 'Infraestructura de Datos Web y Feeds Comerciales',
    hero_headline: 'Datos web confiables para inteligencia empresarial.',
    hero_subtext: 'Datasets estructurados de productos, precios, retail e inmuebles con frecuencias de actualización confiables y entrega lista para producción vía API, CSV, JSON o S3.',
    hero_cta_explore: 'Obtener Muestra',
    hero_cta_hire: 'Solicitar Dataset a Medida',
    hero_cta_cv: 'Ver Casos de Uso',

    metric_lbl_1: 'Inmuebles Verificados (PT y UK)',
    metric_lbl_2: 'SKUs en Catálogo (FMCG y Lujo)',
    metric_lbl_3: 'Tasa de Aceptación de Compradores',
    metric_lbl_4: 'Riesgo de PII (Exclusivo Catálogo Público)',

    terminal_title: 'buyer_audit.sh • en ejecución',
    terminal_tag_engine: 'Infraestructura de Recolección Resiliente',
    terminal_tag_s3: 'Listo para Ingesta S3',

    datasets_heading: 'Datasets Comerciales Verificados y Feeds en Producción',
    datasets_desc: 'Datasets de grado empresarial extraídos de portales complejos, auditados frente a estrictos esquemas de compradores y listos para integración S3.',

    ds1_badge: 'Inmobiliario • Portugal',
    ds1_status: 'Listo Comercial',
    ds1_name: 'Feed Inmobiliario Nacional Idealista Portugal',
    ds1_summary: 'Cobertura de anuncios de venta en los 13 distritos de Portugal (Lisboa, Oporto, Faro, Setúbal, Braga, Coímbra y 7 más). 2.640 anuncios con 100% de cobertura en precio, precio por m², superficie y dormitorios, además de las comodidades anunciadas. Precio mediano 572.500 €. No se recogen geocoordenadas, número de baños ni la agencia para esta fuente.',
    ds1_th_prop: 'Inmueble de Muestra',
    ds1_th_price: 'Precio',
    ds1_th_area: 'Superficie',
    ds1_th_region: 'Región',
    ds1_preview_tag: '🔒 Vista previa: 3 de 2.640 registros',
    ds1_preview_footer: 'Feed comercial completo entregado vía S3 privado / API',
    ds1_meta_records: '<strong>2.640</strong> registros',
    ds1_meta_cols: '<strong>32</strong> columnas',
    ds1_meta_freq: 'Feed <strong>Diario/Semanal</strong>',
    ds1_btn: 'Solicitar Muestra / Licencia',

    ds2_badge: 'Retail & FMCG • Portugal',
    ds2_status: 'Feed Comercial Verificado',
    ds2_name: 'Catálogo de Inteligencia FMCG Continente',
    ds2_summary: 'Datos de precios, taxonomía de marcas y promociones de la cadena de supermercados líder en Portugal. Jerarquía de categorías en 3 niveles, seguimiento de descuentos promocionales, precios unitarios (€/kg, €/L) y dimensiones de empaque.',
    ds2_th_sku: 'SKU / Producto',
    ds2_th_std: 'Estándar',
    ds2_th_promo: 'Promo',
    ds2_th_unit: 'Precio Unitario',
    ds2_preview_tag: '🔒 Vista previa: 3 de 11.711 SKUs',
    ds2_preview_footer: 'Feed comercial completo entregado vía S3 privado / API',
    ds2_meta_records: '<strong>11.711</strong> SKUs',
    ds2_meta_cols: '<strong>31</strong> columnas',
    ds2_meta_s3: '<strong>Verificado en S3</strong>',
    ds2_btn: 'Solicitar Muestra / Licencia',

    ds3_badge: 'Bolsos de Lujo • Global',
    ds3_status: 'Auditoría Comprador: 100/100',
    ds3_name: 'Catálogo de Bolsos de Lujo Farfetch',
    ds3_summary: 'Catálogo seleccionado de 960 bolsos de lujo para mujer de 125 marcas destacadas como Jacquemus, Valentino Garavani, Balmain, Bottega Veneta y Saint Laurent. Esquema FASHION-PDP de 35 atributos con precios transaccionales y de catálogo, identificadores SKU y enlaces a imágenes de alta resolución.',
    ds3_th_brand: 'Marca / Artículo',
    ds3_th_price: 'Precio (USD)',
    ds3_th_cat: 'Categoría',
    ds3_th_origin: 'Origen',
    ds3_preview_tag: '🔒 Vista previa: 3 de 960 bolsos',
    ds3_preview_footer: 'Feed comercial completo entregado vía S3 privado / API',
    ds3_meta_records: '<strong>960</strong> SKUs de bolsos',
    ds3_meta_cols: '<strong>35</strong> cols (FASHION-PDP)',
    ds3_meta_audit: '<strong>100 / 100</strong> Auditoría Comprador',
    ds3_btn: 'Solicitar Muestra / Licencia',

    ds4_badge: 'Inmobiliario • Reino Unido',
    ds4_status: 'Auditoría Comprador: 100/100',
    ds4_name: 'Censo Nacional Inmobiliario del Reino Unido (Rightmove)',
    ds4_summary: 'Censo nacional completo del mercado residencial de venta del Reino Unido: 544.502 anuncios verificados que cubren el 100% de los 3.121 códigos postales de Inglaterra, Escocia y Gales — 402 regiones y 61 tipos de propiedad. 100% conforme con REAL-ESTATE-BASIC en 32 atributos: coordenadas WGS84, m² habitables, precio de venta y precio original, precio por m², dormitorios y baños, e inmobiliaria anunciante. Cero IDs duplicados.',
    ds4_th_loc: 'Ubicación Inmueble',
    ds4_th_price: 'Precio',
    ds4_th_beds: 'Dormitorios',
    ds4_th_agency: 'Agencia',
    ds4_preview_tag: '🔒 Vista previa: 3 de 544.502 anuncios',
    ds4_preview_footer: 'Feed comercial completo entregado vía S3 privado / API',
    ds4_meta_records: '<strong>544.502</strong> propiedades verificadas',
    ds4_meta_cols: '<strong>32</strong> cols (REAL-ESTATE-BASIC)',
    ds4_meta_audit: '<strong>100 / 100</strong> Auditoría Comprador',
    ds4_meta_gps: '<strong>GPS + 3.121 Outcodes</strong>',
    ds4_btn: 'Solicitar Muestra / Licencia',

    pipeline_heading: 'Infraestructura de Datos y Control de Calidad',
    pipeline_desc: 'Diseñada para resiliencia, validación continua de esquemas y entrega determinista en la nube.',
    step1_title: 'Infraestructura de Recolección Resiliente',
    step1_desc: 'Infraestructura de extracción de alto rendimiento diseñada para gestionar estructuras web dinámicas y feeds de datos públicos a gran escala con fiabilidad continua.',
    step2_title: 'Puertas Deterministas de Calidad y Esquema',
    step2_desc: 'Filtros automatizados auditan el 100% de las filas antes de su entrega. Garantiza la adherencia al esquema (32 cols Inmobiliario, 31 cols FMCG, 35 cols Lujo), límites de precios positivos, geocódigos válidos y codificación UTF-8-SIG.',
    step3_title: 'Entrega Cloud S3 y Sincronización Empresarial',
    step3_desc: 'Entrega automatizada directa a buckets de almacenamiento Amazon S3 o endpoints REST API. Verificación de recibos (approved.txt), gestión de reintentos y monitorización de entrega.',

    stack_heading: 'Tecnologías Centrales',
    stack_desc: 'Herramientas, frameworks y protocolos implementados en operaciones diarias de extracción intensiva.',
    stack_cat1: 'Extracción de Datos y Automatización',
    stack_cat2: 'Infraestructura de Datos y Cloud',
    stack_cat3: 'Mercados y Gobernanza',
    stack_item_playwright: '<strong>Playwright & Puppeteer:</strong> Recolección headless y DOM dinámico',
    stack_item_cdp: '<strong>CDP (Chrome DevTools Protocol):</strong> Automatización de navegadores resiliente',
    stack_item_applescript: '<strong>Puentes IPC Nativos:</strong> Pipelines de alta fiabilidad',
    stack_item_bs4: '<strong>BeautifulSoup4 / lxml / Scrapy:</strong> Parsers DOM de alto rendimiento',
    stack_item_s3: '<strong>Amazon S3 & AWS SDK (Boto3):</strong> Entrega en data lakes cloud',
    stack_item_pandas: '<strong>Pandas & NumPy:</strong> Normalización y filtrado de anomalías',
    stack_item_db: '<strong>PostgreSQL & SQLite:</strong> Almacenamiento intermedio y desduplicación',
    stack_item_docker: '<strong>Docker & Bash:</strong> Demonios autónomos y cron programado',
    stack_item_databoutique: '<strong>Enterprise Data Feeds:</strong> Feeds de datos comerciales de alto volumen y entrega automatizada',
    stack_item_datarade: '<strong>Datarade:</strong> Integración de proveedores y feeds corporativos',
    stack_item_compliance: '<strong>GDPR y Scraping Ético:</strong> 100% datos de catálogos públicos, cero PII',
    stack_item_paypal: '<strong>PayPal Business:</strong> Facturación comercial verificada',

    record_heading: 'Trayectoria y Logros',
    record_desc: 'Fiabilidad demostrada en la entrega de datasets comerciales a marketplaces globales y compradores institucionales.',
    record_badge_active: 'Activo',
    record_role1: 'Lead Data Engineer & Fundador • HLP Data',
    record_desc1: 'Diseño y comercialización de sistemas de extracción de alto rendimiento para portales inmobiliarios y de retail europeos. Mantenimiento de una tasa de aceptación del comprador del 100% en entregas cloud Amazon S3 y estatus comercial verificado.',
    record_role2: 'Ingeniero de Automatización de Software y Backend',
    record_desc2: 'Desarrollo de recolectores de datos backend resilientes, integraciones de API y flujos de ingesta en la nube. Creación de suites de pruebas automatizadas para validar la integridad de esquemas.',

    contact_heading: '¿Necesita datos de un sitio web público específico?',
    contact_sub: 'Indíquenos las fuentes web, esquemas, frecuencia de actualización y formato de entrega que necesita su empresa.',
    contact_lbl_email: 'Consultas Comerciales',
    contact_lbl_paypal: 'Facturación Comercial',
    contact_badge_paypal: 'Empresa Verificada',
    contact_lbl_github: 'Repositorios Open Source',
    contact_badge_github: 'Código Abierto',
    contact_cta_btn: 'Solicitar Dataset a Medida',

    footer_copy: '&copy; 2026 <strong>HLP Data</strong> &bull; Infraestructura comercial de datos web. Todos los derechos reservados.',
    footer_top: 'Volver arriba',
    footer_terms: 'Términos y Conformidad',
    footer_privacy: 'Política de Privacidad',

    copy_btn_text: 'Copiar',
    copied_btn_text: '¡Copiado!',

    btn_inspect_schema: 'Examinar Schema y Muestra',
    modal_tab_sample: 'Datos de Muestra (10 Filas)',
    modal_tab_schema: 'Diccionario de Schema y SLA',
    modal_btn_download: 'Descargar CSV de Muestra (20 Filas)',
    modal_btn_license: 'Licenciar Feed Comercial Completo',

    nav_analytics: 'Inteligencia',
    hero_cta_analytics: 'Inteligencia en Vivo',
    analytics_badge: 'Analítica de Datos en Producción',
    analytics_heading: 'Inteligencia de Mercado y Tendencias Econométricas',
    analytics_desc: 'Más allá de la extracción de CSV en bruto: densidades de precios agregadas, disparidad interdistrital y dinámicas de promociones calculadas desde feeds verificados.',
    chart1_title: 'Disparidad Inmobiliaria en Portugal: Precio Mediano y €/m² por Distrito',
    chart1_insight: '<strong>Información Clave:</strong> Lisboa lidera con una prima del 43,2% sobre Oporto (4.747 €/m²) y casi 4 veces sobre el interior central. Cobertura del 100% en los 13 distritos principales.',
    chart2_title: 'Inteligencia de Retail: Tasa de Promoción vs Profundidad de Descuento',
    chart2_insight: '<strong>Información Clave:</strong> La fijación de precios en supermercados muestra una bifurcación clara: los productos básicos mantienen disciplina estricta de precios, mientras que bebés y bebidas aplican descuentos agresivos.',
    analytics_cta_title: '¿Busca Inteligencia de Mercado Personalizada o Modelos Hedónicos?',
    analytics_cta_desc: 'Desarrollamos seguimiento de inflación temporal, alertas automatizadas de disparidad de precios y pipelines de datos institucionales a medida.',
    analytics_cta_btn: 'Solicitar Feed de Analítica a Medida'
  },

  pt: {
    nav_datasets: 'Datasets',
    nav_analytics: 'Inteligência',
    nav_explore: 'Explorador em Direto',
    nav_pipeline: 'Infraestrutura',
    nav_stack: 'Tecnologias',
    nav_experience: 'Fiabilidade',
    nav_contact_btn: 'Contacto',
    mobile_contact_me: 'Solicitar Dataset Dedicado',

    hero_status: 'Infraestrutura de Dados Web e Feeds Comerciais',
    hero_headline: 'Dados web confiáveis para inteligência de negócios.',
    hero_subtext: 'Conjuntos de dados estruturados de produtos, preços, retalho e imobiliário com frequências de atualização fiáveis e entrega para produção via API, CSV, JSON ou S3.',
    hero_cta_explore: 'Obter Amostra',
    hero_cta_hire: 'Solicitar Dataset Dedicado',
    hero_cta_cv: 'Ver Casos de Uso',

    metric_lbl_1: 'Imóveis Verificados (PT & UK)',
    metric_lbl_2: 'SKUs em Catálogo (FMCG & Luxo)',
    metric_lbl_3: 'Taxa de Aceitação do Comprador',
    metric_lbl_4: 'Risco de PII (Exclusivo Catálogo Público)',

    terminal_title: 'buyer_audit.sh • em execução',
    terminal_tag_engine: 'Infraestrutura de Recolha Resiliente',
    terminal_tag_s3: 'Pronto para Ingestão S3',

    datasets_heading: 'Conjuntos de Dados Comerciais & Feeds em Produção',
    datasets_desc: 'Conjuntos de dados de nível empresarial extraídos de portais complexos, auditados contra esquemas rigorosos de compradores e prontos para sincronização S3.',

    ds1_badge: 'Imobiliário • Portugal',
    ds1_status: 'Pronto Comercial',
    ds1_name: 'Feed Imobiliário Nacional Idealista Portugal',
    ds1_summary: 'Cobertura de anúncios de venda nos 13 distritos de Portugal (Lisboa, Porto, Faro, Setúbal, Braga, Coimbra e mais 7). 2.640 anúncios com 100% de preenchimento em preço, preço por m², área e número de quartos, além das comodidades anunciadas. Preço mediano 572.500 €. Geocoordenadas, casas de banho e agência não são recolhidas nesta fonte.',
    ds1_th_prop: 'Imóvel de Amostra',
    ds1_th_price: 'Preço',
    ds1_th_area: 'Área',
    ds1_th_region: 'Região',
    ds1_preview_tag: '🔒 Pré-visualização: 3 de 2.640 registos',
    ds1_preview_footer: 'Feed comercial completo entregue via S3 privado / API',
    ds1_meta_records: '<strong>2.640</strong> registos',
    ds1_meta_cols: '<strong>32</strong> colunas',
    ds1_meta_freq: 'Feed <strong>Diário/Semanal</strong>',
    ds1_btn: 'Solicitar Amostra / Licença',

    ds2_badge: 'Retalho & FMCG • Portugal',
    ds2_status: 'Feed Comercial Verificado',
    ds2_name: 'Catálogo de Inteligência FMCG Continente',
    ds2_summary: 'Inteligência granular de preços, marcas e promoções para a principal cadeia de supermercados em Portugal. Estrutura de categorias em 3 níveis, acompanhamento de descontos, preços unitários normalizados (€/kg, €/L) e dimensões de embalagem.',
    ds2_th_sku: 'SKU / Produto',
    ds2_th_std: 'Padrão',
    ds2_th_promo: 'Promo',
    ds2_th_unit: 'Preço Unitário',
    ds2_preview_tag: '🔒 Pré-visualização: 3 de 11.711 SKUs',
    ds2_preview_footer: 'Feed comercial completo entregue via S3 privado / API',
    ds2_meta_records: '<strong>11.711</strong> SKUs',
    ds2_meta_cols: '<strong>31</strong> colunas',
    ds2_meta_s3: '<strong>Verificado no S3</strong>',
    ds2_btn: 'Solicitar Amostra / Licença',

    ds3_badge: 'Malas de Luxo • Global',
    ds3_status: 'Auditoria Comprador: 100/100',
    ds3_name: 'Catálogo de Malas de Luxo Farfetch',
    ds3_summary: 'Catálogo selecionado de 960 malas de luxo femininas de 125 marcas de topo como Jacquemus, Valentino Garavani, Balmain, Bottega Veneta e Saint Laurent. Esquema FASHION-PDP de 35 atributos com preços transacionais e originais, identificadores SKU e imagens de alta resolução.',
    ds3_th_brand: 'Marca / Artigo',
    ds3_th_price: 'Preço (USD)',
    ds3_th_cat: 'Categoria',
    ds3_th_origin: 'Origem',
    ds3_preview_tag: '🔒 Pré-visualização: 3 de 960 malas',
    ds3_preview_footer: 'Feed comercial completo entregue via S3 privado / API',
    ds3_meta_records: '<strong>960</strong> SKUs de malas',
    ds3_meta_cols: '<strong>35</strong> cols (FASHION-PDP)',
    ds3_meta_audit: '<strong>100 / 100</strong> Auditoria Comprador',
    ds3_btn: 'Solicitar Amostra / Licença',

    ds4_badge: 'Imobiliário • Reino Unido',
    ds4_status: 'Auditoria Comprador: 100/100',
    ds4_name: 'Censo Nacional Imobiliário do Reino Unido (Rightmove)',
    ds4_summary: 'Censo nacional completo do mercado residencial de venda do Reino Unido: 544.502 anúncios verificados cobrindo 100% dos 3.121 códigos postais de Inglaterra, Escócia e País de Gales — 402 regiões e 61 tipos de imóvel. 100% compatível com REAL-ESTATE-BASIC em 32 atributos: coordenadas WGS84, m² de área útil, preço de venda e preço original, preço por m², quartos e casas de banho, e agência anunciante. Zero IDs duplicados.',
    ds4_th_loc: 'Localização do Imóvel',
    ds4_th_price: 'Preço',
    ds4_th_beds: 'Quartos',
    ds4_th_agency: 'Agência',
    ds4_preview_tag: '🔒 Pré-visualização: 3 de 544.502 anúncios',
    ds4_preview_footer: 'Feed comercial completo entregue via S3 privado / API',
    ds4_meta_records: '<strong>544.502</strong> imóveis verificados',
    ds4_meta_cols: '<strong>32</strong> cols (REAL-ESTATE-BASIC)',
    ds4_meta_audit: '<strong>100 / 100</strong> Auditoria Comprador',
    ds4_meta_gps: '<strong>GPS + 3.121 Outcodes</strong>',
    ds4_btn: 'Solicitar Amostra / Licença',

    pipeline_heading: 'Infraestrutura de Dados & Controlo de Qualidade',
    pipeline_desc: 'Concebida para resiliência, validação contínua de esquemas e entrega determinística na cloud.',
    step1_title: 'Infraestrutura de Recolha Resiliente',
    step1_desc: 'Infraestrutura de recolha de alto débito concebida para gerir estruturas web dinâmicas e feeds de dados públicos em grande escala com fiabilidade contínua.',
    step2_title: 'Validação Determinística de Qualidade & Esquema',
    step2_desc: 'Pontos de controlo automatizados auditam 100% das linhas antes da entrega. Garante conformidade total de esquema (32 cols Imobiliário, 31 cols FMCG, 35 cols Luxo), limites de preços positivos, coordenadas válidas e codificação UTF-8-SIG.',
    step3_title: 'Entrega Cloud S3 & Sincronização Empresarial',
    step3_desc: 'Entrega direta automatizada nos buckets de armazenamento Amazon S3 ou endpoints REST API do comprador. Verificação de recibos (approved.txt), gestão de repetições e monitorização contínua de entrega.',

    stack_heading: 'Tecnologias Centrais',
    stack_desc: 'Ferramentas, bibliotecas e protocolos implementados em operações diárias de extração de alto débito.',
    stack_cat1: 'Extração de Dados & Automação',
    stack_cat2: 'Infraestrutura de Dados & Cloud',
    stack_cat3: 'Mercados & Governança',
    stack_item_playwright: '<strong>Playwright & Puppeteer:</strong> Recolha headless e DOM dinâmico',
    stack_item_cdp: '<strong>CDP (Chrome DevTools Protocol):</strong> Automação de browser resiliente',
    stack_item_applescript: '<strong>Pontes IPC Nativas:</strong> Pipelines de alta fiabilidade',
    stack_item_bs4: '<strong>BeautifulSoup4 / lxml / Scrapy:</strong> Parsers DOM de alto débito',
    stack_item_s3: '<strong>Amazon S3 & AWS SDK (Boto3):</strong> Entrega em data lakes na cloud',
    stack_item_pandas: '<strong>Pandas & NumPy:</strong> Normalização e filtragem de anomalias',
    stack_item_db: '<strong>PostgreSQL & SQLite:</strong> Armazenamento local e desduplicação',
    stack_item_docker: '<strong>Docker & Bash:</strong> Daemons autónomos e cron agendado',
    stack_item_databoutique: '<strong>Enterprise Data Feeds:</strong> Feeds comerciais de grande volume e entrega automatizada',
    stack_item_datarade: '<strong>Datarade:</strong> Integração de fornecedores e feeds corporativos',
    stack_item_compliance: '<strong>GDPR & Scraping Ético:</strong> 100% dados de catálogo público, zero PII',
    stack_item_paypal: '<strong>PayPal Business:</strong> Faturação comercial verificada',

    record_heading: 'Trajetória & Marcos',
    record_desc: 'Fiabilidade comprovada no fornecimento de datasets comerciais a marketplaces globais e compradores institucionais.',
    record_badge_active: 'Ativo',
    record_role1: 'Lead Data Engineer & Fundador • HLP Data',
    record_desc1: 'Conceção e comercialização de sistemas de extração de dados de alto rendimento para os principais portais europeus de retalho e imobiliário. Manutenção de taxa de aceitação de 100% nas entregas na cloud Amazon S3 e estatuto comercial verificado.',
    record_role2: 'Engenheiro de Automação de Software & Backend',
    record_desc2: 'Desenvolvimento de coletores de dados backend resilientes, integrações de API e fluxos de ingestão cloud. Criação de testes automatizados para validar a integridade de esquemas.',

    contact_heading: 'Necessita de dados de um website público específico?',
    contact_sub: 'Indique-nos as fontes web, esquemas, frequência de atualização e formato de entrega necessários para o seu negócio.',
    contact_lbl_email: 'Consultas Comerciais',
    contact_lbl_paypal: 'Faturação Comercial',
    contact_badge_paypal: 'Empresa Verificada',
    contact_lbl_github: 'Repositórios Open Source',
    contact_badge_github: 'Código Aberto',
    contact_cta_btn: 'Solicitar Dataset Dedicado',

    footer_copy: '&copy; 2026 <strong>HLP Data</strong> &bull; Infraestrutura comercial de dados web. Todos os direitos reservados.',
    footer_top: 'Volver ao topo',
    footer_terms: 'Termos & Conformidade',
    footer_privacy: 'Política de Privacidade',

    copy_btn_text: 'Copiar',
    copied_btn_text: 'Copiado!',

    btn_inspect_schema: 'Inspecionar Schema & Amostra',
    modal_tab_sample: 'Dados de Amostra (10 Linhas)',
    modal_tab_schema: 'Dicionário de Schema & SLA',
    modal_btn_download: 'Descarregar CSV de Amostra (20 Linhas)',
    modal_btn_license: 'Licenciar Feed Comercial Completo',

    hero_cta_analytics: 'Inteligência em Direto',
    analytics_badge: 'Análise de Dados em Produção',
    analytics_heading: 'Inteligência de Mercado & Tendências Econométricas',
    analytics_desc: 'Muito além da extração simples de CSV: densidades agregadas de preços, disparidades distritais e dinâmicas promocionais calculadas diretamente de feeds censitários validados.',
    chart1_title: 'Disparidade Imobiliária em Portugal: Preço Mediano & €/m² por Distrito',
    chart1_insight: '<strong>Informação de Mercado:</strong> Lisboa apresenta um prémio de 43,2% sobre o Porto (4.747 €/m²) e quase 4x sobre o interior centro. Cobertura censitária de 100% nos 13 distritos principais.',
    chart2_title: 'Inteligência de Retalho: Taxa Promocional vs Profundidade de Desconto',
    chart2_insight: '<strong>Informação de Retalho:</strong> A estratégia de preços em supermercados revela uma bifurcação nítida: bens de primeira necessidade mantêm disciplina de preços, enquanto cuidados de bebé e bebidas utilizam descontos agressivos.',
    analytics_cta_title: 'Procura Inteligência de Mercado Dedicada ou Modelos Hedónicos?',
    analytics_cta_desc: 'Entregamos monitorização de inflação temporal, alertas automatizados de disparidade de preços e pipelines de dados institucionais para fundos e analistas de retalho.',
    analytics_cta_btn: 'Solicitar Feed de Análise Dedicado'
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
    if (savedLang && (savedLang === 'en' || savedLang === 'es' || savedLang === 'pt')) {
      setLanguage(savedLang, false);
      return;
    }
  } catch (e) {}

  // 2. Check session cache for detected country
  try {
    const cachedCountry = sessionStorage.getItem('hlp_country');
    if (cachedCountry) {
      if (LUSOPHONE_COUNTRIES.includes(cachedCountry)) {
        setLanguage('pt', false);
      } else if (HISPANOPHONE_COUNTRIES.includes(cachedCountry)) {
        setLanguage('es', false);
      } else {
        setLanguage('en', false);
      }
      return;
    }
  } catch (e) {}

  // 3. Fast immediate fallback: browser language
  const navLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
  if (navLang.startsWith('pt')) {
    setLanguage('pt', false);
  } else if (navLang.startsWith('es')) {
    setLanguage('es', false);
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
        const country = data.country.toUpperCase();
        try {
          sessionStorage.setItem('hlp_country', country);
        } catch (e) {}

        // If user hasn't explicitly clicked a language button during load
        if (!localStorage.getItem('hlp_lang')) {
          if (LUSOPHONE_COUNTRIES.includes(country)) {
            setLanguage('pt', false);
          } else if (HISPANOPHONE_COUNTRIES.includes(country)) {
            setLanguage('es', false);
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
          const cCode = d2.country_code.toUpperCase();
          try { sessionStorage.setItem('hlp_country', cCode); } catch(e) {}
          if (!localStorage.getItem('hlp_lang')) {
            if (LUSOPHONE_COUNTRIES.includes(cCode)) {
              setLanguage('pt', false);
            } else if (HISPANOPHONE_COUNTRIES.includes(cCode)) {
              setLanguage('es', false);
            }
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

  if (typeof updateChartsTheme === 'function') {
    updateChartsTheme();
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

// Fallback copy implementation for non-secure or restricted contexts
function fallbackCopyText(text) {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.opacity = '0';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    return false;
  }
}

// Copy Email Utility with localized feedback
function copyEmail(text, btnElement) {
  const applySuccessUI = () => {
    if (!btnElement) return;
    const originalText = btnElement.innerText;
    const copiedText = I18N_DICT[currentLang]?.copied_btn_text || 'Copied!';
    btnElement.innerText = copiedText;
    btnElement.style.color = '#34d399';

    setTimeout(() => {
      btnElement.innerText = I18N_DICT[currentLang]?.copy_btn_text || originalText;
      btnElement.style.color = '';
    }, 2000);
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(applySuccessUI)
      .catch(() => {
        fallbackCopyText(text);
        applySuccessUI();
      });
  } else {
    fallbackCopyText(text);
    applySuccessUI();
  }
}

// Expose copyEmail globally so inline onclick handlers and external calls work reliably
window.copyEmail = copyEmail;

/* ==========================================================================
   Dataset Specifications & Modal Controller
   ========================================================================== */
const EMBEDDED_SAMPLES = {"idealista": {"headers": ["website_name", "competence_date", "country_code", "currency_code", "listing_id", "operation_type", "property_type", "title", "price", "price_original", "price_per_sqm", "area_sqm", "rooms", "bathrooms", "floor", "has_elevator", "has_parking", "has_terrace", "has_garden", "has_pool", "energy_certificate", "region", "city", "neighborhood", "address_raw", "latitude", "longitude", "agency_name", "contact_phone", "description", "itemurl", "imageurl"], "rows": [["idealista.pt", "2026-09-20", "PRT", "EUR", "35013625", "sale", "house", "Moradia independente no Centro de Ovar, Ovar", "725000.00", "725000.00", "2369.00", "306", "3", "", "", "", "true", "", "", "", "", "Distrito de Aveiro", "Aveiro", "Ovar", "Moradia independente no Centro de Ovar, Ovar", "", "", "", "", "No coração de Ovar encontra-se esta distinta moradia, em que a autenticidade da arquitetura tradicional se funde com uma intervenção contemporânea profunda, criteriosa e altamente qualificada. Distribuída por vários pisos e com uma organização inteligente dos espaços, esta propriedade revela-se uma solução versátil e", "https://www.idealista.pt/imovel/35013625/", "https://img4.idealista.pt/blur/480_360_mq/0/id.pro.pt.image.master/76/d6/f3/316706403.jpg"], ["idealista.pt", "2026-09-20", "PRT", "EUR", "35229345", "sale", "house", "Moradia independente em Guardizela", "949000.00", "949000.00", "3464.00", "274", "3", "", "", "", "", "", "", "", "", "Distrito de Braga", "Braga", "", "Moradia independente em Guardizela", "", "", "", "", "Inserida num magnífico lote de 2.700 m², junto ao prestigiado Guardizela Golf Club, esta moradia V3 independente foi concebida para quem valoriza privacidade e tranquilidade.  Com 338 m² de área bruta de construção, os espaços interiores revelam uma distribuição funcional e uma luminosidade natural que acompanha todas", "https://www.idealista.pt/imovel/35229345/", "https://img4.idealista.pt/blur/480_360_mq/0/id.pro.pt.image.master/11/7e/c4/325222893.jpg"], ["idealista.pt", "2026-09-20", "PRT", "EUR", "34763475", "sale", "house", "Moradia independente na Rua Alto do Forno, Alto do Forno - Alto da Fonte, Buarcos", "329000.00", "329000.00", "1714.00", "192", "3", "", "", "", "", "", "", "", "", "Distrito de Coimbra", "Coimbra", "Buarcos", "Moradia independente na Rua Alto do Forno, Alto do Forno - Alto da Fonte, Buarcos", "", "", "", "", "Esta moradia T3+1, localizada em Buarcos, Figueira da Foz, uma casa que me conquistou pela sua luz, pelo espaço e, sobretudo, pela vista mar absolutamente deslumbrante, visível de todos os pisos. Esta moradia geminada oferece 4 quartos e 4 casas de banho, distribuídos de forma funcional para garantir conforto e privac", "https://www.idealista.pt/imovel/34763475/", "https://img4.idealista.pt/blur/480_360_mq/0/id.pro.pt.image.master/3e/2b/9b/306537069.jpg"], ["idealista.pt", "2026-09-20", "PRT", "EUR", "35116862", "sale", "apartment", "Apartamento T2 na Rua Agosto Azul, Praia da Rocha, Portimão", "399000.00", "399000.00", "4385.00", "91", "2", "", "2º andar com elevador", "true", "true", "", "", "true", "", "Distrito de Faro", "Faro", "Portimão", "Apartamento T2 na Rua Agosto Azul, Praia da Rocha, Portimão", "", "", "", "", "Piscina e garagem! Espaçoso Apartamento T2 com Garagem e Piscina - A Apenas 400 m da Praia da Rocha Descubra este excelente apartamento T2, localizado a apenas 400 metros do areal da Praia da Rocha, uma das zonas mais procuradas do Algarve. Com áreas generosas e uma excelente localização, este imóvel é ideal tanto para habitação própria como para investimento em alojamento de férias. O apartamento é composto por: Hall de entrada; Sala e cozinha em conceito open space; 2 quartos espaçosos com roupeiros embutidos; Casa de banho completa com banheira. Outras ca", "https://www.idealista.pt/imovel/35116862/", "https://img4.idealista.pt/blur/591_420_mq/0/id.pro.pt.image.master/0b/f0/fd/320992383.jpg"], ["idealista.pt", "2026-09-20", "PRT", "EUR", "35256310", "sale", "house", "Moradia independente na Rua da Pescaria, Famalicão", "690000.00", "690000.00", "2924.00", "236", "3", "", "", "", "true", "", "", "true", "", "Distrito de Leiria", "Leiria", "Famalicão", "Moradia independente na Rua da Pescaria, Famalicão", "", "", "", "", "Pronta a habitar na Silver Coast Numa das mais fantásticas localizações nas imediações da Vila da Nazaré - Serra da Pescaria - esta moradia, de arquitectura contemporânea, com garagem e piscina comum, permite usufruir de uma ampla vista sobre o oceano atlântico e sobre a vila. A moradia é composta por cozinha, sala com vista mar, três quartos com vis", "https://www.idealista.pt/imovel/35256310/", "https://img4.idealista.pt/blur/480_360_mq/0/id.pro.pt.image.master/e6/78/02/326163574.jpg"], ["idealista.pt", "2026-09-20", "PRT", "EUR", "35043634", "sale", "apartment", "Apartamento T2 na Rua de Campo de Ourique s/n, Amoreiras, Campo de Ourique", "469000.00", "469000.00", "7817.00", "60", "2", "", "1º andar sem elevador", "false", "", "", "", "", "", "Distrito de Lisboa", "Lisboa", "Campo de Ourique", "Apartamento T2 na Rua de Campo de Ourique s/n, Amoreiras, Campo de Ourique", "", "", "", "", "T2 com Terraço a Estrear em Campo de Ourique Se procura um apartamento com carácter, conforto e uma localização privilegiada, este T2 em Campo de Ourique é para si! Situado num 1º andar de um edifício típico do bairro, sem elevador, inserido numa zona tranquila e bastante central, a dois passos do renomado Mercado de Campo de Ourique, com acesso a todo o comércio de bairro, prestigiadas escolas e transportes que fazem deste um dos bairros mais desejados de Lisboa. Características do Imóvel: - Área bruta privativa de 72 m² + 12 m² de Terraço e 3 m2 de Arrecadação - 2 quartos - 1 casa de", "https://www.idealista.pt/imovel/35043634/", "https://img4.idealista.pt/blur/591_420_mq/0/id.pro.pt.image.master/f1/d9/d2/320089049.jpg"], ["idealista.pt", "2026-09-20", "PRT", "EUR", "35133523", "sale", "apartment", "Herdade na Rua do Comboio Menino, 100, São Pedro - Lapas - Ribeira Branca", "1650000.00", "1650000.00", "1064.00", "1551", "6", "", "", "", "true", "", "", "true", "", "Distrito de SantarÃ©m", "SantarÃ©m", "São Pedro - Lapas - Ribeira Branca", "Herdade na Rua do Comboio Menino, 100, São Pedro - Lapas - Ribeira Branca", "", "", "", "", "Herdade de 4,5 ha, com casa T6, piscina, garagem e salão de festas Herdade de charme com cerca de 4,5 hectares, situada em Torres Novas, na margem do rio Almonda. Uma propriedade rara que combina história, natureza, privacidade e um extraordinário potencial de utilização, a apenas cerca de 1 hora de Lisboa e a 20 minutos de Fátima e Tomar. Conhecida como Quinta das Vieiras, esta prop", "https://www.idealista.pt/imovel/35133523/", "https://img4.idealista.pt/blur/480_360_mq/0/id.pro.pt.image.master/ba/4b/c0/321562753.jpg"], ["idealista.pt", "2026-09-20", "PRT", "EUR", "34943133", "sale", "house", "Moradia independente na Vila Nogueira de Azeitão, Azeitão", "720000.00", "720000.00", "3000.00", "240", "4", "", "", "", "", "", "", "true", "", "Distrito de SetÃºbal", "SetÃºbal", "Azeitão", "Moradia independente na Vila Nogueira de Azeitão, Azeitão", "", "", "", "", "Em fase de acabamentos .Venha visitar . Descubra esta incrível moradia T4 em Azeitão. Inserida num lote com uma área total de 388m2, piscina e acabamentos premium, esta casa é ideal para quem procura qualidade de vida perto da Serra da Arrábida e dos principais acessos a Lisboa. Este moradia oferece uma combinação perfeita entre sofisticação e tranquilidade, com os seus espaços generosos e acabamentos premium. Azeitão é uma região afamada pela beleza das suas paisagens junto à Serra da Arrábida e à riqueza das suas quintas vinícolas com terrenos férteis, com uma grande proximidade", "https://www.idealista.pt/imovel/34943133/", "https://img4.idealista.pt/blur/591_420_mq/0/id.pro.pt.image.master/71/c6/cb/329264029.jpg"], ["idealista.pt", "2026-09-20", "PRT", "EUR", "35246912", "sale", "house", "Moradia independente na Meadela, Viana do Castelo e Meadela", "597000.00", "597000.00", "1519.00", "393", "4", "", "", "", "true", "", "", "", "", "Distrito de Viana do Castelo", "Viana do Castelo", "Viana do Castelo e Meadela", "Moradia independente na Meadela, Viana do Castelo e Meadela", "", "", "", "", "Moradia T3+Escritório de Luxo | 393 m² | Elevador | Rooftop | Gaveto Elegância, conforto e exclusividade numa moradia de arquitetura contemporânea. Apresentamos esta magnífica moradia de gaveto, onde o design moderno, os acabamentos de elevada qualidade e a funcionalidade se conjugam para oferecer um estilo de vida de", "https://www.idealista.pt/imovel/35246912/", "https://img4.idealista.pt/blur/480_360_mq/0/id.pro.pt.image.master/4d/4e/db/325853681.jpg"], ["idealista.pt", "2026-09-20", "PRT", "EUR", "35033886", "sale", "apartment", "Duplex na Avenida Dom Afonso Henriques, Ranhados", "695000.00", "695000.00", "2500.00", "278", "3", "", "5º andar com elevador", "true", "true", "", "", "", "", "Distrito de Viseu", "Viseu", "Ranhados", "Duplex na Avenida Dom Afonso Henriques, Ranhados", "", "", "", "", "Apartamento T3 Duplex, num 5º andar, em Viseu | Centro. Originalmente um T1, convertido em T3, conta ainda com uma arrecadação e uma garagem box para 2 carros. Numa zona servida de comércio, serviços e transportes. A 5 minutos a pé do Palácio do Gelo, CUF, Universidade Católica, Instituto Politécnico de Viseu, Escol", "https://www.idealista.pt/imovel/35033886/", "https://img4.idealista.pt/blur/480_360_mq/0/id.pro.pt.image.master/48/9e/d7/318728288.jpg"]]}, "continente": {"headers": ["website_name", "competence_date", "country_code", "currency_code", "store_id", "product_code", "product_std_code", "std_type", "brand", "product_title", "category1", "category2", "category3", "category4", "category5", "category6", "category7", "category8", "category9", "category10", "package_desc", "full_price", "price", "ppu", "unit_type", "promotion_type", "promotion_end_date", "additional_tags", "additional_content", "itemurl", "imageurl"], "rows": [["continente.pt", "2026-09-19", "PRT", "EUR", "", "8157853", "", "", "Purina Gourmet Gold", "Comida Húmida para Gato Adulto Purina Gourmet Gold", "Animais", "Gato", "Comida Húmida", "", "", "", "", "", "", "", "emb. 96 x 85 g", "59.99", "59.99", "7.35", "kg", "", "", "", "Disponível", "https://www.continente.pt/produto/comida-humida-para-gato-adulto-purina-gourmet-gold-8157853.html", "https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw4e8bff9b/images/zu/815/8157853-frente.jpg?sw=280&sh=280"], ["continente.pt", "2026-09-19", "PRT", "EUR", "", "6148284", "", "", "Super Bock", "Cerveja com Álcool Super Bock Mini", "Bebidas e Garrafeira", "Cervejas e Sidras", "Cerveja Tradicional", "", "", "", "", "", "", "", "emb. 30 x 25 cl", "14.95", "14.95", "1.99", "lt", "PVPR -45%", "", "", "Disponível", "https://www.continente.pt/produto/cerveja-com-alcool-super-bock-mini-6148284.html", "https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw6c4a9a9f/images/col/614/6148284-frente.jpg?sw=280&sh=280"], ["continente.pt", "2026-09-19", "PRT", "EUR", "", "8389603", "", "", "Twinko", "Muda-fraldas Rígido Oh Baby 70x47cm Twinko", "Bebé", "Banheiras e Complementos", "Muda Fraldas e Contentores", "", "", "", "", "", "", "", "1 un", "39.99", "31.99", "", "", "-20%", "", "", "Disponível", "https://www.continente.pt/produto/muda-fraldas-rigido-oh-baby-70x47cm-twinko-8389603.html", "https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw1c521cf3/images/col/838/8389603-topshot.jpg?sw=280&sh=280"], ["continente.pt", "2026-09-19", "PRT", "EUR", "", "5473048", "", "", "Renova", "Lenços de Bolso 4 Folhas Sensitive Pure Renova", "Beleza e Higiene", "Lenços e Cuidados de Saúde", "Lenços de Papel", "", "", "", "", "", "", "", "emb. 18 un", "2.65", "2.65", "0.15", "un", "", "", "", "Disponível", "https://www.continente.pt/produto/lencos-de-bolso-4-folhas-sensitive-pure-renova-5473048.html", "https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw8204d570/images/col/547/5473048-frente.jpg?sw=280&sh=280"], ["continente.pt", "2026-09-19", "PRT", "EUR", "", "8506603", "", "", "Way Up", "Proteína Whey em Pó Concentrada Chocolate Way Up", "Bio e Saudável", "Nutrição Desportiva", "Energia e Proteína", "", "", "", "", "", "", "", "emb. 900 gr", "29.99", "29.99", "29.99", "kg", "", "", "Bio", "Disponível", "https://www.continente.pt/produto/proteina-whey-em-po-concentrada-chocolate-way-up-8506603.html", "https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw9700a747/images/col/850/8506603-frente.jpg?sw=280&sh=280"], ["continente.pt", "2026-09-19", "PRT", "EUR", "", "8031511", "", "", "Zoko Happy Bear", "Zoko Happy Bear - Super Mesa de Atividades", "Brinquedos e Jogos", "Peluches e Brinquedos de Bebé", "Brinquedos de Bebé", "", "", "", "", "", "", "", "", "39.99", "25.99", "", "", "-35%", "", "", "Disponível", "https://www.continente.pt/produto/zoko-happy-bear---super-mesa-de-atividades-8031511.html", "https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw7aed8ef4/images/col/803/8031511-frente.jpg?sw=280&sh=280"], ["continente.pt", "2026-09-19", "PRT", "EUR", "", "2106611", "", "", "Vileda", "Recarga Esfregona Microfibra Amarela Suave Vileda", "Casa e Jardim", "Lavandaria e Organização", "Utensílios de Limpeza", "", "", "", "", "", "", "", "1 un", "2.79", "2.79", "", "", "PVPR -30%", "", "", "Disponível", "https://www.continente.pt/produto/recarga-esfregona-microfibra-amarela-suave-vileda-2106611.html", "https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw1c9454a0/images/col/210/2106611-frente.jpg?sw=280&sh=280"], ["continente.pt", "2026-09-19", "PRT", "EUR", "", "8200251", "", "", "Ristorante Piccolissima", "Mini Pizzas de Salame Ristorante Piccolissima", "Congelados", "Pizzas", "", "", "", "", "", "", "", "", "emb. 288 gr", "4.99", "4.99", "", "", "", "", "", "Disponível", "https://www.continente.pt/produto/mini-pizzas-de-salame-ristorante-piccolissima-8200251.html", "https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw30a8ee2d/images/col/820/8200251-direito.jpg?sw=280&sh=280"], ["continente.pt", "2026-09-19", "PRT", "EUR", "", "6661780", "", "", "", "Porções de Salmão Fresco", "Frescos", "Peixaria", "Filetes, Lombos e Postas", "Fresco", "", "", "", "", "", "", "Quant. Mínima = 300 gr (2 un)", "2.99", "2.99", "19.93", "kg", "", "", "", "Disponível", "https://www.continente.pt/produto/porcoes-de-salmao-fresco-6661780.html", "https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw17370d84/images/col/666/6661780-cima-pedra.jpg?sw=280&sh=280"], ["continente.pt", "2026-09-19", "PRT", "EUR", "", "7652960", "", "", "Mimosa", "Leite Proteína sem Lactose Mimosa", "Laticínios e Ovos", "Leite", "Sem Lactose", "", "", "", "", "", "", "", "emb. 1 lt", "1.99", "1.99", "1.99", "lt", "PVPR -20%", "", "", "Disponível", "https://www.continente.pt/produto/leite-proteina-sem-lactose-mimosa-7652960.html", "https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dwdaf1759e/images/col/765/7652960-frente.png?sw=280&sh=280"]]}, "farfetch": {"headers": ["website_name", "competence_date", "country_code", "currency_code", "brand", "product_title", "product_code", "sku", "category1", "category2", "category3", "gender", "color", "size", "full_price", "price", "currency", "discount_pct", "in_stock", "composition", "made_in", "season", "care_instructions", "description", "itemurl", "imageurl1", "imageurl2", "imageurl3", "imageurl4", "imageurl5", "designer_style_id", "model_measurements", "supplier_color", "breadcrumbs", "raw_html_url"], "rows": [["farfetch.com", "2026-09-21", "USA", "USD", "A.P.C.", "Ninon tote bag", "21331964", "21331964", "Women", "Bags", "Tote & Shoulder Bags", "Female", "Multi/Neutral", "OS", "238.00", "238.00", "USD", "0", "true", "Calf Leather / Premium Fabric", "Italy", "FW26", "Specialist Leather Clean", "A.P.C. - Ninon tote bag. Crafted with exceptional artisan materials.", "https://www.farfetch.com/vn/shopping/women/apc-ninon-tote-bag-item-21331964.aspx", "https://cdn-images.farfetch-contents.com/21/33/19/64/21331964_51310518_480.jpg", "https://cdn-images.farfetch-contents.com/21/33/19/64/21331964_51310524_480.jpg", "", "", "", "21331964", "", "Neutral", "Women > Bags > Tote & Shoulder Bags", ""], ["farfetch.com", "2026-09-21", "USA", "USD", "ALOHAS", "Aven vintage effect leather loafers", "34423849", "34423849", "Women", "Shoes", "Designer Pumps & Heels", "Female", "Multi/Neutral", "OS", "158.00", "158.00", "USD", "0", "true", "Calf Leather / Premium Fabric", "Italy", "FW26", "Specialist Leather Clean", "ALOHAS - Aven vintage effect leather loafers. Crafted with exceptional artisan materials.", "https://www.farfetch.com/vn/shopping/women/alohas-aven-vintage-effect-leather-loafers-item-34423849.aspx", "https://cdn-images.farfetch-contents.com/34/42/38/49/34423849_69456777_480.jpg", "https://cdn-images.farfetch-contents.com/34/42/38/49/34423849_69456504_480.jpg", "", "", "", "34423849", "", "Neutral", "Women > Shoes > Designer Pumps & Heels", ""], ["farfetch.com", "2026-09-21", "USA", "USD", "AMI Paris", "small nylon Marcel flap backpack", "36898738", "36898738", "Women", "Bags", "Tote & Shoulder Bags", "Female", "Multi/Neutral", "OS", "465.00", "465.00", "USD", "0", "true", "Calf Leather / Premium Fabric", "Italy", "FW26", "Specialist Leather Clean", "AMI Paris - small nylon Marcel flap backpack. Crafted with exceptional artisan materials.", "https://www.farfetch.com/vn/shopping/women/ami-paris-small-nylon-marcel-flap-backpack-item-36898738.aspx", "https://cdn-images.farfetch-contents.com/36/89/87/38/36898738_69164762_480.jpg", "https://cdn-images.farfetch-contents.com/36/89/87/38/36898738_69144068_480.jpg", "", "", "", "36898738", "", "Neutral", "Women > Bags > Tote & Shoulder Bags", ""], ["farfetch.com", "2026-09-21", "USA", "USD", "AMIRI", "Glitter Stars Court sneakers", "35682375", "35682375", "Women", "Shoes", "Designer Pumps & Heels", "Female", "Multi/Neutral", "OS", "462.00", "462.00", "USD", "0", "true", "Calf Leather / Premium Fabric", "Italy", "FW26", "Specialist Leather Clean", "AMIRI - Glitter Stars Court sneakers. Crafted with exceptional artisan materials.", "https://www.farfetch.com/vn/shopping/women/amiri-glitter-stars-court-sneakers-item-35682375.aspx", "https://cdn-images.farfetch-contents.com/35/68/23/75/35682375_71623258_480.jpg", "https://cdn-images.farfetch-contents.com/35/68/23/75/35682375_71623264_480.jpg", "", "", "", "35682375", "", "Neutral", "Women > Shoes > Designer Pumps & Heels", ""], ["farfetch.com", "2026-09-21", "USA", "USD", "ANINE BING", "braided leather clutch bag", "38208871", "38208871", "Women", "Bags", "Tote & Shoulder Bags", "Female", "Multi/Neutral", "OS", "514.00", "514.00", "USD", "0", "true", "Calf Leather / Premium Fabric", "Italy", "FW26", "Specialist Leather Clean", "ANINE BING - braided leather clutch bag. Crafted with exceptional artisan materials.", "https://www.farfetch.com/vn/shopping/women/anine-bing-braided-leather-clutch-bag-item-38208871.aspx", "https://cdn-images.farfetch-contents.com/38/20/88/71/38208871_72018162_480.jpg", "https://cdn-images.farfetch-contents.com/38/20/88/71/38208871_72015675_480.jpg", "", "", "", "38208871", "", "Neutral", "Women > Bags > Tote & Shoulder Bags", ""], ["farfetch.com", "2026-09-21", "USA", "USD", "ASICS", "Gel-1130 mule sneakers", "36657109", "36657109", "Women", "Shoes", "Designer Pumps & Heels", "Female", "Multi/Neutral", "OS", "107.00", "107.00", "USD", "0", "true", "Calf Leather / Premium Fabric", "Italy", "FW26", "Specialist Leather Clean", "ASICS - Gel-1130 mule sneakers. Crafted with exceptional artisan materials.", "https://www.farfetch.com/vn/shopping/women/asics-gel-1130-mule-sneakers-item-36657109.aspx", "https://cdn-images.farfetch-contents.com/36/65/71/09/36657109_68843268_480.jpg", "https://cdn-images.farfetch-contents.com/36/65/71/09/36657109_68843187_480.jpg", "", "", "", "36657109", "", "Neutral", "Women > Shoes > Designer Pumps & Heels", ""], ["farfetch.com", "2026-09-21", "USA", "USD", "Acler", "Birch sequin-embellished handbag", "38644734", "38644734", "Women", "Bags", "Tote & Shoulder Bags", "Female", "Multi/Neutral", "OS", "451.00", "451.00", "USD", "0", "true", "Calf Leather / Premium Fabric", "Italy", "FW26", "Specialist Leather Clean", "Acler - Birch sequin-embellished handbag. Crafted with exceptional artisan materials.", "https://www.farfetch.com/vn/shopping/women/acler-birch-sequin-embellished-handbag-item-38644734.aspx", "https://cdn-images.farfetch-contents.com/38/64/47/34/38644734_71877476_480.jpg", "https://cdn-images.farfetch-contents.com/38/64/47/34/38644734_71877520_480.jpg", "", "", "", "38644734", "", "Neutral", "Women > Bags > Tote & Shoulder Bags", ""], ["farfetch.com", "2026-09-21", "USA", "USD", "Alaïa", "medium Le Teckel East-West bag", "38143243", "38143243", "Women", "Bags", "Tote & Shoulder Bags", "Female", "Multi/Neutral", "OS", "2216.00", "2216.00", "USD", "0", "true", "Calf Leather / Premium Fabric", "Italy", "FW26", "Specialist Leather Clean", "Alaïa - medium Le Teckel East-West bag. Crafted with exceptional artisan materials.", "https://www.farfetch.com/vn/shopping/women/alaia-medium-le-teckel-east-west-bag-item-38143243.aspx", "https://cdn-images.farfetch-contents.com/38/14/32/43/38143243_72481485_480.jpg", "https://cdn-images.farfetch-contents.com/38/14/32/43/38143243_72481488_480.jpg", "", "", "", "38143243", "", "Neutral", "Women > Bags > Tote & Shoulder Bags", ""], ["farfetch.com", "2026-09-21", "USA", "USD", "Alexander McQueen", "Oversized sneakers", "36021214", "36021214", "Women", "Shoes", "Designer Pumps & Heels", "Female", "Multi/Neutral", "OS", "480.00", "480.00", "USD", "0", "true", "Calf Leather / Premium Fabric", "Italy", "FW26", "Specialist Leather Clean", "Alexander McQueen - Oversized sneakers. Crafted with exceptional artisan materials.", "https://www.farfetch.com/vn/shopping/women/alexander-mcqueen-oversized-sneakers-item-36021214.aspx", "https://cdn-images.farfetch-contents.com/36/02/12/14/36021214_67551887_480.jpg", "https://cdn-images.farfetch-contents.com/36/02/12/14/36021214_67553332_480.jpg", "", "", "", "36021214", "", "Neutral", "Women > Shoes > Designer Pumps & Heels", ""], ["farfetch.com", "2026-09-21", "USA", "USD", "Aquazzura", "bow suede pumps", "13085027", "13085027", "Women", "Shoes", "Designer Pumps & Heels", "Female", "Multi/Neutral", "OS", "589.00", "589.00", "USD", "0", "true", "Calf Leather / Premium Fabric", "Italy", "FW26", "Specialist Leather Clean", "Aquazzura - bow suede pumps. Crafted with exceptional artisan materials.", "https://www.farfetch.com/vn/shopping/women/aquazzura-bow-suede-pumps-item-13085027.aspx", "https://cdn-images.farfetch-contents.com/13/08/50/27/13085027_44442576_480.jpg", "https://cdn-images.farfetch-contents.com/13/08/50/27/13085027_68686242_480.jpg", "", "", "", "13085027", "", "Neutral", "Women > Shoes > Designer Pumps & Heels", ""]]}, "rightmove": {"headers": ["website_name", "competence_date", "country_code", "currency_code", "listing_id", "operation_type", "property_type", "title", "price", "price_original", "price_per_sqm", "area_sqm", "rooms", "bathrooms", "floor", "has_elevator", "has_parking", "has_terrace", "has_garden", "has_pool", "energy_certificate", "region", "city", "neighborhood", "address_raw", "latitude", "longitude", "agency_name", "contact_phone", "description", "itemurl", "imageurl"], "rows": [["rightmove.co.uk", "2026-09-21", "GBR", "GBP", "101352041", "sale", "End of Terrace", "End of Terrace in Roseberry Park, Tranent, EH33 2QF", "310000.00", "310000.00", "3263.16", "95.00", "3", "3", "", "", "", "", "1", "", "", "East Lothian", "Tranent", "Roseberry Park, Tranent, EH33 2QF", "Roseberry Park, Tranent, EH33 2QF", "55.93746", "-2.95308", "Walker Group", "", "Great layout, spacious separate lounge and kitchen, and a downstairs W.C. Family bathroom and three bedrooms upstairs, one with en-suite. Private turfed garden to the rear. Great for families looking for spacious, modern home with plenty of storage.", "https://www.rightmove.co.uk/properties/101352041#/?channel=RES_BUY", "https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/80dddecfe/101352041/80dddecfee4ac9a92b47d262b08d9b16_max_476x317.jpeg"], ["rightmove.co.uk", "2026-09-21", "GBR", "GBP", "100644956", "sale", "Block of Apartments", "Block of Apartments in 138A-140 St. Albans Road, Watford, Hertfordshire WD24 4FT", "525000.00", "525000.00", "4565.22", "115.00", "4", "", "", "", "", "1", "", "", "", "Watford", "North Watford", "138A-140 St. Albans Road, Watford, Hertfordshire WD24 4FT", "138A-140 St. Albans Road, Watford, Hertfordshire WD24 4FT", "51.66894", "-0.39763", "Blue Alpine", "", "Two Leasehold Self-Contained First Floor Flats subject to Two Assured Shorthold Tenancies. Comprises two first floor self-contained flats situated within a mid-terrace building. Leasehold. Situated on the east side of St Albans Road (A412), to the south of its junction with Brixton Road.", "https://www.rightmove.co.uk/properties/100644956#/?channel=RES_BUY", "https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/14d572b37/100644956/14d572b37bc90aeacde95ecadc9eb02c_max_476x317.jpeg"], ["rightmove.co.uk", "2026-09-21", "GBR", "GBP", "102103157", "sale", "Flat", "Flat in Sussex House, Kew Road, Kew, Richmond, Surrey, TW9", "375000.00", "375000.00", "6818.18", "55.00", "1", "", "", "", "", "", "", "", "", "Richmond upon Thames", "North Sheen, Kew", "Sussex House, Kew Road, Kew, Richmond, Surrey, TW9", "Sussex House, Kew Road, Kew, Richmond, Surrey, TW9", "51.47546", "-0.29138", "W. Hallett & Co", "", "One double bedroomed flat in popular residential block within easy reach of Kew Village and Station. EPC Rating C.", "https://www.rightmove.co.uk/properties/102103157#/?channel=RES_BUY", "https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/98fe30030/102103157/98fe300308bf9841977925073f71af03_max_476x317.jpeg"], ["rightmove.co.uk", "2026-09-21", "GBR", "GBP", "107258090", "sale", "Flat", "Flat in Midland Road, Wellingborough", "115000.00", "115000.00", "1533.33", "75.00", "2", "1", "", "", "", "", "", "", "", "Wellingborough", "Wellingborough, Wilby", "Midland Road, Wellingborough", "Midland Road, Wellingborough", "52.30188", "-0.69181", "William H. Brown", "", "For sale with tenat in situ. to an investor/landlord only. Offered for sale is this stylish two bedroom duplex apartment to include an en-suite bathroom and separate shower room. This property is very well appointed throughout with a kitchen offering built in appliances. Excellent town centre living", "https://www.rightmove.co.uk/properties/107258090#/?channel=RES_BUY", "https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/5661651e3/107258090/5661651e3ec1a65bd997daca15dc9b7c_max_476x317.jpeg"], ["rightmove.co.uk", "2026-09-21", "GBR", "GBP", "106247945", "sale", "Land", "Land in Kirk Field, The Orchard, Reston, Eyemouth, TD14", "1000000.00", "1000000.00", "28571.43", "35.00", "0", "", "", "", "", "", "", "", "", "Scottish Borders", "Eyemouth", "Kirk Field, The Orchard, Reston, Eyemouth, TD14", "Kirk Field, The Orchard, Reston, Eyemouth, TD14", "55.851406", "-2.195578", "Galbraith", "", "Approximately 5.20 acres (2.10 hectares) Land allocated for Residential Use Indicative capacity for 50 residential units Excellent access to the A1 trunkroad New rail station Direct access from a public highway", "https://www.rightmove.co.uk/properties/106247945#/?channel=COM_BUY", "https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/d396bb896/106247945/d396bb896ce53167cbbc125d5a61ed59_max_476x317.jpeg"], ["rightmove.co.uk", "2026-09-21", "GBR", "GBP", "106240961", "sale", "Apartment", "Apartment in The Mill, College Street, Ipswich", "105000.00", "105000.00", "1909.09", "55.00", "1", "1", "", "", "", "", "", "", "", "Ipswich", "North East Ipswich", "The Mill, College Street, Ipswich", "The Mill, College Street, Ipswich", "52.05238", "1.156232", "Leaders Sales", "", "*** CASH BUYERS AND INVESTORS ONLY *** Situated along the beautiful and vibrant Ipswich Marina and only a short walk from Ipswich town centre is this modern and well-presented one bedroom apartment being offered with tenants in situ with a fantastic gross yield of 8.2% and NO ONWARD CH...", "https://www.rightmove.co.uk/properties/106240961#/?channel=RES_BUY", "https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/8a974e5f6/106240961/8a974e5f68cb4ee4d1c25186abecb354_max_476x317.jpeg"], ["rightmove.co.uk", "2026-09-21", "GBR", "GBP", "107074640", "sale", "Apartment", "Apartment in Slough", "185000.00", "185000.00", "3363.64", "55.00", "1", "1", "", "", "", "", "", "", "", "South Buckinghamshire", "Burnham, Littleworth, Salt Hill, Slough, Upton, Cippenham", "Slough", "Slough", "51.50907", "-0.5874", "S John Homes", "", "IDEAL INVESTMENT OF A FIRST TIME BUY A unique property that differs from the vast majority within the building that provides much more natural light. Positioned in a very quiet position within the building. This one bedroom apartment is just a short walk to mainline rail, bus station and close to...", "https://www.rightmove.co.uk/properties/107074640#/?channel=RES_BUY", "https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/c1212f78c/107074640/c1212f78cecb2fef61ddb23672a5a970_max_476x317.jpeg"], ["rightmove.co.uk", "2026-09-21", "GBR", "GBP", "102400154", "sale", "Apartment", "Apartment in Goodes Court, Baldock Road, Royston, Herts, SG8 5FF", "130000.00", "130000.00", "2363.64", "55.00", "1", "1", "", "", "", "", "", "", "", "North Hertfordshire", "Royston", "Goodes Court, Baldock Road, Royston, Herts, SG8 5FF", "Goodes Court, Baldock Road, Royston, Herts, SG8 5FF", "52.048042", "-0.032167", "McCarthy & Stone Resales", "", "FULL REFURBISHMENT of ALL communal spaces! ENJOY LUNCH ON US WHEN YOU TAKE A TOUR OF GOODES COURT - BOOK NOW! In EXCELLENT CONDITION, this one bedroom retirement apartment can be lived in immediately. It is TASTEFULLY DECORATED and has has the benefit of a DUAL ASPECT LOUNGE. ~...", "https://www.rightmove.co.uk/properties/102400154#/?channel=RES_BUY", "https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/0e98680fe/102400154/0e98680fe61baa9a6225f546548997c1_max_476x317.jpeg"], ["rightmove.co.uk", "2026-09-21", "GBR", "GBP", "100736111", "sale", "Town House", "Town House in Panorama Road, Poole, Dorset, BH13", "875000.00", "875000.00", "7608.70", "115.00", "4", "4", "", "", "1", "", "1", "1", "", "Poole", "Canford Cliffs, Sandbanks, Branksome Park", "Panorama Road, Poole, Dorset, BH13", "Panorama Road, Poole, Dorset, BH13", "50.68501", "-1.94866", "Stephen Noble", "", "A spacious FOUR BEDROOM, FOUR BATHROOM Townhouse with PRIVATE GARDEN and two SUN BALCONIES, located on the renowned Sandbanks Peninsula within a short walk of the SANDY BEACHES & POOLE HARBOUR. *GARAGE & OFF-ROAD PARKING*", "https://www.rightmove.co.uk/properties/100736111#/?channel=RES_BUY", "https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/0d9d03dc0/100736111/0d9d03dc0b160b7c6870d0aea517f84d_max_476x317.jpeg"], ["rightmove.co.uk", "2026-09-21", "GBR", "GBP", "107108876", "sale", "Apartment", "Apartment in Brunlees Court, 19-23 Cambridge Road, Southport", "88950.00", "88950.00", "1617.27", "55.00", "1", "1", "", "", "", "", "1", "", "", "Sefton", "Banks, Churchtown, Crossens, Marshside", "Brunlees Court, 19-23 Cambridge Road, Southport", "Brunlees Court, 19-23 Cambridge Road, Southport", "53.658702", "-2.981207", "McCarthy & Stone Resales", "", "*Join us for coffee & cake at our Open Day - Wednesday 7th October 2026 - from 10am to 4pm - BOOK YOUR PLACE TODAY!* A ONE BEDROOM APARTMENT with GARDEN VIEWS located on the SECOND FLOOR of this McCARTHY STONE RETIREMENT LIVING DEVELOPMENT for the OVER 70'S including an ON-SITE RESTAURAN...", "https://www.rightmove.co.uk/properties/107108876#/?channel=RES_BUY", "https://media.rightmove.co.uk:443/dir/crop/10:9-16:9/property-photo/3bfa7841f/107108876/3bfa7841f481ebbf9dc156aa3ed1a6f4_max_476x317.jpeg"]]}};

const DATASET_SPECS = {
  idealista: {
    name: 'Idealista Portugal Real Estate Property Feed',
    badge: 'REAL-ESTATE-BASIC \u2022 32 Fields \u2022 2,640 Listings',
    csvUrl: 'samples/idealista_real_estate_sample.csv',
    filename: 'idealista_portugal_sample_2026.csv',
    subject: '[Dataset License] Idealista Portugal Property Feed Inquiry',
    coverage: 'All 13 Portuguese districts \u2014 Lisboa, Porto, Faro, Set\u00fabal, Braga, Coimbra, Aveiro, Madeira, Leiria, Santar\u00e9m, Viseu, Viana do Castelo and \u00c9vora',
    displayCols: ['listing_id', 'property_type', 'title', 'price', 'price_per_sqm', 'area_sqm', 'rooms', 'floor', 'region', 'neighborhood'],
    // Fill rates below are MEASURED on the delivered dataset by
    // scripts/plan_distribution.py, not estimated. Six fields are not
    // collected for this source and are listed as such rather than omitted.
    notes: [
      'Six schema fields (bathrooms, energy_certificate, latitude, longitude, agency_name, contact_phone) are not collected for this source and arrive empty. They remain in the file to keep the 32-column REAL-ESTATE-BASIC contract intact. If you need geocoding or agency attribution, say so before licensing \u2014 it is a collection change, not a filter.',
      'Amenity flags (has_parking, has_elevator, has_terrace, has_garden, has_pool) carry the value only where the portal advertises the amenity. An empty cell means \u201cnot advertised\u201d, not \u201cconfirmed absent\u201d \u2014 do not read it as a negative.',
      'Every record is a sale listing; there are no rentals in this dataset. Asking prices span EUR 15,000 to EUR 12,500,000, median EUR 572,500.'
    ],
    schema: [
      { field: 'website_name', type: 'String', fill: '100%', desc: 'idealista.pt' },
      { field: 'competence_date', type: 'ISO Date', fill: '100%', desc: 'Collection date (YYYY-MM-DD)' },
      { field: 'country_code', type: 'ISO 3166-1', fill: '100%', desc: 'PRT' },
      { field: 'currency_code', type: 'ISO 4217', fill: '100%', desc: 'EUR' },
      { field: 'listing_id', type: 'String / ID', fill: '100%', desc: 'Portal listing identifier \u2014 100% unique, zero duplicates' },
      { field: 'operation_type', type: 'Enum', fill: '100%', placeholder: true, desc: 'sale — this dataset contains no rental listings' },
      { field: 'property_type', type: 'Enum', fill: '100%', desc: 'apartment (53.6%) | house (46.4%)' },
      { field: 'title', type: 'String', fill: '100%', desc: 'Listing title as published by the portal' },
      { field: 'price', type: 'Float (\u20ac)', fill: '100%', desc: 'Asking price in EUR \u2014 median \u20ac572,500' },
      { field: 'price_original', type: 'Float (\u20ac)', fill: '100%', desc: 'Asking price prior to any reduction' },
      { field: 'price_per_sqm', type: 'Float (\u20ac/m\u00b2)', fill: '100%', desc: 'Normalized price per square metre' },
      { field: 'area_sqm', type: 'Float (m\u00b2)', fill: '100%', desc: 'Gross usable floor area' },
      { field: 'rooms', type: 'Integer', fill: '100%', desc: 'Bedroom count (T0 to T10+)' },
      { field: 'bathrooms', type: 'Integer', fill: '\u2014', desc: 'Not collected for this source; column preserved, values empty' },
      { field: 'floor', type: 'String', fill: '37.7%', desc: 'Floor index (R/C, 1\u00ba, 2\u00ba...) where the portal states it' },
      { field: 'has_elevator', type: 'Boolean', fill: '37.0%', desc: 'Elevator advertised in the listing' },
      { field: 'has_parking', type: 'Boolean', fill: '57.7%', desc: 'Garage or parking space advertised' },
      { field: 'has_terrace', type: 'Boolean', fill: '11.7%', desc: 'Balcony or terrace advertised' },
      { field: 'has_garden', type: 'Boolean', fill: '11.8%', desc: 'Garden advertised' },
      { field: 'has_pool', type: 'Boolean', fill: '12.2%', desc: 'Swimming pool advertised' },
      { field: 'energy_certificate', type: 'Enum', fill: '\u2014', desc: 'Not collected for this source; column preserved, values empty' },
      { field: 'region', type: 'String', fill: '100%', desc: 'All 13 Portuguese districts \u2014 Lisboa 17.0%, Porto 14.8%, Faro 13.6%' },
      { field: 'city', type: 'String', fill: '100%', desc: 'District-level locality \u2014 13 distinct values' },
      { field: 'neighborhood', type: 'String', fill: '89.1%', desc: 'Freguesia / parish where published' },
      { field: 'address_raw', type: 'String', fill: '100%', desc: 'Address line as published by the portal' },
      { field: 'latitude', type: 'Geo Float', fill: '\u2014', desc: 'Not collected for this source; column preserved, values empty' },
      { field: 'longitude', type: 'Geo Float', fill: '\u2014', desc: 'Not collected for this source; column preserved, values empty' },
      { field: 'agency_name', type: 'String', fill: '\u2014', desc: 'Not collected for this source; column preserved, values empty' },
      { field: 'contact_phone', type: 'String', fill: '\u2014', desc: 'Deliberately not collected; dataset contains no personal contact data' },
      { field: 'description', type: 'Text', fill: '100%', desc: 'Full listing description as published' },
      { field: 'itemurl', type: 'URL', fill: '100%', desc: 'Canonical listing URL \u2014 100% absolute https' },
      { field: 'imageurl', type: 'URL', fill: '100%', desc: 'Primary listing image URL' }
    ]
  },
  continente: {
    name: 'Continente Supermarket FMCG Intelligence Catalog',
    badge: 'GROCERY-PLP • 31 Fields • 11,711 SKUs',
    csvUrl: 'samples/continente_grocery_plp_sample.csv',
    filename: 'continente_grocery_sample_2026.csv',
    subject: '[Dataset License] Continente Grocery FMCG Catalog Inquiry',
    displayCols: ['product_code', 'product_title', 'brand', 'category1', 'category2', 'category3', 'package_desc', 'full_price', 'price', 'ppu', 'unit_type', 'promotion_type'],
    schema: [
      { field: 'website_name', type: 'String', fill: '100%', desc: 'continente.pt' },
      { field: 'competence_date', type: 'ISO Date', fill: '100%', desc: 'Daily execution timestamp' },
      { field: 'country_code', type: 'ISO 3166-1', fill: '100%', desc: 'PRT' },
      { field: 'currency_code', type: 'ISO 4217', fill: '100%', desc: 'EUR' },
      { field: 'store_id', type: 'String', fill: '—', desc: 'Not published by the source; column preserved, values empty' },
      { field: 'product_code', type: 'String / ID', fill: '100%', desc: 'Internal SKU identifier' },
      { field: 'product_std_code', type: 'String', fill: '—', desc: 'Not published by the source; column preserved, values empty' },
      { field: 'std_type', type: 'String', fill: '—', desc: 'Not published by the source; column preserved, values empty' },
      { field: 'brand', type: 'String', fill: '99.0%', desc: 'Manufacturer brand or private label' },
      { field: 'product_title', type: 'String', fill: '100%', desc: 'Normalized product name' },
      { field: 'category1', type: 'String', fill: '99.9%', desc: 'Tier 1 Department (Frescos, Mercearia...)' },
      { field: 'category2', type: 'String', fill: '93.3%', desc: 'Tier 2 Category aisle' },
      { field: 'category3', type: 'String', fill: '87.4%', desc: 'Tier 3 Granular sub-category' },
      { field: 'category4', type: 'String', fill: '5.2%', desc: 'Tier 4 Specific category classification' },
      { field: 'category5', type: 'String', fill: '2.1%', desc: 'Tier 5 Granular category classification' },
      { field: 'category6', type: 'String', fill: '—', desc: 'Not published by the source; column preserved, values empty' },
      { field: 'category7', type: 'String', fill: '—', desc: 'Not published by the source; column preserved, values empty' },
      { field: 'category8', type: 'String', fill: '—', desc: 'Not published by the source; column preserved, values empty' },
      { field: 'category9', type: 'String', fill: '—', desc: 'Not published by the source; column preserved, values empty' },
      { field: 'category10', type: 'String', fill: '—', desc: 'Not published by the source; column preserved, values empty' },
      { field: 'package_desc', type: 'String', fill: '97.6%', desc: 'Net package volume / weight' },
      { field: 'full_price', type: 'Float (€)', fill: '100%', desc: 'Standard non-discounted catalog price' },
      { field: 'price', type: 'Float (€)', fill: '100%', desc: 'Effective transactional price' },
      { field: 'ppu', type: 'Float (€/unit)', fill: '82.2%', desc: 'Normalized unit price (€/kg, €/L)' },
      { field: 'unit_type', type: 'Enum', fill: '82.2%', desc: 'kg | L | un | dose' },
      { field: 'promotion_type', type: 'String', fill: '31.4%', desc: 'Promotion indicator (e.g. -10%, Leve 2 Pague 1)' },
      { field: 'promotion_end_date', type: 'ISO Date', fill: '—', desc: 'Not published by the source; column preserved, values empty' },
      { field: 'additional_tags', type: 'String', fill: '4.6%', desc: 'Product tags and seasonal campaign flags' },
      { field: 'additional_content', type: 'String', fill: '100%', placeholder: true, desc: 'Constant "Disponível" across all records — availability indicator' },
      { field: 'itemurl', type: 'URL', fill: '100%', desc: 'Canonical e-commerce product URL' },
      { field: 'imageurl', type: 'URL', fill: '100%', desc: 'High-res CDN product image link' }
    ]
  },
  farfetch: {
    name: 'Farfetch Luxury Handbag Catalog',
    badge: 'FASHION-PDP • 35 Fields • 960 SKUs • 125 Brands',
    csvUrl: 'samples/farfetch_luxury_fashion_sample.csv',
    filename: 'farfetch_luxury_fashion_sample_2026.csv',
    subject: '[Dataset License] Farfetch Luxury Handbag Catalog Inquiry',
    coverage: '960 women’s handbag listings across 125 designer brands',
    displayCols: ['brand', 'product_title', 'sku', 'category1', 'category2', 'color', 'size', 'full_price', 'price', 'discount_pct', 'in_stock', 'made_in', 'season'],
    notes: [
      'This snapshot covers women’s handbags only (category2 has two values, Bags at 50%). It is not a full fashion catalogue.',
      'Eleven schema columns carry a single constant value across all 960 records (composition, made_in, season, care_instructions, color, size, gender, supplier_color, discount_pct, in_stock, category1). They are flagged in the table and should not be used as variables.',
      'Five columns are empty: imageurl3, imageurl4, imageurl5, model_measurements, raw_html_url. They remain in the file to keep the 35-column FASHION-PDP contract intact.'
    ],
    schema: [
      { field: 'website_name', type: 'String', fill: '100%', desc: 'farfetch.com' },
      { field: 'competence_date', type: 'ISO Date', fill: '100%', desc: 'Collection timestamp (YYYY-MM-DD)' },
      { field: 'country_code', type: 'ISO 3166-1', fill: '100%', desc: 'USA / destination country' },
      { field: 'currency_code', type: 'ISO 4217', fill: '100%', desc: 'USD' },
      { field: 'brand', type: 'String', fill: '100%', desc: '125 designer brands (Jacquemus, Valentino, Saint Laurent...)' },
      { field: 'product_title', type: 'String', fill: '100%', desc: 'Official product model title' },
      { field: 'product_code', type: 'String / ID', fill: '100%', desc: 'Farfetch internal catalog product identifier' },
      { field: 'sku', type: 'String / ID', fill: '100%', desc: 'Farfetch internal catalog SKU — 100% unique' },
      { field: 'category1', type: 'String', fill: '100%', placeholder: true, desc: 'Constant "Women" across all 960 records — department classification' },
      { field: 'category2', type: 'String', fill: '100%', desc: 'Bags (50.0%) and second category classification' },
      { field: 'category3', type: 'String', fill: '100%', desc: 'Granular subcategory (Shoulder Bags, Tote Bags...)' },
      { field: 'gender', type: 'Enum', fill: '100%', placeholder: true, desc: 'Constant "Female" across all 960 records — target audience' },
      { field: 'color', type: 'String', fill: '100%', placeholder: true, desc: 'Constant "Multi/Neutral" across all 960 records — not a per-item attribute' },
      { field: 'size', type: 'String', fill: '100%', placeholder: true, desc: 'Constant "OS" (One Size) across all 960 records — not a per-item attribute' },
      { field: 'full_price', type: 'Float ($)', fill: '100%', desc: 'Original suggested retail price in USD' },
      { field: 'price', type: 'Float ($)', fill: '100%', desc: 'Current checkout price in USD' },
      { field: 'currency', type: 'ISO 4217', fill: '100%', desc: 'USD' },
      { field: 'discount_pct', type: 'Integer (%)', fill: '100%', placeholder: true, desc: 'Constant 0 — this snapshot contains no marked-down items' },
      { field: 'in_stock', type: 'Boolean', fill: '100%', placeholder: true, desc: 'Constant true across all 960 records' },
      { field: 'composition', type: 'String', fill: '100%', placeholder: true, desc: 'Constant "Calf Leather / Premium Fabric" across all 960 records' },
      { field: 'made_in', type: 'Country', fill: '100%', placeholder: true, desc: 'Constant "Italy" across all 960 records — not a per-item attribute' },
      { field: 'season', type: 'String', fill: '100%', placeholder: true, desc: 'Constant "FW26" across all 960 records' },
      { field: 'care_instructions', type: 'String', fill: '100%', placeholder: true, desc: 'Constant "Specialist Leather Clean" across all 960 records' },
      { field: 'description', type: 'Text', fill: '100%', desc: 'Product editorial description and styling notes' },
      { field: 'itemurl', type: 'URL', fill: '100%', desc: 'Canonical Farfetch product detail URL' },
      { field: 'imageurl1', type: 'URL', fill: '100%', desc: 'Primary high-res product photo' },
      { field: 'imageurl2', type: 'URL', fill: '100%', desc: 'Secondary angle / styling photo' },
      { field: 'imageurl3', type: 'URL', fill: '—', desc: 'Not published by the source; column preserved, values empty' },
      { field: 'imageurl4', type: 'URL', fill: '—', desc: 'Not published by the source; column preserved, values empty' },
      { field: 'imageurl5', type: 'URL', fill: '—', desc: 'Not published by the source; column preserved, values empty' },
      { field: 'designer_style_id', type: 'String', fill: '100%', desc: 'Designer brand style code' },
      { field: 'model_measurements', type: 'String', fill: '—', desc: 'Not published by the source; column preserved, values empty' },
      { field: 'supplier_color', type: 'String', fill: '100%', placeholder: true, desc: 'Constant "Neutral" across all 960 records — not a per-item attribute' },
      { field: 'breadcrumbs', type: 'String', fill: '100%', desc: 'Navigation taxonomy path' },
      { field: 'raw_html_url', type: 'URL', fill: '—', desc: 'Not published by the source; column preserved, values empty' }
    ]
  },
  rightmove: {
    name: 'Rightmove UK National Real Estate Census',
    badge: 'REAL-ESTATE-BASIC • 32 Fields • 544,502 Listings',
    csvUrl: 'samples/rightmove_uk_national_sample.csv',
    filename: 'rightmove_uk_national_census_sample_2026.csv',
    subject: '[Dataset License] Rightmove UK National Real Estate Census Inquiry',
    coverage: '100% of all 3,121 UK postal outcodes — England, Scotland and Wales',
    displayCols: ['listing_id', 'property_type', 'title', 'price', 'price_per_sqm', 'area_sqm', 'rooms', 'bathrooms', 'region', 'city', 'agency_name'],
    // Fill rates below are MEASURED on the delivered dataset, not estimated.
    // For rooms and bathrooms we report the share of records carrying a
    // meaningful value (> 0), which is lower — and truer — than raw field
    // presence. Four fields are not published by the UK source and are listed
    // as such rather than omitted.
    notes: [
      '342 listings (0.06%) carry a price below GBP 1,000, including some at GBP 1. These are genuine Rightmove entries — typically auction lots published with a nominal guide price. They are preserved rather than silently filtered so the dataset mirrors what the portal actually published. Apply your own price floor when modelling valuations.',
      'Four schema fields (floor, has_elevator, energy_certificate, contact_phone) are not published by Rightmove and arrive empty. They remain in the file to keep the 32-column REAL-ESTATE-BASIC contract intact.'
    ],
    schema: [
      { field: 'website_name', type: 'String', fill: '100%', desc: 'rightmove.co.uk' },
      { field: 'competence_date', type: 'ISO Date', fill: '100%', desc: 'Collection date (YYYY-MM-DD)' },
      { field: 'country_code', type: 'ISO 3166-1', fill: '100%', desc: 'GBR' },
      { field: 'currency_code', type: 'ISO 4217', fill: '100%', desc: 'GBP' },
      { field: 'listing_id', type: 'String / ID', fill: '100%', desc: 'Rightmove listing identifier — 100% unique, zero duplicates' },
      { field: 'operation_type', type: 'Enum', fill: '100%', placeholder: true, desc: 'sale — every record in this dataset is a sale listing' },
      { field: 'property_type', type: 'Enum', fill: '100%', desc: '61 distinct types (Detached, Semi-Detached, Terraced, Flat, Apartment...)' },
      { field: 'title', type: 'String', fill: '100%', desc: 'Listing headline as published' },
      { field: 'price', type: 'Float (£)', fill: '100%', desc: 'Asking price in GBP — median £335,000, mean £480,592' },
      { field: 'price_original', type: 'Float (£)', fill: '100%', desc: 'Asking price prior to any reduction' },
      { field: 'price_per_sqm', type: 'Float (£/m²)', fill: '100%', desc: 'Normalized price per square metre' },
      { field: 'area_sqm', type: 'Float (m²)', fill: '100%', desc: 'Floor area in square metres' },
      { field: 'rooms', type: 'Integer', fill: '97.6%', basis: 'positive', desc: 'Bedroom count — share carrying a value above zero' },
      { field: 'bathrooms', type: 'Integer', fill: '93.3%', basis: 'positive', desc: 'Bathroom count — share carrying a value above zero' },
      { field: 'floor', type: 'String', fill: '—', desc: 'Not published by the UK source; column preserved, values empty' },
      { field: 'has_elevator', type: 'Boolean', fill: '—', desc: 'Not published by the UK source; column preserved, values empty' },
      { field: 'has_parking', type: 'Boolean', fill: '24.7%', desc: 'Parking or garage flagged in the listing' },
      { field: 'has_terrace', type: 'Boolean', fill: '16.2%', desc: 'Balcony or terrace flagged in the listing' },
      { field: 'has_garden', type: 'Boolean', fill: '27.6%', desc: 'Garden flagged in the listing' },
      { field: 'has_pool', type: 'Boolean', fill: '1.5%', desc: 'Swimming pool flagged in the listing' },
      { field: 'energy_certificate', type: 'Enum', fill: '—', desc: 'Not published by the UK source; column preserved, values empty' },
      { field: 'region', type: 'String', fill: '100%', desc: '402 distinct regions — counties, boroughs and Scottish shires' },
      { field: 'city', type: 'String', fill: '100%', desc: 'Town or city' },
      { field: 'neighborhood', type: 'String', fill: '100%', desc: 'Locality or district' },
      { field: 'address_raw', type: 'String', fill: '100%', desc: 'Address line with partial outcode as published' },
      { field: 'latitude', type: 'Geo Float', fill: '100%', desc: 'WGS84 latitude' },
      { field: 'longitude', type: 'Geo Float', fill: '100%', desc: 'WGS84 longitude' },
      { field: 'agency_name', type: 'String', fill: '100%', desc: 'Listing estate agency — business entity, not an individual' },
      { field: 'contact_phone', type: 'String', fill: '—', desc: 'Deliberately not collected; dataset contains no personal contact data' },
      { field: 'description', type: 'Text', fill: '100%', desc: 'Full agent listing description' },
      { field: 'itemurl', type: 'URL', fill: '100%', desc: 'Canonical listing URL — 100% absolute https' },
      { field: 'imageurl', type: 'URL', fill: '100%', desc: 'Primary listing image URL' }
    ]
  }
};

// Parse semicolon-delimited CSV text
function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = lines[0].split(';').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = lines.slice(1).map(line => {
    const values = [];
    let insideQuote = false;
    let entry = '';
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === ';' && !insideQuote) {
        values.push(entry.trim().replace(/^"|"$/g, ''));
        entry = '';
      } else {
        entry += char;
      }
    }
    values.push(entry.trim().replace(/^"|"$/g, ''));
    return values;
  });
  return { headers, rows };
}

// Open dataset inspector modal
// Helper: render sample table with sanitized rows
function renderSampleTable(spec, headers, rows) {
  const tableContainer = document.getElementById('modal-table-container');
  if (!tableContainer) return;

  const targetCols = spec.displayCols || headers.slice(0, 10);
  const colIndices = targetCols.map(c => headers.indexOf(c)).filter(idx => idx !== -1);

  let tableHTML = '<table class="modal-table"><thead><tr>';
  colIndices.forEach(idx => {
    tableHTML += `<th>${headers[idx]}</th>`;
  });
  tableHTML += '</tr></thead><tbody>';

  const sampleRows = rows.slice(0, 10);
  sampleRows.forEach(r => {
    tableHTML += '<tr>';
    colIndices.forEach(idx => {
      const val = r[idx] || '—';
      tableHTML += `<td>${val}</td>`;
    });
    tableHTML += '</tr>';
  });
  tableHTML += '</tbody></table>';
  tableContainer.innerHTML = tableHTML;
}

// Open dataset inspector modal (Instant embedded render + resilient download)
function openDatasetModal(datasetKey) {
  const spec = DATASET_SPECS[datasetKey];
  if (!spec) return;

  const modal = document.getElementById('dataset-modal');
  const badgeEl = document.getElementById('modal-badge');
  const titleEl = document.getElementById('modal-title');
  const schemaContainer = document.getElementById('modal-schema-container');
  const downloadBtn = document.getElementById('modal-download-btn');
  const licenseBtn = document.getElementById('modal-license-btn');

  if (badgeEl) badgeEl.textContent = spec.badge;
  if (titleEl) titleEl.textContent = spec.name;
  if (licenseBtn) licenseBtn.setAttribute('href', 'mailto:sales@hlpdata.com?subject=' + encodeURIComponent(spec.subject));

  // Reset tabs to sample data
  document.querySelectorAll('.modal-tab').forEach(t => {
    t.classList.toggle('active', t.getAttribute('data-tab') === 'sample');
  });
  const paneSample = document.getElementById('pane-sample');
  const paneSchema = document.getElementById('pane-schema');
  if (paneSample) paneSample.classList.add('active');
  if (paneSchema) paneSchema.classList.remove('active');

  // Render schema tab
  if (schemaContainer) {
    let schemaHTML = '<table class="modal-table"><thead><tr><th>Field Name</th><th>Data Type</th><th>Fill Rate SLA</th><th>Description</th></tr></thead><tbody>';
    spec.schema.forEach(row => {
      // Cột chỉ có một giá trị duy nhất thì "100%" là con số gây ngộ nhận: ô có
      // đầy nhưng không mang thông tin nào. Phải hiện khác màu và nói rõ.
      const fillCell = row.placeholder
        ? `<span class="schema-placeholder" title="Single constant value across the entire dataset — not usable as a variable">${row.fill} &middot; 1 value</span>`
        : `<span class="text-emerald font-mono"${row.basis === 'positive' ? ' title="Share of records carrying a value above zero"' : ''}>${row.fill}</span>`;
      schemaHTML += `<tr><td><strong>${row.field}</strong></td><td><span class="badge-tag">${row.type}</span></td><td>${fillCell}</td><td>${row.desc}</td></tr>`;
    });
    schemaHTML += '</tbody></table>';

    // Coverage line and disclosure notes. Rendered under the schema table so a
    // buyer sees the caveats BEFORE licensing, not after. A dataset that
    // discloses its own rough edges is easier to trust than one that hides them.
    if (spec.coverage) {
      schemaHTML += `<p class="modal-coverage"><strong>Coverage:</strong> ${spec.coverage}</p>`;
    }
    if (Array.isArray(spec.notes) && spec.notes.length) {
      schemaHTML += '<div class="modal-notes"><h4>Data notes &amp; known caveats</h4><ul>';
      spec.notes.forEach(n => { schemaHTML += `<li>${n}</li>`; });
      schemaHTML += '</ul></div>';
    }
    schemaContainer.innerHTML = schemaHTML;
  }

  // 1. INSTANT RENDER FROM EMBEDDED CACHE (0ms latency, zero point of failure)
  const embedded = EMBEDDED_SAMPLES[datasetKey];
  if (embedded && embedded.headers && embedded.rows) {
    renderSampleTable(spec, embedded.headers, embedded.rows);
  }

  // 2. CONFIGURE DOWNLOAD BUTTON (with instant Blob fallback for file:// or offline)
  if (downloadBtn) {
    downloadBtn.setAttribute('href', spec.csvUrl);
    downloadBtn.setAttribute('download', spec.filename);
    downloadBtn.onclick = function(e) {
      if (window.location.protocol === 'file:' || !window.navigator.onLine) {
        e.preventDefault();
        try {
          if (embedded && embedded.headers && embedded.rows) {
            const csvRows = [embedded.headers.join(';')];
            embedded.rows.forEach(r => csvRows.push(r.join(';')));
            const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = spec.filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
          }
        } catch(err) {
          window.open(spec.csvUrl, '_blank');
        }
      }
    };
  }

  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  // 3. PROGRESSIVE ENHANCEMENT: Fetch live CSV if online (never break UI on error)
  if (window.location.protocol !== 'file:') {
    fetch(spec.csvUrl)
      .then(res => res.ok ? res.text() : null)
      .then(text => {
        if (!text) return;
        const { headers, rows } = parseCSV(text);
        if (headers && headers.length > 0 && rows && rows.length > 0) {
          renderSampleTable(spec, headers, rows);
        }
      })
      .catch(err => {
        console.debug('Live fetch skipped, using embedded dataset:', err);
      });
  }
}

// Expose globally
window.openDatasetModal = openDatasetModal;
window.closeDatasetModal = closeDatasetModal;
window.renderSampleTable = renderSampleTable;

function closeDatasetModal() {
  const modal = document.getElementById('dataset-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  detectInitialLanguage();

  // Attach direct click listener to copy pills
  document.querySelectorAll('.copy-pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      copyEmail('sales@hlpdata.com', btn);
    });
  });

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

  // Terminal tabs switching (audit | s3 | python)
  document.querySelectorAll('.term-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const termTarget = tab.getAttribute('data-term');
      document.querySelectorAll('.term-tab').forEach(t => t.classList.toggle('active', t === tab));
      document.querySelectorAll('.term-pane').forEach(p => {
        p.classList.toggle('active', p.id === `term-pane-${termTarget}`);
      });
    });
  });

  // Dataset inspector modal triggers
  document.querySelectorAll('.inspect-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const ds = btn.getAttribute('data-dataset');
      openDatasetModal(ds);
    });
  });

  const modalClose = document.getElementById('modal-close');
  if (modalClose) modalClose.addEventListener('click', closeDatasetModal);

  const modalOverlay = document.getElementById('dataset-modal');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeDatasetModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDatasetModal();
  });

  // Modal tabs switching (sample | schema)
  document.querySelectorAll('.modal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabTarget = tab.getAttribute('data-tab');
      document.querySelectorAll('.modal-tab').forEach(t => t.classList.toggle('active', t === tab));
      document.querySelectorAll('.modal-pane').forEach(pane => {
        pane.classList.toggle('active', pane.id === `pane-${tabTarget}`);
      });
    });
  });

  // Idealista Metric Toggle Buttons (€/sqm vs Total Price)
  const btnSqm = document.getElementById('btn-chart1-sqm');
  const btnPrice = document.getElementById('btn-chart1-price');
  if (btnSqm && btnPrice) {
    btnSqm.addEventListener('click', () => {
      if (currentIdealistaMetric === 'sqm') return;
      btnSqm.classList.add('active');
      btnPrice.classList.remove('active');
      currentIdealistaMetric = 'sqm';
      initAnalyticsCharts();
    });
    btnPrice.addEventListener('click', () => {
      if (currentIdealistaMetric === 'price') return;
      btnPrice.classList.add('active');
      btnSqm.classList.remove('active');
      currentIdealistaMetric = 'price';
      initAnalyticsCharts();
    });
  }

  // Initialize Analytics Charts
  initAnalyticsCharts();
});

// ==========================================================================
// Market Intelligence & Interactive Analytics Charts
// ==========================================================================

let idealistaChartInstance = null;
let continentePromoChartInstance = null;
let currentIdealistaMetric = 'sqm'; // 'sqm' | 'price'

const IDEALISTA_DATA = {
  labels: ['Lisboa', 'Porto', 'Madeira', 'Faro (Algarve)', 'Setúbal', 'Leiria', 'Viana do Castelo', 'Aveiro', 'Santarém', 'Braga', 'Évora', 'Coimbra', 'Viseu'],
  sqm: [6798, 4747, 4444, 4236, 3858, 2717, 2396, 2298, 2201, 2164, 2141, 2119, 1716],
  price: [799000, 610900, 977500, 699250, 650000, 539500, 350000, 390000, 470000, 425000, 452750, 337500, 325000]
};

const CONTINENTE_DATA = {
  labels: ['Bebé (Baby Care)', 'Frescos (Fresh)', 'Animais (Pets)', 'Mercearia (Pantry)', 'Bebidas (Wine/Drinks)', 'Congelados (Frozen)'],
  promoRate: [84.6, 8.7, 4.9, 4.2, 1.1, 0.5],
  avgDiscount: [20.0, 17.5, 21.2, 14.4, 65.2, 19.0]
};

function getChartColors() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  return {
    gridColor: isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.07)',
    textColor: isLight ? '#475569' : '#94a3b8',
    primaryBar: isLight ? '#059669' : '#10b981',
    secondaryBar: isLight ? '#0284c7' : '#38bdf8',
    dimBar: isLight ? 'rgba(100, 116, 139, 0.25)' : 'rgba(148, 163, 184, 0.3)',
    tooltipBg: isLight ? '#ffffff' : '#121927',
    tooltipBorder: isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.15)',
    tooltipTitle: isLight ? '#090d16' : '#f8fafc',
    tooltipBody: isLight ? '#334155' : '#cbd5e1'
  };
}

function updateChartsTheme() {
  if (typeof Chart === 'undefined') return;
  initAnalyticsCharts();
}

function initAnalyticsCharts() {
  if (typeof Chart === 'undefined') return;

  const ctx1 = document.getElementById('idealistaDistrictChart');
  const ctx2 = document.getElementById('continentePromoChart');
  if (!ctx1 || !ctx2) return;

  const colors = getChartColors();

  // 1. Idealista Horizontal Bar Chart
  if (idealistaChartInstance) {
    idealistaChartInstance.destroy();
  }

  const isSqm = currentIdealistaMetric === 'sqm';
  const data1 = isSqm ? IDEALISTA_DATA.sqm : IDEALISTA_DATA.price;
  const barColors1 = IDEALISTA_DATA.labels.map((_, i) => i === 0 ? colors.primaryBar : (i < 4 ? colors.secondaryBar : colors.dimBar));

  idealistaChartInstance = new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: IDEALISTA_DATA.labels,
      datasets: [{
        label: isSqm ? 'Median Price € / m²' : 'Median Asking Price (€)',
        data: data1,
        backgroundColor: barColors1,
        borderRadius: 5,
        borderSkipped: false
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 350 },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: colors.tooltipBg,
          borderColor: colors.tooltipBorder,
          borderWidth: 1,
          titleColor: colors.tooltipTitle,
          bodyColor: colors.tooltipBody,
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (ctx) => {
              const val = ctx.raw;
              return isSqm
                ? ` Median: €${val.toLocaleString()} / m²`
                : ` Median Asking Price: €${val.toLocaleString()}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: colors.gridColor },
          ticks: {
            color: colors.textColor,
            font: { family: "'JetBrains Mono', monospace", size: 10 },
            callback: (v) => isSqm ? `€${v}` : `€${v >= 1000 ? (v / 1000) + 'k' : v}`
          }
        },
        y: {
          grid: { display: false },
          ticks: {
            color: colors.textColor,
            font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 }
          }
        }
      }
    }
  });

  // 2. Continente Grouped Bar Chart
  if (continentePromoChartInstance) {
    continentePromoChartInstance.destroy();
  }

  continentePromoChartInstance = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: CONTINENTE_DATA.labels,
      datasets: [
        {
          label: 'Promotion Rate (% of SKUs)',
          data: CONTINENTE_DATA.promoRate,
          backgroundColor: colors.primaryBar,
          borderRadius: 5
        },
        {
          label: 'Average Discount Depth (%)',
          data: CONTINENTE_DATA.avgDiscount,
          backgroundColor: colors.secondaryBar,
          borderRadius: 5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 350 },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: colors.textColor,
            font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 },
            boxWidth: 12,
            padding: 12
          }
        },
        tooltip: {
          backgroundColor: colors.tooltipBg,
          borderColor: colors.tooltipBorder,
          borderWidth: 1,
          titleColor: colors.tooltipTitle,
          bodyColor: colors.tooltipBody,
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw}%`
          }
        }
      },
      scales: {
        y: {
          grid: { color: colors.gridColor },
          ticks: {
            color: colors.textColor,
            font: { family: "'JetBrains Mono', monospace", size: 10 },
            callback: (v) => `${v}%`
          },
          suggestedMax: 90
        },
        x: {
          grid: { display: false },
          ticks: {
            color: colors.textColor,
            font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 }
          }
        }
      }
    }
  });
}

