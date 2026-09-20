// HLP Data — Portfolio Script (Taste-skill clean, theme switcher, i18n [EN | ES | PT] with IP auto-detection)

const LUSOPHONE_COUNTRIES = ['PT', 'BR', 'AO', 'MZ', 'CV', 'GW', 'ST', 'TL'];
const HISPANOPHONE_COUNTRIES = ['ES', 'MX', 'AR', 'CO', 'CL', 'PE', 'VE', 'EC', 'GT', 'CU', 'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PR', 'PA', 'UY', 'GQ'];

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

  es: {
    nav_datasets: 'Datasets',
    nav_pipeline: 'Arquitectura',
    nav_stack: 'Tecnologías',
    nav_experience: 'Trayectoria',
    nav_contact_btn: 'Contacto',
    mobile_contact_me: 'Contactar',

    hero_status: 'Disponible para Contratos de Data Engineering y Feeds Cloud',
    hero_headline: 'Pipelines de datos autónomos y web crawlers resilientes a escala.',
    hero_subtext: 'Especializado en infraestructura de extracción de alto rendimiento que supera sistemas anti-bot modernos (Cloudflare Turnstile, WAF) y entrega datasets 100% verificados directamente en data lakes AWS S3.',
    hero_cta_explore: 'Explorar Datasets',
    hero_cta_hire: 'Solicitar Feed a Medida',
    hero_cta_cv: 'Imprimir CV (PDF)',

    metric_lbl_1: 'Inmuebles Verificados (PT y UK)',
    metric_lbl_2: 'SKUs en Catálogo (FMCG y Lujo)',
    metric_lbl_3: 'Tasa de Aceptación de Compradores',
    metric_lbl_4: 'Riesgo de PII (Exclusivo Catálogo Público)',

    terminal_title: 'buyer_audit.sh • en ejecución',
    terminal_tag_engine: 'Motor Nativo AppleScript + CDP',
    terminal_tag_s3: 'Listo para Ingesta S3',

    datasets_heading: 'Datasets Comerciales Verificados y Feeds en Producción',
    datasets_desc: 'Datasets de grado empresarial extraídos de portales complejos, auditados frente a estrictos esquemas de compradores y listos para integración S3.',

    ds1_badge: 'Inmobiliario • Portugal',
    ds1_status: 'Listo Comercial',
    ds1_name: 'Feed Inmobiliario Nacional Idealista Portugal',
    ds1_summary: 'Inteligencia inmobiliaria integral que abarca 13 distritos de Portugal (Lisboa, Oporto, Algarve, Setúbal, Braga, Coímbra, etc.). Incluye valoración por m², dormitorios, baños, elevación de planta, comodidades (terraza/garaje) y geocodificación normalizada.',
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
    ds2_preview_tag: '🔒 Vista previa: 3 de 2.059 SKUs',
    ds2_preview_footer: 'Feed comercial completo entregado vía S3 privado / API',
    ds2_meta_records: '<strong>2.059</strong> SKUs',
    ds2_meta_cols: '<strong>31</strong> columnas',
    ds2_meta_s3: '<strong>Verificado en S3</strong>',
    ds2_btn: 'Solicitar Muestra / Licencia',

    ds3_badge: 'Moda de Lujo • Global',
    ds3_status: 'Auditoría Comprador: 100/100',
    ds3_name: 'Feed Global de Moda de Lujo y Precios Farfetch',
    ds3_summary: 'Inteligencia curada de 120 artículos de lujo de las principales casas de moda: Jacquemus, Valentino Garavani, Balmain, Bottega Veneta, Saint Laurent, Christian Louboutin, Tom Ford y Moncler. Esquema FASHION-PDP de 35 atributos con precios originales, descuentos, multimoneda, stock y enlaces de imágenes.',
    ds3_th_brand: 'Marca / Artículo',
    ds3_th_price: 'Precio (USD)',
    ds3_th_cat: 'Categoría',
    ds3_th_origin: 'Origen',
    ds3_preview_tag: '🔒 Vista previa: 3 de 120 artículos',
    ds3_preview_footer: 'Feed comercial completo entregado vía S3 privado / API',
    ds3_meta_records: '<strong>120</strong> SKUs verificados',
    ds3_meta_cols: '<strong>35</strong> cols (FASHION-PDP)',
    ds3_meta_audit: '<strong>100 / 100</strong> Auditoría Comprador',
    ds3_btn: 'Solicitar Muestra / Licencia',

    ds4_badge: 'Inmobiliario • Reino Unido',
    ds4_status: 'Auditoría Comprador: 100/100',
    ds4_name: 'Feed Inmobiliario de Londres y Reino Unido Rightmove',
    ds4_summary: 'Inteligencia de mercado exhaustiva que cubre 500 propiedades verificadas en Gran Londres y Prime Central London. 100% conforme con el esquema REAL-ESTATE-BASIC en 32 atributos obligatorios: coordenadas GPS, m² habitables, precios de venta, dormitorios/baños, calificaciones energéticas EPC y planos.',
    ds4_th_loc: 'Ubicación Inmueble',
    ds4_th_price: 'Precio',
    ds4_th_beds: 'Dormitorios',
    ds4_th_agency: 'Agencia',
    ds4_preview_tag: '🔒 Vista previa: 3 de 500 anuncios',
    ds4_preview_footer: 'Feed comercial completo entregado vía S3 privado / API',
    ds4_meta_records: '<strong>500</strong> propiedades verificadas',
    ds4_meta_cols: '<strong>32</strong> cols (REAL-ESTATE-BASIC)',
    ds4_meta_audit: '<strong>100 / 100</strong> Auditoría Comprador',
    ds4_meta_gps: '<strong>GPS y Planos</strong>',
    ds4_btn: 'Solicitar Muestra / Licencia',

    pipeline_heading: 'Arquitectura de Pipeline Autónoma',
    pipeline_desc: 'Diseñada para resiliencia, cero intervención humana y entrega determinista en la nube.',
    step1_title: 'Motor de Ingestión Resiliente',
    step1_desc: 'Arquitectura híbrida que combina el control de sockets Chrome DevTools Protocol (CDP) con puentes IPC nativos a nivel de SO. Neutraliza Cloudflare Turnstile, la entropía de huellas digitales y canvas dinámicos con fluctuaciones de comportamiento humano real.',
    step2_title: 'Comprobación Determinista de Esquemas',
    step2_desc: 'Filtros automatizados verifican el 100% de las filas antes de su entrega. Garantiza la adherencia al esquema (32 cols Inmobiliario, 31 cols FMCG, 35 cols Lujo), límites de precios positivos, geocódigos válidos y codificación UTF-8-SIG con punto y coma.',
    step3_title: 'Entrega Cloud S3 y Handshake Autónomo',
    step3_desc: 'Entrega automatizada directa a buckets de almacenamiento Amazon S3 del comprador. El pipeline supervisa los recibos de aceptación automáticos (approved.txt), gestiona reintentos exponenciales y registra métricas de liquidación de forma desatendida.',

    stack_heading: 'Tecnologías Centrales',
    stack_desc: 'Herramientas, frameworks y protocolos implementados en operaciones diarias de extracción intensiva.',
    stack_cat1: 'Scraping y Automatización',
    stack_cat2: 'Infraestructura de Datos y Cloud',
    stack_cat3: 'Mercados y Gobernanza',
    stack_item_playwright: '<strong>Playwright & Puppeteer:</strong> Automatización headless y visual',
    stack_item_cdp: '<strong>CDP (Chrome DevTools Protocol):</strong> Control de sockets de bajo nivel',
    stack_item_applescript: '<strong>macOS AppleScript Bridge:</strong> IPC nativo del navegador',
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
    record_role1: 'Lead Data Engineer & Fundador • HLP Data Studio',
    record_desc1: 'Diseño y comercialización de sistemas de extracción de alto rendimiento para portales inmobiliarios y de retail europeos. Mantenimiento de una tasa de aceptación del comprador del 100% en entregas cloud Amazon S3 y estatus comercial verificado.',
    record_role2: 'Ingeniero de Automatización de Software y Backend',
    record_desc2: 'Desarrollo de scrapers backend resilientes, integraciones de API y flujos de ingesta en la nube. Creación de suites de pruebas automatizadas para validar la integridad de esquemas y eliminar la degradación silenciosa de datos.',

    contact_heading: '¿Necesita un dataset personalizado o un pipeline de scraping especializado?',
    contact_sub: 'Disponible para contratos de ingeniería de datos a medida, feeds cloud recurrentes y consultoría para superar sistemas anti-bot.',
    contact_lbl_email: 'Correo Corporativo',
    contact_lbl_paypal: 'Facturación Comercial PayPal',
    contact_badge_paypal: 'Empresa Verificada',
    contact_lbl_github: 'Repositorios en GitHub',
    contact_badge_github: 'Código Abierto',
    contact_cta_btn: 'Iniciar Conversación',

    footer_copy: '&copy; 2026 <strong>HLP Data</strong> &bull; Arquitecto Principal: Le Phuoc Hung &bull; Construido con estándares de ingeniería limpia anti-slop.',
    footer_top: 'Volver arriba',
    footer_terms: 'Términos y Conformidad',
    footer_privacy: 'Política de Privacidad',

    copy_btn_text: 'Copiar',
    copied_btn_text: '¡Copiado!'
  },

  pt: {
    nav_datasets: 'Datasets',
    nav_pipeline: 'Arquitetura',
    nav_stack: 'Tecnologias',
    nav_experience: 'Trajetória',
    nav_contact_btn: 'Contacto',
    mobile_contact_me: 'Contactar',

    hero_status: 'Disponível para Contratos de Data Engineering e Feeds Cloud',
    hero_headline: 'Pipelines de dados autónomos & web crawlers resilientes em escala.',
    hero_subtext: 'Especialista em infraestrutura de recolha de alto débito que contorna sistemas anti-bot modernos (Cloudflare Turnstile, WAF) e entrega conjuntos de dados 100% validados diretamente em data lakes AWS S3.',
    hero_cta_explore: 'Explorar Datasets',
    hero_cta_hire: 'Solicitar Feed Dedicado',
    hero_cta_cv: 'Imprimir CV (PDF)',

    metric_lbl_1: 'Imóveis Verificados (PT & UK)',
    metric_lbl_2: 'SKUs em Catálogo (FMCG & Luxo)',
    metric_lbl_3: 'Taxa de Aceitação do Comprador',
    metric_lbl_4: 'Risco de PII (Exclusivo Catálogo Público)',

    terminal_title: 'buyer_audit.sh • em execução',
    terminal_tag_engine: 'Motor Nativo AppleScript + CDP',
    terminal_tag_s3: 'Pronto para Ingestão S3',

    datasets_heading: 'Conjuntos de Dados Comerciais & Feeds em Produção',
    datasets_desc: 'Conjuntos de dados de nível empresarial extraídos de portais complexos, auditados contra esquemas rigorosos de compradores e prontos para sincronização S3.',

    ds1_badge: 'Imobiliário • Portugal',
    ds1_status: 'Pronto Comercial',
    ds1_name: 'Feed Imobiliário Nacional Idealista Portugal',
    ds1_summary: 'Inteligência imobiliária abrangente cobrindo 13 distritos de Portugal (Lisboa, Porto, Algarve, Setúbal, Braga, Coimbra, etc.). Inclui valorização por m², quartos, casas de banho, pisos, comodidades (terraço/garagem) e geocódigos normalizados.',
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
    ds2_preview_tag: '🔒 Pré-visualização: 3 de 2.059 SKUs',
    ds2_preview_footer: 'Feed comercial completo entregue via S3 privado / API',
    ds2_meta_records: '<strong>2.059</strong> SKUs',
    ds2_meta_cols: '<strong>31</strong> colunas',
    ds2_meta_s3: '<strong>Verificado no S3</strong>',
    ds2_btn: 'Solicitar Amostra / Licença',

    ds3_badge: 'Moda de Luxo • Global',
    ds3_status: 'Auditoria Comprador: 100/100',
    ds3_name: 'Feed Global de Moda de Luxo & Preços Farfetch',
    ds3_summary: 'Inteligência selecionada de 120 artigos de luxo das principais casas de moda: Jacquemus, Valentino Garavani, Balmain, Bottega Veneta, Saint Laurent, Christian Louboutin, Tom Ford e Moncler. Esquema FASHION-PDP de 35 atributos com preços originais, descontos, valores multimoeda, disponibilidade de stock e imagens de alta resolução.',
    ds3_th_brand: 'Marca / Artigo',
    ds3_th_price: 'Preço (USD)',
    ds3_th_cat: 'Categoria',
    ds3_th_origin: 'Origem',
    ds3_preview_tag: '🔒 Pré-visualização: 3 de 120 artigos',
    ds3_preview_footer: 'Feed comercial completo entregue via S3 privado / API',
    ds3_meta_records: '<strong>120</strong> SKUs verificados',
    ds3_meta_cols: '<strong>35</strong> cols (FASHION-PDP)',
    ds3_meta_audit: '<strong>100 / 100</strong> Auditoria Comprador',
    ds3_btn: 'Solicitar Amostra / Licença',

    ds4_badge: 'Imobiliário • Reino Unido',
    ds4_status: 'Auditoria Comprador: 100/100',
    ds4_name: 'Feed Imobiliário de Londres & Reino Unido Rightmove',
    ds4_summary: 'Inteligência de mercado completa abrangendo 500 propriedades verificadas na Grande Londres e no centro nobre de Londres. 100% compatível com o esquema REAL-ESTATE-BASIC em 32 atributos obrigatórios: coordenadas GPS, m² de área útil, preços de venda, quartos/casas de banho, certificações energéticas EPC e plantas.',
    ds4_th_loc: 'Localização do Imóvel',
    ds4_th_price: 'Preço',
    ds4_th_beds: 'Quartos',
    ds4_th_agency: 'Agência',
    ds4_preview_tag: '🔒 Pré-visualização: 3 de 500 anúncios',
    ds4_preview_footer: 'Feed comercial completo entregue via S3 privado / API',
    ds4_meta_records: '<strong>500</strong> imóveis verificados',
    ds4_meta_cols: '<strong>32</strong> cols (REAL-ESTATE-BASIC)',
    ds4_meta_audit: '<strong>100 / 100</strong> Auditoria Comprador',
    ds4_meta_gps: '<strong>GPS & Plantas</strong>',
    ds4_btn: 'Solicitar Amostra / Licença',

    pipeline_heading: 'Arquitetura de Pipeline Autónoma',
    pipeline_desc: 'Concebida para resiliência, zero intervenção humana e entrega determinística na cloud.',
    step1_title: 'Motor de Ingestão Resiliente',
    step1_desc: 'Arquitetura híbrida que combina o controlo de sockets Chrome DevTools Protocol (CDP) com pontes IPC nativas a nível do SO. Neutraliza Cloudflare Turnstile, entropia de impressões digitais e desafios canvas com variação realista de comportamento humano.',
    step2_title: 'Validação Determinística de Esquema',
    step2_desc: 'Pontos de controlo automatizados verificam 100% das linhas antes da entrega. Garante conformidade total de esquema (32 cols Imobiliário, 31 cols FMCG, 35 cols Luxo), limites de preços positivos, coordenadas válidas e codificação UTF-8-SIG delimitada por ponto e vírgula.',
    step3_title: 'Entrega Cloud S3 & Handshake Autónomo',
    step3_desc: 'Entrega direta automatizada nos buckets de armazenamento Amazon S3 do comprador. O pipeline monitoriza recibos de aceitação automáticos (approved.txt), efetua repetições automáticas e regista métricas de liquidação sem supervisão manual.',

    stack_heading: 'Tecnologias Centrais',
    stack_desc: 'Ferramentas, bibliotecas e protocolos implementados em operações diárias de extração de alto débito.',
    stack_cat1: 'Scraping & Automação',
    stack_cat2: 'Infraestrutura de Dados & Cloud',
    stack_cat3: 'Mercados & Governança',
    stack_item_playwright: '<strong>Playwright & Puppeteer:</strong> Automação headless e com interface',
    stack_item_cdp: '<strong>CDP (Chrome DevTools Protocol):</strong> Controlo de sockets de baixo nível',
    stack_item_applescript: '<strong>macOS AppleScript Bridge:</strong> IPC nativo do browser',
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
    record_role1: 'Lead Data Engineer & Fundador • HLP Data Studio',
    record_desc1: 'Conceção e comercialização de sistemas de extração de dados de alto rendimento para os principais portais europeus de retalho e imobiliário. Manutenção de taxa de aceitação de 100% nas entregas na cloud Amazon S3 e estatuto comercial verificado.',
    record_role2: 'Engenheiro de Automação de Software & Backend',
    record_desc2: 'Desenvolvimento de scrapers backend resilientes, integrações de API e fluxos de ingestão cloud. Criação de testes automatizados para validar a integridade de esquemas e eliminar erros silenciosos em produção.',

    contact_heading: 'Necessita de um dataset personalizado ou pipeline especializado?',
    contact_sub: 'Disponível para contratos de engenharia de dados à medida, feeds cloud recorrentes e consultoria para contorno de sistemas anti-bot.',
    contact_lbl_email: 'Email Profissional',
    contact_lbl_paypal: 'Faturação Comercial PayPal',
    contact_badge_paypal: 'Empresa Verificada',
    contact_lbl_github: 'Repositórios GitHub',
    contact_badge_github: 'Código Aberto',
    contact_cta_btn: 'Iniciar Conversação',

    footer_copy: '&copy; 2026 <strong>HLP Data</strong> &bull; Arquiteto Principal: Le Phuoc Hung &bull; Construído com padrões de engenharia limpa anti-slop.',
    footer_top: 'Volver ao topo',
    footer_terms: 'Termos & Conformidade',
    footer_privacy: 'Política de Privacidade',

    copy_btn_text: 'Copiar',
    copied_btn_text: 'Copiado!'
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

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  detectInitialLanguage();

  // Attach direct click listener to copy pills
  document.querySelectorAll('.copy-pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      copyEmail('hung@hlpdata.com', btn);
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
});
