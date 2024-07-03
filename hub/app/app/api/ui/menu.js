export default [
  {
    key : "logout",
    name : "Sair",
    icon : "logout",
    showIcon : true,
    link : "/logout",
    sequence : 8
  },
  {
    key : "money",
    name : "Financeiro",
    icon : "paid",
    showIcon : true,
    link : "/money",
    sequence : 5
  },
  {
    key : "hub",
    name : "Integrações",
    icon : "device_hub",
    child : [
      {
        key : "marketPlace",
        name : "Contas",
        icon : "storefront",
        isChield : true,
        link : "/marketplace"
      },
      {
        key : "publish",
        name : "Anúncios",
        icon : "video_label",
        isChield : true,
        link : "/publish"
      },
      {
        key : "link",
        name : "Vínculos",
        icon : "link",
        isChield : true,
        link : "/link"
      },
      {
        key : "priceRule",
        name : "Regras de Preço",
        icon : "price_change",
        isChield : true,
        link : "/pricerule"
      },
      {
        key : "queue",
        name : "Fila de Integração",
        icon : "queue_play_next",
        isChield : true,
        link : "/queue"
      }
    ],
    sequence : 3
  },
  {
    key : "dashboard",
    name : "Resumo",
    icon : "dashboard",
    showIcon : true,
    link : "/",
    sequence : 1
  },
  {
    key : "forms",
    name : "Cadastros",
    icon : "grading",
    child : [
      {
        key : "seller",
        name : "Empresas",
        icon : "add_business",
        isChield : true,
        link : "/seller"
      },
      {
        key : "product",
        name : "Produtos",
        icon : "sell",
        isChield : true,
        link : "/product"
      }
    ],
    sequence : 2
  },
  {
    key : "report",
    name : "Relatórios",
    multilevel : true,
    icon : "analytics",
    showIcon : true,
    link : "/report",
    sequence : 6
  },
  {
    key : "sale",
    name : "Vendas",
    icon : "shopping_bag",
    showIcon : true,
    link : "/sale",
    sequence : 4
  },
  {
    key : "settings",
    name : "Configurações",
    icon : "settings",
    showIcon : true,
    link : "/settings",
    sequence : 7
  }
]