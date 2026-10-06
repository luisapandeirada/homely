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

    // Section 01: Hero (The Opening)
    hero_tag: "HOMELY · PHILOSOPHY & SYSTEM",
    hero_headline: "A calmer way to manage property.",
    hero_subline: "Less administration. More living. Homely turns property management into one serene, direct visual experience.",
    hero_cta_primary: "Discover Homely &rarr;",
    hero_cta_secondary: "Portal Access",

    // Section 02: Big Brand Statement
    statement_eyebrow: "THE BIG IDEA",
    statement_headline: "Managing property shouldn't feel like managing paperwork.",
    statement_desc: "We built Homely because we believe property management works best when technology gets out of the way. Clear financial tracking, direct resident relationships, and thoughtful design.",

    // Section 03: The Human Problem
    problem_eyebrow: "01 / THE HUMAN PROBLEM",
    problem_headline: "Endless spreadsheets, fragmented emails, and lost maintenance updates.",
    problem_desc: "For too long, property owners and residents have suffered through fragmented communication channels, opaque rent records, and administrative noise.",

    // Section 04: The Homely Approach
    approach_eyebrow: "02 / THE HOMELY APPROACH",
    approach_headline: "Rhythm, clarity, and peace of mind.",
    approach_less_admin_title: "Less administration.",
    approach_less_admin_desc: "Automated rent tracking, unified maintenance tickets, and single-click digital receipting eliminate repetitive paperwork.",
    approach_more_clarity_title: "More clarity.",
    approach_more_clarity_desc: "Both landlords and residents share a transparent view of payments, lease terms, and repair histories.",

    // Section 05 & 06: Product & Product Experiences
    product_eyebrow: "03 / THE PRODUCT",
    product_headline: "Software designed to feel calm and purposeful.",
    story1_eyebrow: "FINANCIAL LEDGER",
    story1_title: "Complete financial visibility, down to the cent.",
    story1_desc: "Track gross and net yields, automatically log monthly rent collection, split property maintenance expenses, and export transparent ledgers without spreadsheet chaos.",

    story2_eyebrow: "RESIDENT PAYMENTS",
    story2_title: "Frictionless digital settlements for residents.",
    story2_desc: "Residents enjoy single-click digital rent settlements, instant digital receipt generation, and clear notification of payment dates.",

    story3_eyebrow: "MAINTENANCE BOARD",
    story3_title: "Resolve repairs before they become friction.",
    story3_desc: "Log requests directly with photos, compare contractor bids transparently, update residents in real time, and preserve a full history of property upkeep.",

    // Section 07: The Human Benefit
    benefit_eyebrow: "04 / THE HUMAN BENEFIT",
    benefit_headline: "Confidence, time, and quiet control.",
    benefit_desc: "When software respects your attention, managing properties shifts from an ongoing hassle into an effortless background rhythm.",

    // Section 08: Trust & Social Proof
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

    // Section 09: The People Behind Homely
    human_eyebrow: "BEHIND HOMELY",
    human_title: "Built for owners who care about quality.",
    human_desc: "We started Homely to restore clarity and elegance to property management. Homes are more than assets; they are where lives happen.",

    // Section 10: Final Statement
    cta_headline: "Ready for a calmer way to manage your property?",
    cta_desc: "Join owners and residents enjoying direct, transparent property coordination today.",
    cta_btn_primary: "Create Account",
    cta_btn_secondary: "Get in Touch",

    // Contact View Editorial
    contact_headline: "Let's make property feel simpler.",
    contact_subline: "Have questions about Homely or setting up your portfolio? Reach out directly below.",

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
    btn_invite_tenant: "Invite Tenant"
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

    // Section 01: Hero (The Opening)
    hero_tag: "HOMELY · FILOSOFIA & SISTEMA",
    hero_headline: "Uma forma mais serena de gerir imóveis.",
    hero_subline: "Menos burocracia. Mais vida. O Homely transforma a gestão imobiliária numa experiência visual serena e direta.",
    hero_cta_primary: "Descobrir o Homely &rarr;",
    hero_cta_secondary: "Acesso ao Portal",

    // Section 02: Big Brand Statement
    statement_eyebrow: "A NOSSA VISÃO",
    statement_headline: "Gerir imóveis não devia ser uma sobrecarga de burocracia.",
    statement_desc: "Criámos o Homely porque acreditamos que a gestão imobiliária funciona melhor quando a tecnologia é simples e intuitiva. Registos financeiros transparentes, relações diretas com residentes e um design cuidado.",

    // Section 03: The Human Problem
    problem_eyebrow: "01 / O PROBLEMA HUMANO",
    problem_headline: "Folhas de cálculo infinitas, e-mails perdidos e falta de informação.",
    problem_desc: "Durante anos, proprietários e residentes sofreram com canais de comunicação dispersos, recibos confusos e ruído administrativo.",

    // Section 04: The Homely Approach
    approach_eyebrow: "02 / O MÉTODO HOMELY",
    approach_headline: "Ritmo, clareza e tranquilidade.",
    approach_less_admin_title: "Menos administração.",
    approach_less_admin_desc: "Acompanhamento automático de rendas, gestão centralizada de reparações e emissão instantânea de recibos eliminam a burocracia repetitiva.",
    approach_more_clarity_title: "Mais clareza.",
    approach_more_clarity_desc: "Senhorios e residentes partilham uma visão transparente de pagamentos, prazos de contratos e histórico de conservação.",

    // Section 05 & 06: Product & Product Experiences
    product_eyebrow: "03 / A INTERFACE",
    product_headline: "Software desenhado para ser sereno e funcional.",
    story1_eyebrow: "REGISTO FINANCEIRO",
    story1_title: "Visibilidade financeira completa, ao cêntimo.",
    story1_desc: "Acompanhe rendimentos brutos e líquidos, registe o recebimento de rendas mensais, divida despesas de manutenção e exporte relatórios transparentes sem o caos das folhas de cálculo.",

    story2_eyebrow: "PAGAMENTOS DIRETO",
    story2_title: "Pagamentos digitais sem complicações para residentes.",
    story2_desc: "Os residentes usufruem de pagamento digital com um só clique, emissão instantânea de recibos digitais e notificações claras sobre prazos.",

    story3_eyebrow: "GESTÃO DE REPARAÇÕES",
    story3_title: "Resolva reparações antes que se tornem um problema.",
    story3_desc: "Registe pedidos com fotografias, compare orçamentos de prestadores de serviços de forma transparente, atualize os residentes em tempo real e mantenha um histórico completo.",

    // Section 07: The Human Benefit
    benefit_eyebrow: "04 / O BENEFÍCIO HUMANO",
    benefit_headline: "Confiança, tempo e controlo sereno.",
    benefit_desc: "Quando o software respeita o seu tempo, a gestão de imóveis deixa de ser uma complicação diária e passa a ser um ritmo fluido e sem esforço.",

    // Section 08: Trust & Social Proof
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

    // Section 09: The People Behind Homely
    human_eyebrow: "SOBRE O HOMELY",
    human_title: "Criado para proprietários que valorizam a qualidade.",
    human_desc: "Criámos o Homely para devolver a clareza e a elegância à gestão de imóveis. As habitações são mais do que ativos; são o espaço onde a vida acontece.",

    // Section 10: Final Statement
    cta_headline: "Pronto para uma gestão imobiliária mais serena?",
    cta_desc: "Junte-se aos proprietários e residentes que já usufruem de uma gestão direta e transparente.",
    cta_btn_primary: "Criar Conta",
    cta_btn_secondary: "Falar com a Equipa",

    // Contact View Editorial
    contact_headline: "Vamos simplificar a gestão do seu imóvel.",
    contact_subline: "Tem questões sobre o Homely ou pretende configurar o seu portfólio? Contacte-nos diretamente abaixo.",

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
    btn_invite_tenant: "Convidar Inquilino"
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
