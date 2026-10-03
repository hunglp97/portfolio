# HLP Data — Commercial Web Data Feeds & Market Intelligence Infrastructure

> Production-grade, schema-standardized datasets for hedge funds, market research teams, and business intelligence systems. Delivered via automated Amazon S3 push and REST API.

[![Website](https://img.shields.io/badge/Production-hlpdata.com-00dc82?style=flat-square)](https://hlpdata.com)
[![License](https://img.shields.io/badge/License-Commercial%20B2B-blue?style=flat-square)](https://hlpdata.com/terms.html)
[![Compliance](https://img.shields.io/badge/Data%20Audit-100%25%20Verified-emerald?style=flat-square)](https://hlpdata.com/api.html)

---

## 🌐 Overview

**HLP Data** (`hlpdata.com`) engineers enterprise data pipelines extracting public commercial web intelligence across European real estate, FMCG retail grocery, and global luxury fashion.

All datasets are delivered with:
- **Strict Schema Enforcement**: 100% adherence to standard contracts (`REAL-ESTATE-BASIC`, `GROCERY-PLP`, `FASHION-PDP`).
- **Full Scope Auditing**: Every delivery undergoes 100% census validation — zero placeholder rows, zero interpolated metrics, zero mock values.
- **Enterprise Delivery**: Automated daily/weekly sync to client Amazon S3 buckets or programmatic REST API queries.

---

## 📊 Core Commercial Datasets

| Dataset | Scope | Attributes | Schema | Sample Download |
|:---|:---|:---:|:---:|:---:|
| **[Rightmove UK National Census](https://hlpdata.com/datasets/rightmove-uk.html)** | 544,502 residential sale listings (100% of 3,121 UK outcodes) | 32 cols | `REAL-ESTATE-BASIC` | [Sample CSV](https://hlpdata.com/samples/rightmove_uk_national_sample.csv) |
| **[Idealista Portugal Property Feed](https://hlpdata.com/datasets/idealista-portugal.html)** | 2,640 residential sale listings across 13 Portuguese districts | 32 cols | `REAL-ESTATE-BASIC` | [Sample CSV](https://hlpdata.com/samples/idealista_real_estate_sample.csv) |
| **[Continente Supermarket FMCG](https://hlpdata.com/datasets/continente-portugal.html)** | 11,711 verified grocery SKUs across 10 departmental aisles | 31 cols | `GROCERY-PLP` | [Sample CSV](https://hlpdata.com/samples/continente_grocery_plp_sample.csv) |
| **[Farfetch Luxury Handbag Catalog](https://hlpdata.com/datasets/farfetch-luxury.html)** | 960 designer handbag SKUs across 125 luxury brands | 35 cols | `FASHION-PDP` | [Sample CSV](https://hlpdata.com/samples/farfetch_luxury_fashion_sample.csv) |

---

## 🏛️ Site Architecture & Structure

The repository is built with a zero-dependency architecture ensuring maximum performance, instant page loads, and 100/100 Lighthouse metrics:

```
├── index.html                   # Main commercial portal & business use cases
├── custom-data.html             # Custom extraction inquiry & lead capture
├── api.html                     # Developer docs (REST API & Amazon S3 push)
├── terms.html                   # Commercial licensing & compliance terms
├── privacy.html                 # Privacy policy (public data only, zero PII)
├── datasets/
│   ├── index.html               # Catalog index of all production datasets
│   ├── rightmove-uk.html        # Rightmove UK census detail & SLA fill rates
│   ├── idealista-portugal.html  # Idealista Portugal property feed detail
│   ├── continente-portugal.html # Continente FMCG catalog detail
│   └── farfetch-luxury.html     # Farfetch luxury handbag catalog detail
├── samples/                     # Sanitized public sample CSV files
├── style.css                    # Responsive dark/light theme CSS3 system
├── script.js                    # Trilingual i18n runtime (EN/ES/PT) & modal inspector
├── sitemap.xml                  # Search engine index with full URL hierarchy
└── robots.txt                   # Search crawler directives
```

---

## 🚀 Local Development

To run the site locally for testing:

```bash
# Start a local HTTP server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

Verify script integrity:
```bash
node --check script.js
```

---

## 📬 Commercial Inquiries & Licensing

- **Sales & Feeds**: `sales@hlpdata.com`
- **Data Privacy & Compliance**: `privacy@hlpdata.com`
- **Portal**: [hlpdata.com](https://hlpdata.com)
