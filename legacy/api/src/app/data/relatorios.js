const sql = require('mssql');

//Quantidade de Pedidos Diarios OK
const getDayOrderAmount = async (connectionString, tokenAccount) => {
  let retorno = [];
  let pool;

  try {

    let query = `
      SELECT 
        (select Nome from UnidadeNegocio where ID = B.UnidadeNegocioID) business, 
        COUNT(1) QtdPedidos
      FROM SeparacaoPedido A
        INNER JOIN PedidoVenda B ON (A.PedidoVendaID = B.ID)
      WHERE A.DataCadastro >= CONVERT(CHAR(08), GETDATE(), 112)+' 00:00:00' 
      AND B.ParceiroID NOT IN (169738,169712,187393)
      AND B.TipoComercID IN (22,77)
      GROUP BY B.UnidadeNegocioID`;

    pool = await new sql.connect(connectionString)
    let sqlReturn = await pool.request()
      .input('tokenAccount', sql.VarChar, tokenAccount)
      .query(query);


    if (!sqlReturn.recordset.length)
      sqlReturn.recordset.length ?
        sqlReturn.recordset :
        [
          {
            business: "APPLYCAR",
            dailyBilling: 0
          },
          {
            business: "ZEENE",
            dailyBilling: 0
          }
        ];

    retorno = sqlReturn.recordset;
  } finally {
    if (pool) await pool.close();
  }

  return retorno;
}

//Faturamento atual do dia Zeene e Applycar
const getDayBillingAmount = async (connectionString, tokenaccount, filtros) => {
  let retorno = [];
  let pool;

  let filtro = ''

  filtros = JSON.parse(JSON.stringify(filtros).toLowerCase());


  if (filtros.business) {
    filtro += `WHERE DATA.business = '${filtros.business}'`;
  }

  try {

    let query = `
      SELECT * FROM (
        SELECT 
          ROUND(SUM((A.ValorMerc)), 2) dailyBilling, 
          (select Nome from UnidadeNegocio where A.UnidadeNegocioID = ID) business
        FROM NotaFiscal A
        WHERE A.DataEmissao >= CONVERT (CHAR(08),GETDATE(), 112)+' 00:00:00'
        AND A.ParceiroID NOT IN (169738,169712,187393)
          AND A.NotaFiscalStatusID = 50
          AND A.TipoComercID in (22,77)
        GROUP BY A.UnidadeNegocioID 
      ) DATA
      ${filtro}`;

    pool = await new sql.connect(connectionString)
    let sqlReturn = await pool.request()
      .input('tokenaccount', sql.VarChar, tokenaccount)
      .query(query);


    retorno =
      sqlReturn.recordset.length ?
        sqlReturn.recordset :
        [
          {
            "business": "ZEENE",
            "dailyBilling": 0
          },
          {
            "business": "APPLYCAR",
            "dailyBilling": 0
          },
          {
            "business": "VALE CONSUMIDOR",
            "dailyBilling": 0
          }
        ];

  } finally {
    if (pool) await pool.close();
  }

  return retorno;
}

//Faturamento Acumulativo mês Applycar e Zeene

const getCumulativeMonthBilling = async (connectionString, tokenAccount) => {
  let retorno = [];
  let pool;

  try {

    let query = `
      SELECT
        A.NOME business,
        ISNULL(
        (SELECT ROUND(SUM(B.VALORMERC),2) 
        FROM NOTAFISCAL B 
          INNER JOIN TIPOCOMERC C WITH (NOLOCK) ON (B.TIPOCOMERCID = C.ID)
          WHERE B.UNIDADENEGOCIOID = A.ID
            AND CONVERT(CHAR(06), DATAEMISSAO, 112) =  CONVERT(CHAR(06), GETDATE(), 112)
            AND B.NOTAFISCALSTATUSID = 50
            AND C.ID IN (22,77)
            AND B.Serie IN (1,2,100)
            AND B.ParceiroID NOT IN (169738,169712,187393)
          GROUP BY B.UNIDADENEGOCIOID)
        , 0) CumulativeBilling
          FROM UNIDADENEGOCIO A
          WHERE A.GCRECORD IS NULL
            AND A.EMPRESAID IS NOT NULL `;

    pool = await new sql.connect(connectionString)
    let sqlReturn = await pool.request()
      .input('tokenAccount', sql.VarChar, tokenAccount)
      .query(query);

    sqlReturn.recordset.length

    retorno = sqlReturn.recordset;
  } finally {
    if (pool) await pool.close();
  }

  return retorno;
}
//Total acumulado de corte mês.

const getCutOfMonth = async (connectionString, tokenAccount) => {
  let retorno = [];
  let pool;

  try {

    let query = `
      SELECT ROUND(SUM(ValorCortado),2) ValorCortado FROM (
        SELECT SUM(ISNULL(B.VALORUNIT,0) * ISNULL(A.QUANTIDADE,0)) ValorCortado
              FROM SEPARACAOPEDIDOVOLUME A
              INNER JOIN PEDIDOVENDAITEM B ON (B.ID = A.PEDIDOVENDAITEMID)
              INNER JOIN SEPARACAOPEDIDO C ON (C.ID = A.SEPARACAOPEDIDOID)
        INNER JOIN PEDIDOVENDA D ON (B.PedidoVendaID = D.ID)
              WHERE A.BACKORDER = 1 
        AND
        D.ParceiroID NOT IN (169738,169712,187393)
        AND D.TipoComercID IN (22,77)
            
          AND CONVERT(CHAR(06), C.DATACADASTRO, 112) = CONVERT(CHAR(06), GETDATE(), 112)
        UNION ALL
        SELECT 0 ValorCortado) A
      `;

    pool = await new sql.connect(connectionString)
    let sqlReturn = await pool.request()
      .input('tokenAccount', sql.VarChar, tokenAccount)
      .query(query);

    sqlReturn.recordset.length ?
      sqlReturn.recordset :
      [
        {
          "ValorCortado": 0

        }
      ];

    retorno = sqlReturn.recordset;
  } finally {
    if (pool) await pool.close();
  }

  return retorno;
}

// Quantidade de pedidos postados do dia.
const getPostedOrders = async (connectionString, tokenAccount) => {
  let retorno = [];
  let pool;

  try {

    let query =
      `SELECT COUNT(1) Enviado
      FROM PedidoVenda C
      WHERE EXISTS (
        SELECT 1
        FROM Encomenda A
        INNER JOIN EncomendaListaPostagem B ON (A.EncomendaListaPostagemID = B.ID)
        WHERE B.DataFechamento >= CONVERT(CHAR(08), GETDATE(), 112)+' 00:00:00'
          AND C.ParceiroID NOT IN (169738,169712,187393)
          AND C.ID = A.PedidoVendaID)`;

    pool = await new sql.connect(connectionString)
    let sqlReturn = await pool.request()
      .input('tokenAccount', sql.VarChar, tokenAccount)
      .query(query);

    if (!sqlReturn.recordset.length)
      throw `Nenhum pedido Encontrado '${tokenAccount}'`

    retorno = sqlReturn.recordset;
  } finally {
    if (pool) await pool.close();
  }

  return retorno;
}

const getSaleSlip = async (connectionString, tokenAccount, order) => {
  let retorno = [];
  let pool;

  try {

    let query =
      `SELECT
      b.Numero numero,
      b.DataCadastro dataTalao,
      f.RazaoSocial nomeComprador,
      f.CNPJ documento,	
      k.Sigla uf,	
      o.RazaoSocial transportadora,
      l.Descricao formaPagamento,
      m.Descricao prazo,
      vendedor.Fantasia vendedor,
      un.Nome unidadeNegocio,
      representante.Fantasia  representante,
      e.Codigo sku,
      e.Descricao skuDescricao,
      isnull((SELECT top 1 PrecoAtacado from PacoteComercialItem z where z.SkuID = a.SkuID and z.GCRecord is null and PacoteComercialID = 16 ),0) custo,
      isnull(a.ValorUnit, 0) valorUnitario,
      isnull(a.Quantidade, 0) quantidade,
      isnull(a.ValorBruto, 0) valorBruto,
      CASE WHEN isnull(a.ValorUnitNegociado, 0) = 0 THEN isnull(a.ValorUnit, 0) ELSE isnull(a.ValorUnitNegociado, 0) END valorUnitarioNegociado,
      CASE 
        WHEN m.Avista = 1
        THEN ROUND(isnull((SELECT Preco from PacoteComercialItem c where c.SkuID = a.SkuID and c.GCRecord is null and PacoteComercialID = 20 ),0) * 0.97, 2)
        ELSE isnull((SELECT Preco from PacoteComercialItem c where c.SkuID = a.SkuID and c.GCRecord is null and PacoteComercialID = 20 ),0) 
      END precoC,
      (SELECT top 1 pvm.Texto from PedidoVendaMensagem pvm where pvm.PedidoVendaID = b.ID) mensagem,
      CASE 
        WHEN m.Avista = 1
        THEN ROUND(isnull((SELECT Preco from PacoteComercialItem d where d.SkuID = a.SkuID and d.GCRecord is null and PacoteComercialID = 21 ),0) * 0.97, 2)
        ELSE isnull((SELECT Preco from PacoteComercialItem d where d.SkuID = a.SkuID and d.GCRecord is null and PacoteComercialID = 21 ),0) 
      END precoR,
  (SELECT Preco from PacoteComercialItem xv where xv.SkuID = a.SkuID and xv.GCRecord is null and PacoteComercialID = 18 ) promo
    from pedidovendaitem a
      inner join PedidoVenda b on (b.ID = a.PedidoVendaID)    
      inner join sku e on (e.ID = a.SkuID)
      inner join Parceiro f on (f.ID = b.ParceiroID ) 
      inner join Endereco i on (i.ParceiroID  = f.ID AND i.Tipo = 0)
      inner join Cidade j on (j.ID  = i.CidadeID AND i.Tipo = 0)
      inner join Estado k on (k.ID  = j.EstadoID)
      inner join PagamentoForma l on (l.ID = b.PagamentoFormaID)
      inner join PagamentoPrazo m on (m.ID = b.PagamentoPrazoID)
      inner join TransporteConfiguracaoServico n on (n.ID = b.TransporteConfiguracaoServicoID)
      inner join TransporteConfiguracao p on (p.id = n.TransporteConfiguracaoID)
      inner join Parceiro o on (o.ID  = p.TransportadoraID)
      left join Parceiro vendedor on (b.VendedorID = vendedor.ID)
      left join Parceiro representante on (b.RepresentanteID = representante.ID)
      inner join UnidadeNegocio un on (un.ID = b.UnidadeNegocioID)
    WHERE b.Numero = '${order.order}'
      AND B.GCRecord IS NULL
      AND i.GCRecord IS NULL
      AND f.GCRecord IS NULL
      AND i.GCRecord IS NULL
      AND p.GCRecord IS NULL
      AND k.GCRecord IS NULL
      AND m.GCRecord IS NULL
      AND f.GCRecord IS NULL
      AND n.GCRecord IS NULL
      AND a.GCRecord IS NULL
      AND e.GCRecord IS NULL
      AND o.GCRecord IS NULL
      AND J.GCRecord IS NULL
      AND l.GCRecord IS NULL
    ORDER BY e.Codigo`;

    pool = await new sql.connect(connectionString)
    let sqlReturn = await pool.request()
      .input('tokenAccount', sql.VarChar, tokenAccount)
      .query(query);

    if (!sqlReturn.recordset.length)
      throw `Nenhum pedido Encontrado '${tokenAccount}'`

    retorno = sqlReturn.recordset;
  } finally {
    if (pool) await pool.close();
  }

  return retorno;
}




module.exports = { getDayOrderAmount, getDayBillingAmount, getCumulativeMonthBilling, getCutOfMonth, getPostedOrders, getSaleSlip };