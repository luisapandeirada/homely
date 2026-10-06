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

    // Landing Page
    hero_tag: "Property & Tenancy Management",
    hero_title: "Direct, simple management for your properties.",
    hero_desc: "A calm, quiet platform for property owners and residents. Clear financial tracking, direct rent payments, and simple maintenance coordination.",
    hero_cta_owner: "Landlord Portal",
    hero_cta_tenant: "Tenant Sign In",
    
    properties_tag: "PROPERTIES",
    properties_title: "Featured Residences",
    properties_sub: "Direct occupancy and lease status",
    
    capabilities_tag: "CAPABILITIES",
    capabilities_title: "Designed for Simplicity",
    cap1_title: "Clear Records",
    cap1_desc: "Track monthly rent collections, split expenses, and review straightforward financial summaries without clutter.",
    cap2_title: "Direct Payments",
    cap2_desc: "Digital rent settlement for residents with transparent payment receipts and clear due dates.",
    cap3_title: "Maintenance Coordination",
    cap3_desc: "Log maintenance requests directly, compare contractor options, and keep residents informed at every step.",

    quote_text: '"Property management made direct, quiet, and transparent for both owners and tenants."',

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

    // Landing Page
    hero_tag: "Gestão de Imóveis e Arrendamento",
    hero_title: "Gestão direta e simples para os seus imóveis.",
    hero_desc: "Uma plataforma calma e intuitiva para proprietários e inquilinos. Acompanhamento financeiro transparente, pagamento direto de rendas e gestão simples de reparações.",
    hero_cta_owner: "Portal do Senhorio",
    hero_cta_tenant: "Entrada de Inquilino",
    
    properties_tag: "IMÓVEIS",
    properties_title: "Imóveis em Destaque",
    properties_sub: "Estado de ocupação e contratos de arrendamento",
    
    capabilities_tag: "FUNCIONALIDADES",
    capabilities_title: "Desenhado para a Simplicidade",
    cap1_title: "Registos Claros",
    cap1_desc: "Acompanhe o recebimento de rendas mensais, divida despesas e consulte resumos financeiros simples sem complicações.",
    cap2_title: "Pagamentos Diretos",
    cap2_desc: "Pagamento digital de rendas para residentes com recibos transparentes e datas de vencimento claras.",
    cap3_title: "Gestão de Manutenção",
    cap3_desc: "Registe pedidos de reparação diretamente, compare orçamentos de prestadores de serviços e mantenha os residentes informados.",

    quote_text: '"Gestão imobiliária direta, serena e transparente para senhorios e inquilinos."',

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
