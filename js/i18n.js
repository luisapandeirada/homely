/**
 * Homely - Internationalization (i18n) Module
 * European Portuguese (pt-PT) and English (en-US) dictionaries.
 */

let currentLang = localStorage.getItem("homely_lang") || "en";

export const translations = {
  en: {
    // Navigation
    nav_home: "Home",
    nav_about: "About",
    nav_contact: "Contact",
    nav_dashboard: "Dashboard",
    nav_signin: "Sign In",
    nav_signup: "Get Started",
    nav_landlord: "Landlord",
    nav_tenant: "Tenant",
    nav_logout: "Log Out",
    nav_activity_logs: "Activity Logs",

    // Section 01: Hero
    hero_tag: "PROPERTY & TENANCY MANAGEMENT",
    hero_headline: "A calmer way to manage property.",
    hero_subline: "Homely transforms property management into a quiet, direct, and human experience for property owners and residents.",
    hero_cta_primary: "Explore Homely",
    hero_cta_secondary: "Sign In to Portal",

    // Section 02: Big Brand Statement
    statement_eyebrow: "OUR BELIEF",
    statement_headline: "Managing property shouldn't feel like managing paperwork.",
    statement_desc: "We built Homely because we believe property management works best when technology gets out of the way. Clear financial tracking, direct resident relationships, and thoughtful design.",

    // Section 03: Product Story
    story1_eyebrow: "01 / FINANCIAL CLARITY",
    story1_title: "Complete financial visibility, down to the cent.",
    story1_desc: "Track gross and net yields, automatically log monthly rent collection, split property maintenance expenses, and export transparent ledgers without spreadsheet chaos.",

    story2_eyebrow: "02 / DIRECT RESIDENT PAYMENTS",
    story2_title: "Frictionless digital settlements for residents.",
    story2_desc: "Residents enjoy single-click digital rent settlements, instant digital receipt generation, and clear notification of payment dates and lease schedules.",

    story3_eyebrow: "03 / MAINTENANCE COORDINATION",
    story3_title: "Resolve repairs before they become friction.",
    story3_desc: "Log requests directly with photos, compare contractor bids transparently, update residents in real time, and preserve a full history of property upkeep.",

    // Section 04: Product Visuals
    visuals_eyebrow: "THE INTERFACE",
    visuals_title: "Software designed to feel calm and purposeful.",
    visuals_desc: "Every ledger item, maintenance ticket, and floor plan view is crafted to reduce operational fatigue.",

    // Section 05: The Homely Approach
    approach_eyebrow: "THE HOMELY APPROACH",
    approach_title: "Designed on principles of restraint and trust.",
    approach1_title: "Restrained Simplicity",
    approach1_desc: "No clutter or endless submenus. Only the essential tools required to run your properties smoothly.",
    approach2_title: "Radical Transparency",
    approach2_desc: "Both landlords and tenants see clear records, status updates, and financial statements without ambiguity.",
    approach3_title: "Thoughtful Human Design",
    approach3_desc: "Technology that respects your time, providing peace of mind rather than constant notifications.",

    // Section 06: Trust / Social Proof
    proof_eyebrow: "PROOF & TRUST",
    proof_quote: '"Homely replaced our messy email chains and spreadsheets with a serene, organized system that both our team and tenants love."',
    proof_author: "Marcus Vance",
    proof_role: "Property Owner, Sterling Heritage Collection",
    stat1_val: "100%",
    stat1_lbl: "Financial Transparency",
    stat2_val: "< 24h",
    stat2_lbl: "Average Repair Response",
    stat3_val: "0",
    stat3_lbl: "Unnecessary Friction",

    // Section 07: Content / Journal
    journal_eyebrow: "JOURNAL & INSIGHTS",
    journal_title: "Perspectives on modern property ownership.",
    journal1_title: "The Architecture of Quiet Property Management",
    journal1_date: "October 2026 · 5 min read",
    journal2_title: "Building Better Relationships Between Landlords and Residents",
    journal2_date: "September 2026 · 4 min read",

    // Section 08: About / Human Element
    human_eyebrow: "BEHIND HOMELY",
    human_title: "Built for owners who care about quality.",
    human_desc: "We started Homely to restore clarity and elegance to property management. Homes are more than assets; they are where lives happen.",

    // Section 09: Final CTA
    cta_headline: "Ready for a calmer way to manage your property?",
    cta_desc: "Join owners and residents enjoying direct, transparent property coordination today.",
    cta_btn_primary: "Create Your Account",
    cta_btn_secondary: "Contact Our Team",

    // Dashboard Sidebars & Common
    sidebar_overview: "Overview",
    sidebar_properties: "Properties",
    sidebar_leases: "Leases & Tenants",
    sidebar_maintenance: "Maintenance Board",
    sidebar_financials: "Financial Ledger",
    sidebar_documents: "Documents",
    sidebar_messages: "Messages",
    sidebar_profile: "My Profile",

    // Metrics
    metric_gross_rent: "Gross Rent",
    metric_net_rent: "Net Rent",
    metric_occupancy: "Occupancy Rate",
    metric_active_maint: "Active Maintenance",

    // Actions & Buttons
    btn_add_property: "+ Add Property",
    btn_request_repair: "+ Request Repair",
    btn_pay_rent: "Pay Rent",
    btn_export_csv: "Export CSV",
    btn_invite_tenant: "Invite Tenant",

    // Property Card
    units_leased: "Leased Units",
    vacant: "Vacant",
    fully_leased: "Fully Leased",
    units_distribution: "Units Distribution"
  },
  pt: {
    // Navigation
    nav_home: "Início",
    nav_about: "Sobre",
    nav_contact: "Contacto",
    nav_dashboard: "Painel",
    nav_signin: "Iniciar Sessão",
    nav_signup: "Criar Conta",
    nav_landlord: "Senhorio",
    nav_tenant: "Inquilino",
    nav_logout: "Terminar Sessão",
    nav_activity_logs: "Registo de Atividades",

    // Section 01: Hero
    hero_tag: "GESTÃO DE IMÓVEIS E ARRENDAMENTO",
    hero_headline: "Uma forma mais serena de gerir imóveis.",
    hero_subline: "O Homely transforma a gestão imobiliária numa experiência calma, direta e humana para proprietários e residentes.",
    hero_cta_primary: "Explorar o Homely",
    hero_cta_secondary: "Aceder ao Portal",

    // Section 02: Big Brand Statement
    statement_eyebrow: "A NOSSA VISÃO",
    statement_headline: "Gerir imóveis não devia ser uma sobrecarga de burocracia.",
    statement_desc: "Criámos o Homely porque acreditamos que a gestão imobiliária funciona melhor quando a tecnologia é simples e intuitiva. Registos financeiros transparentes, relações diretas com residentes e um design cuidado.",

    // Section 03: Product Story
    story1_eyebrow: "01 / CLAREZA FINANCEIRA",
    story1_title: "Visibilidade financeira completa, ao cêntimo.",
    story1_desc: "Acompanhe rendimentos brutos e líquidos, registe o recebimento de rendas mensais, divida despesas de manutenção e exporte relatórios transparentes sem o caos das folhas de cálculo.",

    story2_eyebrow: "02 / PAGAMENTOS DIRETO DOS RESIDENTES",
    story2_title: "Pagamentos digitais sem complicações para residentes.",
    story2_desc: "Os residentes usufruem de pagamento digital com um só clique, emissão instantânea de recibos digitais e notificações claras sobre prazos e contratos.",

    story3_eyebrow: "03 / GESTÃO DE MANUTENÇÃO",
    story3_title: "Resolva reparações antes que se tornem um problema.",
    story3_desc: "Registe pedidos com fotografias, compare orçamentos de prestadores de serviços de forma transparente, atualize os residentes em tempo real e mantenha um histórico completo de conservação.",

    // Section 04: Product Visuals
    visuals_eyebrow: "A INTERFACE",
    visuals_title: "Software desenhado para ser sereno e funcional.",
    visuals_desc: "Cada detalhe, registo financeiro e planta imobiliária foi desenhado para eliminar a fadiga operacional.",

    // Section 05: The Homely Approach
    approach_eyebrow: "O MÉTODO HOMELY",
    approach_title: "Desenhado com base em princípios de serenidade e confiança.",
    approach1_title: "Simplicidade Rígida",
    approach1_desc: "Sem complicações ou menus infinitos. Apenas as ferramentas essenciais para gerir os seus imóveis com fluidez.",
    approach2_title: "Transparência Total",
    approach2_desc: "Tanto senhorios como inquilinos têm acesso a registos claros, atualizações e dados financeiros sem ambiguidades.",
    approach3_title: "Design Humano e Cuidado",
    approach3_desc: "Tecnologia que respeita o seu tempo, proporcionando tranquilidade em vez de notificações constantes.",

    // Section 06: Trust / Social Proof
    proof_eyebrow: "PROVA & CONFIANÇA",
    proof_quote: '"O Homely substituiu as nossas trocas de e-mails e folhas de cálculo por um sistema organizado e sereno que toda a gente adora."',
    proof_author: "Marcus Vance",
    proof_role: "Proprietário, Sterling Heritage Collection",
    stat1_val: "100%",
    stat1_lbl: "Transparência Financeira",
    stat2_val: "< 24h",
    stat2_lbl: "Tempo Médio de Resposta",
    stat3_val: "0",
    stat3_lbl: "Complicações Desnecessárias",

    // Section 07: Content / Journal
    journal_eyebrow: "REVISTA & ARTIGOS",
    journal_title: "Perspetivas sobre a gestão imobiliária moderna.",
    journal1_title: "A Arquitetura de uma Gestão Imobiliária Serenas",
    journal1_date: "Outubro 2026 · 5 min de leitura",
    journal2_title: "Criar Melhores Relações Entre Senhorios e Residentes",
    journal2_date: "Setembro 2026 · 4 min de leitura",

    // Section 08: About / Human Element
    human_eyebrow: "SOBRE O HOMELY",
    human_title: "Criado para proprietários que valorizam a qualidade.",
    human_desc: "Criámos o Homely para devolver a clareza e a elegância à gestão de imóveis. As habitações são mais do que ativos; são o espaço onde a vida acontece.",

    // Section 09: Final CTA
    cta_headline: "Pronto para uma gestão imobiliária mais serena?",
    cta_desc: "Junte-se aos proprietários e residentes que já usufruem de uma gestão direta e transparente.",
    cta_btn_primary: "Criar Conta",
    cta_btn_secondary: "Falar com a Equipa",

    // Dashboard Sidebars & Common
    sidebar_overview: "Visão Geral",
    sidebar_properties: "Imóveis",
    sidebar_leases: "Contratos e Inquilinos",
    sidebar_maintenance: "Gestão de Reparações",
    sidebar_financials: "Registo Financeiro",
    sidebar_documents: "Documentos",
    sidebar_messages: "Mensagens",
    sidebar_profile: "O Meu Perfil",

    // Metrics
    metric_gross_rent: "Renda Bruta",
    metric_net_rent: "Renda Líquida",
    metric_occupancy: "Taxa de Ocupação",
    metric_active_maint: "Reparações Ativas",

    // Actions & Buttons
    btn_add_property: "+ Adicionar Imóvel",
    btn_request_repair: "+ Pedir Reparação",
    btn_pay_rent: "Pagar Renda",
    btn_export_csv: "Exportar CSV",
    btn_invite_tenant: "Convidar Inquilino",

    // Property Card
    units_leased: "Frações Arrendadas",
    vacant: "Disponível",
    fully_leased: "Totalmente Arrendado",
    units_distribution: "Distribuição das Frações"
  }
};

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem("homely_lang", lang);
  }
}

export function t(key) {
  const dict = translations[currentLang] || translations.en;
  return dict[key] || translations.en[key] || key;
}
