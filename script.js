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
    copied_btn_text: 'Copied!',

    btn_inspect_schema: 'Inspect Schema & Sample',
    modal_tab_sample: 'Sample Data (10 Rows)',
    modal_tab_schema: 'Schema Dictionary & SLA',
    modal_btn_download: 'Download Sample CSV (20 Rows)',
    modal_btn_license: 'License Full Commercial Feed'
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
    copied_btn_text: '¡Copiado!',

    btn_inspect_schema: 'Examinar Schema y Muestra',
    modal_tab_sample: 'Datos de Muestra (10 Filas)',
    modal_tab_schema: 'Diccionario de Schema y SLA',
    modal_btn_download: 'Descargar CSV de Muestra (20 Filas)',
    modal_btn_license: 'Licenciar Feed Comercial Completo'
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
    copied_btn_text: 'Copiado!',

    btn_inspect_schema: 'Inspecionar Schema & Amostra',
    modal_tab_sample: 'Dados de Amostra (10 Linhas)',
    modal_tab_schema: 'Dicionário de Schema & SLA',
    modal_btn_download: 'Descarregar CSV de Amostra (20 Linhas)',
    modal_btn_license: 'Licenciar Feed Comercial Completo'
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

/* ==========================================================================
   Dataset Specifications & Modal Controller
   ========================================================================== */
const EMBEDDED_SAMPLES = {"idealista": {"headers": ["﻿website_name", "competence_date", "country_code", "currency_code", "listing_id", "operation_type", "property_type", "title", "price", "price_original", "price_per_sqm", "area_sqm", "rooms", "bathrooms", "floor", "has_elevator", "has_parking", "has_terrace", "has_garden", "has_pool", "energy_certificate", "region", "city", "neighborhood", "address_raw", "latitude", "longitude", "agency_name", "contact_phone", "description", "itemurl", "imageurl"], "rows": [["idealista.pt", "2026-09-20", "PRT", "EUR", "33491028", "sale", "apartment", "Apartamento T2 em Parque das Nações", "450000.0", "450000.0", "4736.84", "95", "2", "2", "4º", "true", "true", "true", "false", "false", "A", "Distrito de Lisboa", "Lisboa", "Parque das Nações", "Alameda dos Oceanos, Lisboa", "38.7672", "-9.0963", "ERA Imobiliária", "+351218000000", "Excelente T2 com vista rio e varanda ampla.", "https://www.idealista.pt/imovel/33491028/", "https://img3.idealista.pt/blur/WEB_DETAIL/0/id.pro.pt.image.master/33/49/10/33491028.jpg"], ["idealista.pt", "2026-09-20", "PRT", "EUR", "33491029", "sale", "apartment", "Apartamento T3 em Campo de Ourique", "585000.0", "610000.0", "4875.0", "120", "3", "2", "2º", "true", "false", "true", "false", "false", "B", "Distrito de Lisboa", "Lisboa", "Campo de Ourique", "Rua Ferreira Borges, Lisboa", "38.7185", "-9.1634", "Remax Prestige", "+351213000001", "T3 totalmente remodelado com varanda e luz natural.", "https://www.idealista.pt/imovel/33491029/", "https://img3.idealista.pt/blur/WEB_DETAIL/0/id.pro.pt.image.master/33/49/10/33491029.jpg"], ["idealista.pt", "2026-09-20", "PRT", "EUR", "33491030", "sale", "house", "Moradia T4 na Foz do Douro", "1850000.0", "1850000.0", "5285.71", "350", "4", "4", "R/C", "false", "true", "true", "true", "true", "A+", "Distrito do Porto", "Porto", "Foz do Douro", "Avenida do Brasil, Porto", "41.1512", "-8.6784", "Sotheby International", "+351226000002", "Exclusiva moradia com jardim privativo e piscina a 100m do mar.", "https://www.idealista.pt/imovel/33491030/", "https://img3.idealista.pt/blur/WEB_DETAIL/0/id.pro.pt.image.master/33/49/10/33491030.jpg"], ["idealista.pt", "2026-09-20", "PRT", "EUR", "33491031", "sale", "apartment", "T1 Moderno na Baixa do Porto", "245000.0", "245000.0", "4900.0", "50", "1", "1", "3º", "true", "false", "false", "false", "false", "B-", "Distrito do Porto", "Porto", "Santo Ildefonso", "Rua de Santa Catarina, Porto", "41.1496", "-8.6053", "Century 21", "+351222000003", "Ideal para investimento com licença de alojamento turístico.", "https://www.idealista.pt/imovel/33491031/", "https://img3.idealista.pt/blur/WEB_DETAIL/0/id.pro.pt.image.master/33/49/10/33491031.jpg"], ["idealista.pt", "2026-09-20", "PRT", "EUR", "33491032", "sale", "house", "Moradia Contemporânea T5 em Cascais", "2950000.0", "3100000.0", "6145.83", "480", "5", "6", "1º", "true", "true", "true", "true", "true", "A+", "Distrito de Lisboa", "Cascais", "Quinta da Marinha", "Rua das Palmeiras, Cascais", "38.7023", "-9.4589", "Engel & Völkers", "+351214000004", "Design de assinatura, acabamentos em mármore e domótica integral.", "https://www.idealista.pt/imovel/33491032/", "https://img3.idealista.pt/blur/WEB_DETAIL/0/id.pro.pt.image.master/33/49/10/33491032.jpg"], ["idealista.pt", "2026-09-20", "PRT", "EUR", "33491033", "sale", "apartment", "T2 com Vista Marina em Vilamoura", "395000.0", "395000.0", "4293.48", "92", "2", "2", "2º", "true", "true", "true", "false", "true", "B", "Distrito de Faro", "Loulé", "Vilamoura", "Avenida Tivoli, Vilamoura", "37.0789", "-8.1189", "Algarve Property", "+351289000005", "Apartamento de luxo a passos da marina e campos de golfe.", "https://www.idealista.pt/imovel/33491033/", "https://img3.idealista.pt/blur/WEB_DETAIL/0/id.pro.pt.image.master/33/49/10/33491033.jpg"], ["idealista.pt", "2026-09-20", "PRT", "EUR", "33491034", "sale", "apartment", "T3 Duplex no Chiado", "980000.0", "980000.0", "6125.0", "160", "3", "3", "4º", "true", "true", "true", "false", "false", "B", "Distrito de Lisboa", "Lisboa", "Chiado", "Rua Garrett, Lisboa", "38.7108", "-9.1412", "Porta da Frente", "+351213000006", "Edifício pombalino recuperado com terraço panorâmico.", "https://www.idealista.pt/imovel/33491034/", "https://img3.idealista.pt/blur/WEB_DETAIL/0/id.pro.pt.image.master/33/49/10/33491034.jpg"], ["idealista.pt", "2026-09-20", "PRT", "EUR", "33491035", "sale", "apartment", "T2 Novo em Matosinhos Sul", "375000.0", "375000.0", "3947.37", "95", "2", "2", "1º", "true", "true", "true", "false", "false", "A", "Distrito do Porto", "Matosinhos", "Matosinhos Sul", "Avenida da República, Matosinhos", "41.1789", "-8.6892", "Chave Nova", "+351229000007", "Construção recente a 200m da praia com garagem fechada.", "https://www.idealista.pt/imovel/33491035/", "https://img3.idealista.pt/blur/WEB_DETAIL/0/id.pro.pt.image.master/33/49/10/33491035.jpg"], ["idealista.pt", "2026-09-20", "PRT", "EUR", "33491036", "sale", "house", "Quinta T4 em Sintra Histórica", "1250000.0", "1300000.0", "3571.43", "350", "4", "3", "R/C", "false", "true", "true", "true", "false", "C", "Distrito de Lisboa", "Sintra", "São Pedro de Penaferrim", "Estrada da Pena, Sintra", "38.7912", "-9.3821", "Luximos Christie", "+351219000008", "Propriedade secular com vista privilegiada para o Palácio da Pena.", "https://www.idealista.pt/imovel/33491036/", "https://img3.idealista.pt/blur/WEB_DETAIL/0/id.pro.pt.image.master/33/49/10/33491036.jpg"], ["idealista.pt", "2026-09-20", "PRT", "EUR", "33491037", "sale", "apartment", "T1 com Garagem no Parque das Nações Norte", "289000.0", "289000.0", "4446.15", "65", "1", "1", "6º", "true", "true", "false", "false", "false", "A", "Distrito de Lisboa", "Lisboa", "Parque das Nações", "Via do Oriente, Lisboa", "38.7782", "-9.0912", "ERA Expo", "+351218000009", "Apartamento luminoso com arrecadação e estacionamento privativo.", "https://www.idealista.pt/imovel/33491037/", "https://img3.idealista.pt/blur/WEB_DETAIL/0/id.pro.pt.image.master/33/49/10/33491037.jpg"]]}, "continente": {"headers": ["﻿website_name", "competence_date", "country_code", "currency_code", "store_id", "product_code", "product_std_code", "std_type", "brand", "product_title", "category1", "category2", "category3", "category4", "category5", "category6", "category7", "category8", "category9", "category10", "package_desc", "full_price", "price", "ppu", "unit_type", "promotion_type", "promotion_end_date", "additional_tags", "additional_content", "itemurl", "imageurl"], "rows": [["continente.pt", "2026-09-19", "PRT", "EUR", "", "6661780", "", "", "", "Porções de Salmão Fresco", "Frescos", "Peixaria", "Filetes, Lombos e Postas", "Fresco", "", "", "", "", "", "", "Quant. Mínima = 300 gr (2 un)", "2.99", "2.99", "19.93", "kg", "", "", "", "Disponível", "https://www.continente.pt/produto/porcoes-de-salmao-fresco-6661780.html", "https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw17370d84/images/col/666/6661780-cima-pedra.jpg?sw=280&sh=280"], ["continente.pt", "2026-09-19", "PRT", "EUR", "", "6282115", "", "", "Continente", "Salsichas Frescas de Peru Continente", "Frescos", "Talho", "Frango e Peru", "Peru", "", "", "", "", "", "", "emb. 500 gr", "3.49", "3.09", "6.18", "kg", "-10%", "", "", "Disponível", "https://www.continente.pt/produto/salsichas-frescas-de-peru-continente-6282115.html", "https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw3a0a02d1/images/col/628/6282115-frente.jpg?sw=280&sh=280"], ["continente.pt", "2026-09-19", "PRT", "EUR", "", "7082480", "", "", "Continente Seleção", "Hambúrguer 100% Carne de Novilho Angus Continente Seleção", "Frescos", "Talho", "Novilho, Vitela e Vitelão", "", "", "", "", "", "", "", "2 un x 150 gr (300 gr)", "5.19", "5.19", "17.30", "kg", "", "", "", "Disponível", "https://www.continente.pt/produto/hamburguer-100--carne-de-novilho-angus-continente-selecao-7082480.html", "https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw66c334be/images/col/708/7082480-frente.jpg?sw=280&sh=280"], ["continente.pt", "2026-09-19", "PRT", "EUR", "", "7421333", "", "", "Continente", "Hambúrguer Powered By Plants Continente", "Frescos", "Take-Away", "Vegetariano e Vegan", "Pronto a Cozinhar", "", "", "", "", "", "", "2 un x 100 gr (200 gr)", "3.59", "3.59", "17.95", "kg", "", "", "", "Disponível", "https://www.continente.pt/produto/hamburguer-powered-by-plants-continente-7421333.html", "https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dwdb8331af/images/col/742/7421333-frente.jpg?sw=280&sh=280"], ["continente.pt", "2026-09-19", "PRT", "EUR", "", "8897646", "", "", "Continente Seleção", "Tábua Italiana Continente Seleção", "Frescos", "Charcutaria", "Tábuas e Aperitivos", "", "", "", "", "", "", "", "emb. 280 g", "11.59", "9.85", "35.18", "kg", "-15%", "", "", "Disponível", "https://www.continente.pt/produto/tabua-italiana-continente-selecao-8897646.html", "https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dwf7d232b6/images/col/889/8897646-frente.jpg?sw=280&sh=280"], ["continente.pt", "2026-09-19", "PRT", "EUR", "", "4517263", "", "", "Continente", "Picanha de Bovino América do Sul Inteira Continente", "Frescos", "Talho", "Novilho, Vitela e Vitelão", "", "", "", "", "", "", "", "emb. 1,5 kg (aprox.)", "19.99", "19.99", "29.99", "un", "", "", "", "Disponível", "https://www.continente.pt/produto/picanha-de-bovino-america-do-sul-inteira-continente-4517263.html", "https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dwc233a8e6/images/col/451/4517263-frente.jpg?sw=280&sh=280"], ["continente.pt", "2026-09-19", "PRT", "EUR", "", "6872502", "", "", "Continente", "Cabaz de Frutas da Época Continente", "Frescos", "Frutas", "Cabazes de Frutas e Legumes", "", "", "", "", "", "", "", "emb. 5 kg", "18.99", "18.99", "3.80", "kg", "", "", "", "Disponível", "https://www.continente.pt/produto/cabaz-de-frutas-da-epoca-continente-6872502.html", "https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw5033a17b/images/col/687/6872502-cima.jpg?sw=280&sh=280"], ["continente.pt", "2026-09-19", "PRT", "EUR", "", "8716957", "", "", "Pastelaria Careca", "Croissant Edição Especial Pastelaria Careca", "Frescos", "Padaria e Pastelaria", "Croissants e Pães de Leite", "", "", "", "", "", "", "", "Quant. Mínima = 2 un", "0.99", "0.99", "9.43", "kg", "", "", "", "Disponível", "https://www.continente.pt/produto/croissant-edicao-especial-pastelaria-careca-8716957.html", "https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw2cf6d823/images/col/871/8716957-cima-acessorio.jpg?sw=280&sh=280"], ["continente.pt", "2026-09-19", "PRT", "EUR", "", "7740959", "", "", "Cozinha Continente", "Bacalhau à Gomes de Sá Cozinha Continente", "Frescos", "Take-Away", "Refeições Prontas", "", "", "", "", "", "", "", "emb. 300 gr", "4.29", "4.29", "14.30", "kg", "", "", "", "Disponível", "https://www.continente.pt/produto/bacalhau-a-gomes-de-sa-cozinha-continente-7740959.html", "https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw1a92a628/images/col/774/7740959-topshot.jpg?sw=280&sh=280"], ["continente.pt", "2026-09-19", "PRT", "EUR", "", "7371652", "", "", "", "Pão de Abóbora e Nozes", "Frescos", "Padaria e Pastelaria", "Pão do Dia e Broa", "", "", "", "", "", "", "", "Quant. Mínima = 2 un", "0.49", "0.49", "4.90", "kg", "", "", "", "Disponível", "https://www.continente.pt/produto/pao-de-abobora-e-nozes-7371652.html", "https://www.continente.pt/dw/image/v2/BDVS_PRD/on/demandware.static/-/Sites-col-master-catalog/default/dw885e640d/images/col/737/7371652-cima-acessorio.png?sw=280&sh=280"]]}, "farfetch": {"headers": ["﻿﻿website_name", "competence_date", "country_code", "currency_code", "brand", "product_title", "product_code", "sku", "category1", "category2", "category3", "gender", "color", "size", "full_price", "price", "currency", "discount_pct", "in_stock", "composition", "made_in", "season", "care_instructions", "description", "itemurl", "imageurl1", "imageurl2", "imageurl3", "imageurl4", "imageurl5", "designer_style_id", "model_measurements", "supplier_color", "breadcrumbs", "raw_html_url"], "rows": [["farfetch.com", "2026-09-20", "USA", "USD", "Jacquemus", "woven knot detail tote bag", "35233400", "35233400", "Women", "Bags", "Tote & Shoulder Bags", "Female", "Multi/Neutral", "OS", "1865", "1865", "USD", "0", "true", "Calf Leather / Premium Suede", "Italy", "FW26", "Specialist Leather Clean", "Jacquemus - woven knot detail tote bag. Crafted with exceptional artisan materials.", "https://www.farfetch.com/vn/shopping/women/jacquemus-woven-knot-detail-tote-bag-item-35233400.aspx", "https://cdn-images.farfetch-contents.com/35/23/34/00/35233400_66672994_480.jpg?ov=true", "", "", "", "", "35233400", "", "Neutral", "Women > Bags > Designer Handbags", ""], ["farfetch.com", "2026-09-20", "USA", "USD", "DeMellier", "The Hudson brown tote bag", "32363001", "32363001", "Women", "Bags", "Tote & Shoulder Bags", "Female", "Multi/Neutral", "OS", "674", "674", "USD", "0", "true", "Calf Leather / Premium Suede", "Italy", "FW26", "Specialist Leather Clean", "DeMellier - The Hudson brown tote bag. Crafted with exceptional artisan materials.", "https://www.farfetch.com/vn/shopping/women/demellier-the-hudson-brown-tote-bag-item-32363001.aspx", "https://cdn-images.farfetch-contents.com/32/36/30/01/32363001_63810215_480.jpg?ov=true", "", "", "", "", "32363001", "", "Neutral", "Women > Bags > Designer Handbags", ""], ["farfetch.com", "2026-09-20", "USA", "USD", "Valentino Garavani", "Antibes small embroidered denim shopping bag", "34057167", "34057167", "Women", "Bags", "Tote & Shoulder Bags", "Female", "Multi/Neutral", "OS", "2550", "2550", "USD", "0", "true", "Calf Leather / Premium Suede", "Italy", "FW26", "Specialist Leather Clean", "Valentino Garavani - Antibes small embroidered denim shopping bag. Crafted with exceptional artisan materials.", "https://www.farfetch.com/vn/shopping/women/valentino-garavani-antibes-small-embroidered-denim-shopping-bag-item-34057167.aspx", "https://cdn-images.farfetch-contents.com/34/05/71/67/34057167_67949778_480.jpg?ov=true", "", "", "", "", "34057167", "", "Neutral", "Women > Bags > Designer Handbags", ""], ["farfetch.com", "2026-09-20", "USA", "USD", "ISABEL MARANT", "Maia medium bag", "34000136", "34000136", "Women", "Bags", "Tote & Shoulder Bags", "Female", "Multi/Neutral", "OS", "1430", "1430", "USD", "0", "true", "Calf Leather / Premium Suede", "Italy", "FW26", "Specialist Leather Clean", "ISABEL MARANT - Maia medium bag. Crafted with exceptional artisan materials.", "https://www.farfetch.com/vn/shopping/women/isabel-marant-maia-medium-bag-item-34000136.aspx", "https://cdn-images.farfetch-contents.com/34/00/01/36/34000136_65195696_480.jpg?ov=true", "", "", "", "", "34000136", "", "Neutral", "Women > Bags > Designer Handbags", ""], ["farfetch.com", "2026-09-20", "USA", "USD", "Proenza Schouler", "Days mesh tote bag", "34017376", "34017376", "Women", "Bags", "Tote & Shoulder Bags", "Female", "Multi/Neutral", "OS", "1270", "1270", "USD", "0", "true", "Calf Leather / Premium Suede", "Italy", "FW26", "Specialist Leather Clean", "Proenza Schouler - Days mesh tote bag. Crafted with exceptional artisan materials.", "https://www.farfetch.com/vn/shopping/women/proenza-schouler-days-mesh-tote-bag-item-34017376.aspx", "https://cdn-images.farfetch-contents.com/34/01/73/76/34017376_65242952_480.jpg?ov=true", "", "", "", "", "34017376", "", "Neutral", "Women > Bags > Designer Handbags", ""], ["farfetch.com", "2026-09-20", "USA", "USD", "Jacquemus", "Spiaggia small round bag", "32426014", "32426014", "Women", "Bags", "Tote & Shoulder Bags", "Female", "Multi/Neutral", "OS", "432", "432", "USD", "0", "true", "Calf Leather / Premium Suede", "Italy", "FW26", "Specialist Leather Clean", "Jacquemus - Spiaggia small round bag. Crafted with exceptional artisan materials.", "https://www.farfetch.com/vn/shopping/women/jacquemus-spiaggia-small-round-bag-item-32426014.aspx", "https://cdn-images.farfetch-contents.com/32/42/60/14/32426014_65681752_480.jpg?ov=true", "", "", "", "", "32426014", "", "Neutral", "Women > Bags > Designer Handbags", ""], ["farfetch.com", "2026-09-20", "USA", "USD", "DRAGON DIFFUSION", "Santa Croce tote bag", "18604018", "18604018", "Women", "Bags", "Tote & Shoulder Bags", "Female", "Multi/Neutral", "OS", "381", "381", "USD", "0", "true", "Calf Leather / Premium Suede", "Italy", "FW26", "Specialist Leather Clean", "DRAGON DIFFUSION - Santa Croce tote bag. Crafted with exceptional artisan materials.", "https://www.farfetch.com/vn/shopping/women/dragon-diffusion-santa-croce-tote-bag-item-18604018.aspx", "https://cdn-images.farfetch-contents.com/18/60/40/18/18604018_40243127_480.jpg?ov=true", "", "", "", "", "18604018", "", "Neutral", "Women > Bags > Designer Handbags", ""], ["farfetch.com", "2026-09-20", "USA", "USD", "Dolce & Gabbana", "medium Vittoria handbag with embroidery", "33409738", "33409738", "Women", "Bags", "Tote & Shoulder Bags", "Female", "Multi/Neutral", "OS", "8995", "8995", "USD", "0", "true", "Calf Leather / Premium Suede", "Italy", "FW26", "Specialist Leather Clean", "Dolce & Gabbana - medium Vittoria handbag with embroidery. Crafted with exceptional artisan materials.", "https://www.farfetch.com/vn/shopping/women/dolce-gabbana-medium-vittoria-handbag-with-embroidery-item-33409738.aspx", "https://cdn-images.farfetch-contents.com/33/40/97/38/33409738_65742839_480.jpg?ov=true", "", "", "", "", "33409738", "", "Neutral", "Women > Bags > Designer Handbags", ""], ["farfetch.com", "2026-09-20", "USA", "USD", "Balmain", "medium Anthem bag in calfskin leather", "33755598", "33755598", "Women", "Bags", "Tote & Shoulder Bags", "Female", "Multi/Neutral", "OS", "2020", "2020", "USD", "0", "true", "Calf Leather / Premium Suede", "Italy", "FW26", "Specialist Leather Clean", "Balmain - medium Anthem bag in calfskin leather. Crafted with exceptional artisan materials.", "https://www.farfetch.com/vn/shopping/women/balmain-medium-anthem-bag-in-calfskin-leather-item-33755598.aspx", "https://cdn-images.farfetch-contents.com/33/75/55/98/33755598_64681975_480.jpg?ov=true", "", "", "", "", "33755598", "", "Neutral", "Women > Bags > Designer Handbags", ""], ["farfetch.com", "2026-09-20", "USA", "USD", "The Attico", "La Passeggiata top-handle mini tote bag", "32705467", "32705467", "Women", "Bags", "Tote & Shoulder Bags", "Female", "Multi/Neutral", "OS", "1394", "1394", "USD", "0", "true", "Calf Leather / Premium Suede", "Italy", "FW26", "Specialist Leather Clean", "The Attico - La Passeggiata top-handle mini tote bag. Crafted with exceptional artisan materials.", "https://www.farfetch.com/vn/shopping/women/the-attico-la-passeggiata-top-handle-mini-tote-bag-item-32705467.aspx", "https://cdn-images.farfetch-contents.com/32/70/54/67/32705467_65842181_480.jpg?ov=true", "", "", "", "", "32705467", "", "Neutral", "Women > Bags > Designer Handbags", ""]]}, "rightmove": {"headers": ["﻿website_name", "competence_date", "country_code", "currency_code", "listing_id", "operation_type", "property_type", "title", "price", "price_original", "price_per_sqm", "area_sqm", "rooms", "bathrooms", "floor", "has_elevator", "has_parking", "has_terrace", "has_garden", "has_pool", "energy_certificate", "region", "city", "neighborhood", "address_raw", "latitude", "longitude", "agency_name", "contact_phone", "description", "itemurl", "imageurl"], "rows": [["rightmove.co.uk", "2026-09-20", "GBR", "GBP", "92992899", "sale", "Flat", "Flat in Catkin Road, London, NW9", "144000", "144000", "2057.14", "70.0", "1", "1", "", "", "", "", "", "", "", "Greater London", "London", "Catkin Road, London, NW9", "Catkin Road, London, NW9", "51.5074", "-0.1278", "Bairstow Eves, North Finchley", "", "30% share price. A fantastic one bedroom duplex maisonette with two terraces is now available. In the heart of North London, make way for a modern landmark development with a new urban community setting new standards for Shared Ownership. All crafted with quality ...", "https://www.rightmove.co.uk/properties/92992899", "https://media.rightmove.co.uk/assets/7bb483729b5a8e26f73e1831cde5b842/_next/static/media/floorplan-white.97dae32e.svg"], ["rightmove.co.uk", "2026-09-20", "GBR", "GBP", "92992899", "sale", "Flat", "Flat in Catkin Road, London, NW9", "144000", "144000", "2057.14", "70.0", "1", "1", "", "", "", "", "", "", "", "Greater London", "London", "Catkin Road, London, NW9", "Catkin Road, London, NW9", "51.5074", "-0.1278", "Bairstow Eves, North Finchley", "", "30% share price. A fantastic one bedroom duplex maisonette with two terraces is now available. In the heart of North London, make way for a modern landmark development with a new urban community setting new standards for Shared Ownership. All crafted with quality ...", "https://www.rightmove.co.uk/properties/92992899", "https://media.rightmove.co.uk/dir/crop/10:9-16:9/property-photo/b94ebe6d8/92992899/b94ebe6d86f957364dc8830bac57b647_max_476x317.jpeg"], ["rightmove.co.uk", "2026-09-20", "GBR", "GBP", "148711631", "sale", "Apartment", "Apartment in One Hyde Park, Knightsbridge, London, SW1X", "60000000", "60000000", "352941.18", "170.0", "5", "1", "", "", "", "", "", "", "", "Greater London", "London", "One Hyde Park, Knightsbridge, London, SW1X", "One Hyde Park, Knightsbridge, London, SW1X", "51.5074", "-0.1278", "Global 1, London", "", "A magnificent five-bedroom lateral apartment occupying the entire floor plate within One Hyde Park Knightsbridge, the most distinguished and exclusive developments in the world, designed for luxurious living on a grand scale.", "https://www.rightmove.co.uk/properties/148711631", "https://media.rightmove.co.uk/assets/7bb483729b5a8e26f73e1831cde5b842/_next/static/media/camera-white.579a6efc.svg"], ["rightmove.co.uk", "2026-09-20", "GBR", "GBP", "148711631", "sale", "Apartment", "Apartment in One Hyde Park, Knightsbridge, London, SW1X", "60000000", "60000000", "352941.18", "170.0", "5", "1", "", "", "", "", "", "", "", "Greater London", "London", "One Hyde Park, Knightsbridge, London, SW1X", "One Hyde Park, Knightsbridge, London, SW1X", "51.5074", "-0.1278", "Global 1, London", "", "A magnificent five-bedroom lateral apartment occupying the entire floor plate within One Hyde Park Knightsbridge, the most distinguished and exclusive developments in the world, designed for luxurious living on a grand scale.", "https://www.rightmove.co.uk/properties/148711631", "https://media.rightmove.co.uk/assets/7bb483729b5a8e26f73e1831cde5b842/_next/static/media/camera-white.579a6efc.svg"], ["rightmove.co.uk", "2026-09-20", "GBR", "GBP", "155320229", "sale", "Flat", "Flat in Avenue Road, St Johns Wood, London, NW8", "49950000", "49950000", "169322.03", "295.0", "10", "1", "", "", "", "", "", "", "", "Greater London", "London", "Avenue Road, St Johns Wood, London, NW8", "Avenue Road, St Johns Wood, London, NW8", "51.5074", "-0.1278", "United Kingdom Sotheby's International Realty, St Johns Wood", "", "Striking family home in the heart of St John's Wood", "https://www.rightmove.co.uk/properties/155320229", "https://media.rightmove.co.uk/assets/7bb483729b5a8e26f73e1831cde5b842/_next/static/media/floorplan-white.97dae32e.svg"], ["rightmove.co.uk", "2026-09-20", "GBR", "GBP", "155320229", "sale", "Flat", "Flat in Avenue Road, St Johns Wood, London, NW8", "49950000", "49950000", "169322.03", "295.0", "10", "1", "", "", "", "", "", "", "", "Greater London", "London", "Avenue Road, St Johns Wood, London, NW8", "Avenue Road, St Johns Wood, London, NW8", "51.5074", "-0.1278", "United Kingdom Sotheby's International Realty, St Johns Wood", "", "Striking family home in the heart of St John's Wood", "https://www.rightmove.co.uk/properties/155320229", "https://media.rightmove.co.uk/assets/7bb483729b5a8e26f73e1831cde5b842/_next/static/media/floorplan-white.97dae32e.svg"], ["rightmove.co.uk", "2026-09-20", "GBR", "GBP", "171185315", "sale", "Flat", "Flat in Balfour Place, Mayfair, London, W1K", "49500000", "49500000", "225000.0", "220.0", "7", "1", "", "", "", "", "", "", "", "Greater London", "London", "Balfour Place, Mayfair, London, W1K", "Balfour Place, Mayfair, London, W1K", "51.5074", "-0.1278", "OB Private, Mayfair", "", "A grand double fronted townhouse in the heart of the Mayfair Village, Balfour House is arguably the best house in Mayfair. With beautiful proportioned accommodation, triple aspect windows to the south, east and west, a lift to every floor and large roof terrace, the house retains the feel of a co...", "https://www.rightmove.co.uk/properties/171185315", "https://media.rightmove.co.uk/assets/7bb483729b5a8e26f73e1831cde5b842/_next/static/media/floorplan-white.97dae32e.svg"], ["rightmove.co.uk", "2026-09-20", "GBR", "GBP", "171185315", "sale", "Flat", "Flat in Balfour Place, Mayfair, London, W1K", "49500000", "49500000", "225000.0", "220.0", "7", "1", "", "", "", "", "", "", "", "Greater London", "London", "Balfour Place, Mayfair, London, W1K", "Balfour Place, Mayfair, London, W1K", "51.5074", "-0.1278", "OB Private, Mayfair", "", "A grand double fronted townhouse in the heart of the Mayfair Village, Balfour House is arguably the best house in Mayfair. With beautiful proportioned accommodation, triple aspect windows to the south, east and west, a lift to every floor and large roof terrace, the house retains the feel of a co...", "https://www.rightmove.co.uk/properties/171185315", "https://media.rightmove.co.uk/assets/7bb483729b5a8e26f73e1831cde5b842/_next/static/media/floorplan-white.97dae32e.svg"], ["rightmove.co.uk", "2026-09-20", "GBR", "GBP", "152205953", "sale", "Flat", "Flat in Whistler Square, Chelsea Barracks, London, SW1W, United Kingdom", "47000000", "47000000", "241025.64", "195.0", "6", "1", "", "", "", "", "", "", "", "Greater London", "London", "Whistler Square, Chelsea Barracks, London, SW1W, United Kingdom", "Whistler Square, Chelsea Barracks, London, SW1W, United Kingdom", "51.5074", "-0.1278", "United Kingdom Sotheby's International Realty, Knightsbridge", "", "Whistler Square, Chelsea Barracks, London, SW1W, United Kingdom", "https://www.rightmove.co.uk/properties/152205953", "https://media.rightmove.co.uk/assets/7bb483729b5a8e26f73e1831cde5b842/_next/static/media/floorplan-white.97dae32e.svg"], ["rightmove.co.uk", "2026-09-20", "GBR", "GBP", "152205953", "sale", "Flat", "Flat in Whistler Square, Chelsea Barracks, London, SW1W, United Kingdom", "47000000", "47000000", "241025.64", "195.0", "6", "1", "", "", "", "", "", "", "", "Greater London", "London", "Whistler Square, Chelsea Barracks, London, SW1W, United Kingdom", "Whistler Square, Chelsea Barracks, London, SW1W, United Kingdom", "51.5074", "-0.1278", "United Kingdom Sotheby's International Realty, Knightsbridge", "", "Whistler Square, Chelsea Barracks, London, SW1W, United Kingdom", "https://www.rightmove.co.uk/properties/152205953", "https://media.rightmove.co.uk/assets/7bb483729b5a8e26f73e1831cde5b842/_next/static/media/floorplan-white.97dae32e.svg"]]}};

const DATASET_SPECS = {
  idealista: {
    name: 'Idealista Portugal Real Estate Property Feed',
    badge: 'REAL-ESTATE-BASIC • 32 Fields',
    csvUrl: 'samples/idealista_real_estate_sample.csv',
    filename: 'idealista_portugal_sample_2026.csv',
    subject: '[Dataset License] Idealista Portugal Property Feed Inquiry',
    displayCols: ['listing_id', 'property_type', 'title', 'price', 'price_per_sqm', 'area_sqm', 'rooms', 'bathrooms', 'floor', 'region', 'city', 'neighborhood'],
    schema: [
      { field: 'listing_id', type: 'String / ID', fill: '100%', desc: 'Unique portal listing identifier' },
      { field: 'operation_type', type: 'Enum', fill: '100%', desc: 'sale | rent' },
      { field: 'property_type', type: 'Enum', fill: '100%', desc: 'apartment | house | penthouse | duplex' },
      { field: 'title', type: 'String', fill: '100%', desc: 'Listing title with property characteristics' },
      { field: 'price', type: 'Float (€)', fill: '100%', desc: 'Current asking price in EUR' },
      { field: 'price_original', type: 'Float (€)', fill: '100%', desc: 'Original asking price prior to cuts' },
      { field: 'price_per_sqm', type: 'Float (€/m²)', fill: '99.4%', desc: 'Normalized price per square meter' },
      { field: 'area_sqm', type: 'Float (m²)', fill: '99.8%', desc: 'Gross usable floor area' },
      { field: 'rooms', type: 'Integer', fill: '98.5%', desc: 'Bedrooms count (T0 to T10+)' },
      { field: 'bathrooms', type: 'Integer', fill: '98.1%', desc: 'Total bathrooms count' },
      { field: 'floor', type: 'String', fill: '92.4%', desc: 'Floor index (R/C, 1º, 2º...)' },
      { field: 'has_elevator', type: 'Boolean', fill: '100%', desc: 'Building elevator amenity' },
      { field: 'has_parking', type: 'Boolean', fill: '100%', desc: 'Dedicated garage / parking space' },
      { field: 'has_terrace', type: 'Boolean', fill: '100%', desc: 'Balcony or terrace amenity' },
      { field: 'has_garden', type: 'Boolean', fill: '100%', desc: 'Private or condominium garden' },
      { field: 'has_pool', type: 'Boolean', fill: '100%', desc: 'Swimming pool amenity' },
      { field: 'energy_certificate', type: 'Enum', fill: '94.2%', desc: 'Official Portuguese energy rating (A+ to F)' },
      { field: 'region', type: 'String', fill: '100%', desc: 'District (Lisboa, Porto, Faro...)' },
      { field: 'city', type: 'String', fill: '100%', desc: 'Concelho / Municipality' },
      { field: 'neighborhood', type: 'String', fill: '98.6%', desc: 'Freguesia / Parish' },
      { field: 'latitude / longitude', type: 'Geo Float', fill: '100%', desc: 'WGS84 GPS coordinate pair' }
    ]
  },
  continente: {
    name: 'Continente Supermarket FMCG Intelligence Catalog',
    badge: 'GROCERY-PLP • 31 Fields',
    csvUrl: 'samples/continente_grocery_plp_sample.csv',
    filename: 'continente_grocery_sample_2026.csv',
    subject: '[Dataset License] Continente Grocery FMCG Catalog Inquiry',
    displayCols: ['product_code', 'product_title', 'brand', 'category1', 'category2', 'category3', 'package_desc', 'full_price', 'price', 'ppu', 'unit_type', 'promotion_type'],
    schema: [
      { field: 'website_name', type: 'String', fill: '100%', desc: 'continente.pt' },
      { field: 'competence_date', type: 'ISO Date', fill: '100%', desc: 'Daily execution timestamp' },
      { field: 'product_code', type: 'String / ID', fill: '100%', desc: 'Internal SKU identifier' },
      { field: 'brand', type: 'String', fill: '97.2%', desc: 'Manufacturer brand or private label' },
      { field: 'product_title', type: 'String', fill: '100%', desc: 'Normalized product name' },
      { field: 'category1', type: 'String', fill: '100%', desc: 'Tier 1 Department (Frescos, Mercearia...)' },
      { field: 'category2', type: 'String', fill: '100%', desc: 'Tier 2 Category aisle' },
      { field: 'category3', type: 'String', fill: '96.5%', desc: 'Tier 3 Granular sub-category' },
      { field: 'package_desc', type: 'String', fill: '98.8%', desc: 'Net package volume / weight' },
      { field: 'full_price', type: 'Float (€)', fill: '100%', desc: 'Standard non-discounted catalog price' },
      { field: 'price', type: 'Float (€)', fill: '100%', desc: 'Effective transactional price' },
      { field: 'ppu', type: 'Float (€/unit)', fill: '99.5%', desc: 'Normalized unit price (€/kg, €/L)' },
      { field: 'unit_type', type: 'Enum', fill: '99.5%', desc: 'kg | L | un | dose' },
      { field: 'promotion_type', type: 'String', fill: '42.1%', desc: 'Promotion indicator (e.g. -10%, Leve 2 Pague 1)' },
      { field: 'itemurl', type: 'URL', fill: '100%', desc: 'Canonical e-commerce product URL' },
      { field: 'imageurl', type: 'URL', fill: '100%', desc: 'High-res CDN product image link' }
    ]
  },
  farfetch: {
    name: 'Farfetch Global Luxury Fashion & Designer Feed',
    badge: 'FASHION-PDP • 35 Fields',
    csvUrl: 'samples/farfetch_luxury_fashion_sample.csv',
    filename: 'farfetch_luxury_fashion_sample_2026.csv',
    subject: '[Dataset License] Farfetch Global Luxury Fashion Feed Inquiry',
    displayCols: ['brand', 'product_title', 'sku', 'category1', 'category2', 'color', 'size', 'full_price', 'price', 'discount_pct', 'in_stock', 'made_in', 'season'],
    schema: [
      { field: 'website_name', type: 'String', fill: '100%', desc: 'farfetch.com' },
      { field: 'brand', type: 'String', fill: '100%', desc: 'Luxury designer house (Jacquemus, Valentino...)' },
      { field: 'product_title', type: 'String', fill: '100%', desc: 'Official product model title' },
      { field: 'sku', type: 'String / ID', fill: '100%', desc: 'Farfetch internal catalog SKU' },
      { field: 'category1', type: 'String', fill: '100%', desc: 'Gender department (Women / Men / Kids)' },
      { field: 'category2', type: 'String', fill: '100%', desc: 'Core category (Bags, Shoes, Clothing)' },
      { field: 'category3', type: 'String', fill: '98.5%', desc: 'Style subcategory' },
      { field: 'color', type: 'String', fill: '99.2%', desc: 'Normalized designer color' },
      { field: 'size', type: 'String', fill: '98.0%', desc: 'Available size (IT/FR/US/OS)' },
      { field: 'full_price', type: 'Float', fill: '100%', desc: 'Original suggested retail price' },
      { field: 'price', type: 'Float', fill: '100%', desc: 'Current checkout price' },
      { field: 'currency', type: 'ISO-4217', fill: '100%', desc: 'Transactional currency (USD, EUR, GBP)' },
      { field: 'discount_pct', type: 'Integer (%)', fill: '100%', desc: 'Markdown percentage (0 to 70)' },
      { field: 'in_stock', type: 'Boolean', fill: '100%', desc: 'Real-time stock status' },
      { field: 'composition', type: 'String', fill: '94.0%', desc: 'Material & textile breakdown' },
      { field: 'made_in', type: 'Country', fill: '91.5%', desc: 'Country of origin (Italy, France...)' },
      { field: 'season', type: 'String', fill: '89.0%', desc: 'Collection season (FW26, SS26)' }
    ]
  },
  rightmove: {
    name: 'Rightmove London & Prime UK Property Feed',
    badge: 'REAL-ESTATE-BASIC • 32 Fields',
    csvUrl: 'samples/rightmove_uk_real_estate_sample.csv',
    filename: 'rightmove_london_sample_2026.csv',
    subject: '[Dataset License] Rightmove London Property Feed Inquiry',
    displayCols: ['listing_id', 'property_type', 'title', 'price', 'price_per_sqm', 'area_sqm', 'rooms', 'bathrooms', 'region', 'city', 'neighborhood'],
    schema: [
      { field: 'listing_id', type: 'String / ID', fill: '100%', desc: 'Rightmove listing identifier' },
      { field: 'operation_type', type: 'Enum', fill: '100%', desc: 'sale | rent' },
      { field: 'property_type', type: 'Enum', fill: '100%', desc: 'Flat | Apartment | House | Maisonette' },
      { field: 'title', type: 'String', fill: '100%', desc: 'Property title description' },
      { field: 'price', type: 'Float (£)', fill: '100%', desc: 'Asking price in GBP' },
      { field: 'price_per_sqm', type: 'Float (£/m²)', fill: '96.2%', desc: 'Normalized price per square meter' },
      { field: 'area_sqm', type: 'Float (m²)', fill: '96.2%', desc: 'Floor area in square meters' },
      { field: 'rooms', type: 'Integer', fill: '98.0%', desc: 'Bedrooms count' },
      { field: 'bathrooms', type: 'Integer', fill: '97.5%', desc: 'Bathrooms count' },
      { field: 'region', type: 'String', fill: '100%', desc: 'Greater London / UK County' },
      { field: 'city', type: 'String', fill: '100%', desc: 'London / Prime Central' },
      { field: 'latitude / longitude', type: 'Geo Float', fill: '100%', desc: 'WGS84 GPS coordinate pair' }
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
  if (licenseBtn) licenseBtn.setAttribute('href', 'mailto:hung@hlpdata.com?subject=' + encodeURIComponent(spec.subject));

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
      schemaHTML += `<tr><td><strong>${row.field}</strong></td><td><span class="badge-tag">${row.type}</span></td><td><span class="text-emerald font-mono">${row.fill}</span></td><td>${row.desc}</td></tr>`;
    });
    schemaHTML += '</tbody></table>';
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
});

