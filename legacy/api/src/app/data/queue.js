const sql = require('mssql');

const getQueuePrice = async (connectionString, tokenAccount) => {
  let retorno = {list:[], total: 0};
  let pool; 
  
  try {

    let query = 
        `WITH TEMP AS 
        (
          SELECT
            A.CODIGO SKU,
            A.DESCRICAO, 
            A.CodigoEAN,
		      	A.ProdutoID,
          
            ISNULL(
            CASE A.KITVENDAS 
              WHEN 0 THEN (
              SELECT TOP 1 C.PRECO 
              FROM CANALVENDA B WITH (NOLOCK)
                INNER JOIN PACOTECOMERCIALITEM C WITH (NOLOCK) ON (B.PACOTECOMERCIALID = C.PACOTECOMERCIALID)
              WHERE B.TOKENACCOUNT = @tokenAccount
                AND B.GCRECORD IS NULL
                AND C.GCRECORD IS NULL
                AND C.SKUID = A.ID
              )
              WHEN 1 THEN (
                SELECT TOP 1 SUM(C.PRECO * I.QUANTIDADE) 
                FROM CANALVENDA B WITH (NOLOCK)
                  INNER JOIN PACOTECOMERCIALITEM C WITH (NOLOCK) ON (B.PACOTECOMERCIALID = C.PACOTECOMERCIALID)
                  INNER JOIN PRODUTOESTRUTURAITEM I WITH (NOLOCK) ON (I.SKUID = C.SKUID)
                  INNER JOIN PRODUTOESTRUTURA K WITH (NOLOCK) ON (I.PRODUTOESTRUTURAID = K.ID)  
                WHERE B.TOKENACCOUNT = @tokenAccount
                  AND B.GCRECORD IS NULL
                  AND C.GCRECORD IS NULL
                  AND K.GCRECORD IS NULL
                  AND K.SKUID = A.ID
                  AND I.GCRECORD IS NULL
                GROUP BY I.SKUIDPAI
              )
            END, 0) PRICE,
            Z.ID QUEUEID
          FROM (
            SELECT TOP 100 Y.* 
            FROM  INTERFACEPLATAFORMAFILA Y WITH (NOLOCK)
                INNER JOIN CanalVenda L WITH (NOLOCK) ON (L.ID = Y.CANALVENDAID)
              WHERE Y.TIPO = 2 
                AND Y.OPERACAO = 3 
                AND Y.TIPOINTERFACESTATUS = 0
                AND L.TOKENACCOUNT = @tokenAccount) Z 
            INNER JOIN SKU A ON (A.PRODUTOID = Z.CHAVEINTEGRACAO)		      
          WHERE Z.GCRECORD IS NULL    
        )
        SELECT A.QUEUEID queueId, A.SKU sku, A.DESCRICAO descricao, ROUND(A.PRICE,2) price, A.ProdutoID idProduto, A.CODIGOEAN ean, COUNT(1) OVER () AS total 
        FROM TEMP A
        ORDER BY A.QUEUEID`;

    pool = await new sql.connect(connectionString)
    let sqlReturn = await pool.request()
        .input('tokenAccount', sql.VarChar, tokenAccount)
        .query(query);

    let total = 0;
    let list = [];
    
    if (sqlReturn.recordset.length)
    {
      total = sqlReturn.recordset[0].total;
      sqlReturn.recordset.forEach(v => { 
        delete v.total;
      });   
      
      list = sqlReturn.recordset;
    }


    retorno = {list, total};  
  } finally {
    if (pool) await pool.close();
  }

  return retorno;
}

const getQueueStock = async (connectionString, tokenAccount) => {
  let retorno = [];
  let pool; 
  
  try {

    let query = 
      `WITH TEMP AS 
      (
        SELECT
          Z.CODIGO sku,
          Z.ProdutoID,
          ISNULL(
          CASE Z.KITVENDAS 
            WHEN 0 THEN (
            SELECT TOP 1 H.QTDEATUAL - H.QTDEALOCADA SALDO  
            FROM CANALVENDA F WITH (NOLOCK)
              INNER JOIN UNIDADENEGOCIOUNIDADENEGOCIOS_ESTOQUEDEPOSITOESTOQUEDEPOSITOS G WITH (NOLOCK) ON (G.UNIDADENEGOCIOS = F.UNIDADENEGOCIOID)
              INNER JOIN ESTOQUESALDO H WITH (NOLOCK) ON (H.ESTOQUEDEPOSITOID = G.ESTOQUEDEPOSITOS)
            WHERE F.TOKENACCOUNT = @tokenAccount
              AND F.GCRECORD IS NULL
              AND H.GCRECORD IS NULL
              AND H.SKUID = Z.ID)
            WHEN 1 THEN (
              SELECT TOP 1 MIN((ISNULL(H.QTDEATUAL,0) - ISNULL(H.QTDEALOCADA,0)) / J.QUANTIDADE) SALDO
              FROM PRODUTOESTRUTURAITEM J 
              INNER JOIN PRODUTOESTRUTURA K WITH (NOLOCK) ON (J.PRODUTOESTRUTURAID = K.ID) 
                LEFT JOIN (
                  SELECT * 
                  FROM ESTOQUESALDO WITH (NOLOCK)
                  WHERE EXISTS (
                    SELECT 1 
                    FROM UNIDADENEGOCIOUNIDADENEGOCIOS_ESTOQUEDEPOSITOESTOQUEDEPOSITOS G WITH (NOLOCK)
                      INNER JOIN CanalVenda F WITH (NOLOCK) ON (G.UNIDADENEGOCIOS = F.UNIDADENEGOCIOID)
                    WHERE F.TOKENACCOUNT = @tokenAccount 
                      AND F.GCRECORD IS NULL
                      AND ESTOQUEDEPOSITOID = G.ESTOQUEDEPOSITOS
                  )
                ) H ON (J.SkuID = H.SkuID)
              WHERE K.SKUID = Z.ID
                AND J.GCRecord IS NULL
                AND K.GCRecord IS NULL
              GROUP BY J.SKUIDPAI
            ) 
          END, 0) STOCK,
          ISNULL(
            CASE Z.KITVENDAS 
              WHEN 0 THEN (
              SELECT TOP 1 C.PRECO 
              FROM CANALVENDA B WITH (NOLOCK)
                INNER JOIN PACOTECOMERCIALITEM C WITH (NOLOCK) ON (B.PACOTECOMERCIALID = C.PACOTECOMERCIALID)
              WHERE B.TOKENACCOUNT = @tokenAccount
                AND B.GCRECORD IS NULL
                AND C.GCRECORD IS NULL
                AND C.SKUID = Z.ID
              )
              WHEN 1 THEN (
                SELECT TOP 1 SUM(C.PRECO * I.QUANTIDADE) 
                FROM CANALVENDA B WITH (NOLOCK)
                  INNER JOIN PACOTECOMERCIALITEM C WITH (NOLOCK) ON (B.PACOTECOMERCIALID = C.PACOTECOMERCIALID)
                  INNER JOIN PRODUTOESTRUTURAITEM I WITH (NOLOCK) ON (I.SKUID = C.SKUID)
                  INNER JOIN PRODUTOESTRUTURA K WITH (NOLOCK) ON (I.PRODUTOESTRUTURAID = K.ID)  
                WHERE B.TOKENACCOUNT = @tokenAccount
                  AND B.GCRECORD IS NULL
                  AND C.GCRECORD IS NULL
                  AND K.GCRECORD IS NULL
                  AND K.SKUID = Z.ID
                  AND I.GCRECORD IS NULL
                GROUP BY I.SKUIDPAI
              )
            END, 0) PRICE,
            K.ID QUEUEID
          FROM (
            SELECT TOP 100 Y.* 
            FROM  INTERFACEPLATAFORMAFILA Y WITH (NOLOCK)
                INNER JOIN CanalVenda L WITH (NOLOCK) ON (L.ID = Y.CANALVENDAID)
              WHERE Y.TIPO = 3 
                AND Y.OPERACAO = 4 
                AND Y.TIPOINTERFACESTATUS = 0
                AND L.TOKENACCOUNT = @tokenAccount) K 
            INNER JOIN SKU A ON (A.ID = K.CHAVEINTEGRACAO)
            INNER JOIN SKU Z ON (A.PRODUTOID = Z.PRODUTOID)			      
          WHERE Z.GCRECORD IS NULL                        
      )
      SELECT A.QUEUEID queueId, A.sku, round(A.STOCK, 0, 1) stock, round(A.PRICE, 2) price, COUNT(1) OVER () AS total 
      FROM TEMP A`;

    pool = await new sql.connect(connectionString)
    let sqlReturn = await pool.request()
        .input('tokenAccount', sql.VarChar, tokenAccount)
        .query(query);

    let total = 0;
    let list = [];
    
    if (sqlReturn.recordset.length)
    {
      total = sqlReturn.recordset[0].total;
      sqlReturn.recordset.forEach(v => { 
        delete v.total;
      });
    }

    retorno = {list: sqlReturn.recordset, total};  
  } finally {
    if (pool) await pool.close();
  }

  return retorno;
}

const deleteQueue = async (connectionString, queueList) => {
  let pool; 
  
  try {
    pool = await new sql.connect(connectionString)
    let queues = queueList.join();
    await pool.request().query(`delete from InterfacePlataformaFilaLog where InterfacePlataformaFilaID in (${queues})`);
    await pool.request().query(`delete from InterfacePlataformaFila where ID in (${queues})`);


  } finally {
    if (pool) await pool.close();
  }
}

const getQueueStatus = async (connectionString, tokenAccount) => {
  let retorno = [];
  let pool; 
  
  try {

    let query = 
      `SELECT 
          B.Numero OrderNumber ,
          C.Descricao CarrierName,
          D.Numero TrackingNumber,
          E.DataFechamento ShippedDate,
          B.DataEntrega DeveliveredDate,
          G.CodigoParceiro Status
       FROM 
          InterfacePlataformaFila A WITH (NOLOCK)
          INNER JOIN PedidoVenda B  WITH (NOLOCK) ON (A.ChaveIntegracao = B.ID)
          INNER JOIN TransporteConfiguracaoServico C WITH (NOLOCK) ON (B.TransporteConfiguracaoServicoID = C.ID)
          INNER JOIN Encomenda D  WITH (NOLOCK) ON(B.ID = D.PedidoVendaID)
          INNER JOIN EncomendaListaPostagem E WITH (NOLOCK) ON (D.EncomendaListaPostagemID = E.ID)
          INNER JOIN CanalVenda F WITH (NOLOCK) ON (A.CanalVendaID = F.ID)
          INNER JOIN CanalVendaPedidoVendaStatus G WITH (NOLOCK) ON (F.ID = G.CanalVendaID AND G.PedidoVendaStatusID = B.PedidoStatusID)
       WHERE A.Tipo = 5
         AND A.Operacao = 1
         AND A.TipoInterfaceStatus = 0
       AND F.TokenAccount = @tokenAccount`;

    pool = await new sql.connect(connectionString)
    let sqlReturn = await pool.request()
        .input('tokenAccount', sql.VarChar, tokenAccount)
        .query(query);

    let total = 0;
    let list = [];
    
    if (sqlReturn.recordset.length)
    {
      total = sqlReturn.recordset[0].total;
      sqlReturn.recordset.forEach(v => { 
        delete v.total;
      });
    }

    retorno = sqlReturn.recordset;  
  } finally {
    if (pool) await pool.close();
  }

  return retorno;
}

const postSync = async (connectionString, tokenAccount,sku) => {
 
  let pool;
  try {
  
    let query = 

      `INSERT Into InterfacePlataformaFila (Tipo,Operacao,CanalVendaID,TipoInterfaceStatus,ChaveIntegracao)
       SELECT 3,4,(select top 1 ID from CanalVenda cv where Descricao like '%Integração Hub%'),0,ID from SKU
       WHERE Codigo in (${sku.map(m=>`'${m}'`).join(',')})`;

       pool = await new sql.connect(connectionString)
       let sqlReturn = await pool.request()
           .input('tokenAccount', sql.VarChar, tokenAccount)
           .query(query);
    
       retorno = {success: sqlReturn.rowsAffected};  
     } finally {
       if (pool) await pool.close();
     }
   
     return retorno;
   }


module.exports = {getQueuePrice, getQueueStock, deleteQueue, getQueueStatus, postSync};