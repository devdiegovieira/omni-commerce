const sql = require('mssql');

const getPayment = async (connectionString, tokenAccount) => {
  let retorno = [];
  let pool;

  try {

    let query = `
        SELECT B.Descricao
          FROM CanalVendaPagamentoForma A
            INNER JOIN PagamentoForma B ON (A.PagamentoFormaID = B.ID)
            INNER JOIN CanalVenda C ON (A.CanalVendaID = C.ID)
              WHERE C.TokenAccount = @tokenAccount`;

    pool = await new sql.connect(connectionString)
    let sqlReturn = await pool.request()
      .input('tokenAccount', sql.VarChar, tokenAccount)
      .query(query);

    if (!sqlReturn.recordset.length)
      throw `Nenhuma forma de pagamento encontrada para o Token '${tokenAccount}'`

    retorno = sqlReturn.recordset;
  } finally {
    if (pool) await pool.close();
  }

  return retorno;
}

const getPaymentTime = async (connectionString, tokenAccount) => {
  let retorno = [];
  let pool;

  try {

    let query = `
      SELECT
        B.Descricao,
        A.QuantidadeParcelas,
        C.TokenAccount
      FROM CanalVendaPagamentoPrazo A
        INNER JOIN PagamentoPrazo B ON (A.PagamentoPrazoID = B.ID)
        INNER JOIN CanalVenda C ON (A.CanalVendaID = C.ID)
      WHERE C.TokenAccount = @tokenAccount
        AND A.GCRECORD IS NULL`;

    pool = await new sql.connect(connectionString)
    let sqlReturn = await pool.request()
      .input('tokenAccount', sql.VarChar, tokenAccount)
      .query(query);

    if (!sqlReturn.recordset.length)
      throw `Nenhum prazo de pagamento encontrado para o Token '${tokenAccount}'`

    retorno = sqlReturn.recordset;
  } finally {
    if (pool) await pool.close();
  }

  return retorno;
}

const getOrderSeller = async (connectionString, tokenAccount) => {
  let retorno = [];
  let pool;

  try {

    let query = `
    SELECT Codigo nome
    FROM UnidadeNegocio A
     WHERE A.GCRecord IS NULL   
       AND Sigla = 'PV'`;

    pool = await new sql.connect(connectionString)
    let sqlReturn = await pool.request()
      .input('tokenAccount', sql.VarChar, tokenAccount)
      .query(query);

    if (!sqlReturn.recordset.length)
      throw `Nenhuma empresa encontrada para o Token '${tokenAccount}'`

    retorno = sqlReturn.recordset;
  } finally {
    if (pool) await pool.close();
  }

  return retorno;
}

const getPartner = async (connectionString, tokenAccount, filtros) => {
  let retorno = [];
  let pool;

  let filtro = '';

  filtros = JSON.parse(JSON.stringify(filtros).toLowerCase());


  if (filtros.codigo) {
    filtro += ` AND LOWER(A.codigo) = '${filtros.codigo}'`;
  }
  if (filtros.nome) {
    filtro += ` AND LOWER(A.RazaoSocial) like '%${filtros.nome}%'`;
  }

  if (filtros.documento) {
    filtro += ` AND LOWER(A.CNPJ) = '${filtros.documento}'`;
  }

  if (filtros.email) {
    filtro += ` AND LOWER(A.Email) = '${filtros.email}'`;
  }

  if (filtros.classificacao) {
    filtro += ` AND LOWER(c.Descricao) = '${filtros.classificacao}'`;
  }

  if (filtros.codigovendedor) {
    filtro += ` AND LOWER(G.Codigo) = '${filtros.codigovendedor}'`;
  }

  if (filtros.codigorepresentante) {
    filtro += ` AND LOWER(F.Codigo) = '${filtros.codigorepresentante}'`;
  }

  try {

    let query = `

      SELECT
      A.Codigo codigo,
      A.RazaoSocial nome,
      J.Logradouro logradouro,
      J.Bairro bairro,
      K.Nome cidade,
      L.Sigla UF,
      J.CEP,
      A.CNPJ documento,
      A.Email email,
      C.Descricao classificacao,
      F.Codigo codigoRepresentante,
      F.RazaoSocial nomeRepresentante,
      F.CNPJ documentoRepresentante,
      G.Codigo codigoVendedor,
      G.RazaoSocial nomeVendedor,
      G.CNPJ documentoVendedor,
      J.Numero number,
      J.Complemento complemento

    FROM Parceiro A
    LEFT JOIN ComissaoParametro B WITH (NOLOCK) ON (A.ID = B.VendedorID)
    INNER JOIN ParceiroClass C  WITH (NOLOCK) ON (A.ParceiroClassID = C.ID)
    LEFT JOIN ParceiroVendedor D  WITH (NOLOCK) ON (A.ID = D.ParceiroID)
    LEFT JOIN ComissaoParametro E WITH (NOLOCK) ON (E.ID = D.RepresentanteID)
    LEFT JOIN Parceiro F  WITH (NOLOCK) ON (F.ID = E.VendedorID)
    LEFT JOIN ComissaoParametro H  WITH (NOLOCK) ON (H.ID = D.VendedorID)
    LEFT JOIN Parceiro G  WITH (NOLOCK) ON (G.ID = H.VendedorID)
    INNER JOIN Endereco J WITH (NOLOCK) ON (J.ParceiroID = A.ID AND J.Tipo = 0)
    INNER JOIN Cidade K WITH (NOLOCK) ON (J.CidadeID = K.ID)
    INNER JOIN Estado L WITH (NOLOCK) ON (K.EstadoID = L.ID)
     WHERE C.Descricao in ('CLIENTE','VENDEDOR','REPRESENTANTE')
       AND A.Codigo IS NOT NULL
      AND A.GCRecord IS NULL
    ${filtro}`;

    pool = await new sql.connect(connectionString)
    let sqlReturn = await pool.request()
      .input('tokenAccount', sql.VarChar, tokenAccount)
      .query(query);

    if (!sqlReturn.recordset.length)
      throw `Nenhum parceiro encontrado para o Token '${tokenAccount}'`

    retorno = sqlReturn.recordset;
  } finally {
    if (pool) await pool.close();
  }

  return retorno;
}

const getOrderStatus = async (connectionString, tokenAccount, filtros) => {
  let retorno = [];
  let pool;

  filtros = JSON.parse(JSON.stringify(filtros).toLowerCase());
  if (!filtros.pedido) throw `The param filter 'pedido' needed`

  try {

    let query =
      ` SELECT  
        A.Numero pedido,
        B.Descricao status,
        E.ValorUnit valorUnit,
        E.Quantidade quantidade,
        E.ValorUnitNegociado valorNegociado,
        F.Codigo codigo,
        ROUND(H.ValorTotal,2) valorTotalFaturado,
       ( 
         SELECT SUM(i.Quantidade)
          FROM SEPARACAOPEDIDOVOLUME i
          INNER JOIN PedidoVendaItem j on (i.PedidoVendaItemID = j.ID)
          WHERE j.id = e.ID
          AND i.Backorder = 1
          ) corte
        FROM PedidoVenda A
        INNER JOIN PedidoVendaStatus B WITH (NOLOCK)ON (A.PedidoStatusID = B.ID)
        INNER JOIN PedidoVendaCanalVenda C  WITH (NOLOCK) ON (A.ID = C.PedidoVendaID)
        INNER JOIN CanalVenda D WITH (NOLOCK) ON (C.CanalVendaID = D.ID)
        INNER JOIN PedidoVendaItem E WITH (NOLOCK) ON (A.ID = E.PedidoVendaID)
        INNER JOIN SKU F WITH (NOLOCK) ON (E.SkuID = F.ID)
        LEFT JOIN NotaFiscal H WITH (NOLOCK) ON (H.PedidoVendaID = A.ID)
      WHERE D.TokenAccount = @tokenAccount
       AND A.Numero = '${filtros.pedido}'`;

    pool = await new sql.connect(connectionString)
    let sqlReturn = await pool.request()
      .input('tokenAccount', sql.VarChar, tokenAccount)
      .query(query);

    if (!sqlReturn.recordset.length)
      throw `Nenhum parceiro encontrado para o Token '${tokenAccount}'`

    retorno = sqlReturn.recordset;

  } finally {
    if (pool) await pool.close();
  }

  return retorno;
}

const getOrderNumber = async (connectionString, filtros) => {
  let retorno = [];
  let pool;

  let filtro = '';

  filtros = JSON.parse(JSON.stringify(filtros).toLowerCase());


  if (filtros.ordernumber) {
    filtro += `WHERE Numero Like '${parseFloat(filtros.ordernumber.trim()).toFixed(0)}%'`;
  }

  try {

    let query = `
      SELECT Numero 
      FROM PedidoVenda
      ${filtro}
      ORDER BY Numero DESC`;

    pool = await new sql.connect(connectionString)
    let sqlReturn = await pool.request()
      .query(query);

    retorno = sqlReturn.recordset;

  } finally {
    if (pool) await pool.close();
  }

  return retorno;
}



module.exports = { getPayment, getPaymentTime, getOrderSeller, getPartner, getOrderStatus, getOrderNumber };