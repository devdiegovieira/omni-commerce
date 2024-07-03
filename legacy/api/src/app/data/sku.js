const sql = require('mssql');

const getSku = async (connectionString, tokenAccount, ignoreDePara = false, sku = null, offset = null, limit = null) => {
  let retorno = {list:[], total: 0};
  let pool; 
  
  try {
    let prodPorCanal = '';
    if (!ignoreDePara) 
      prodPorCanal = `  INNER JOIN PRODUTOPRODUTOS_CANALVENDACANALVENDAS K WITH (NOLOCK) ON (K.PRODUTOS = A.PRODUTOID)
                        INNER JOIN CANALVENDA L WITH (NOLOCK) ON (L.ID = K.CANALVENDAS)
                      WHERE L.TOKENACCOUNT = @tokenAccount`;

    let filtroOffset = '';
    if (offset != null && limit != null)
      filtroOffset = `OFFSET @offset ROWS
                      FETCH NEXT @limit ROWS ONLY`;

    let filtroSku = '';
    if (sku)
      filtroSku = prodPorCanal == '' ? `WHERE A.codigo = @sku` : `  AND A.codigo = @sku`;
    
    let query = 
      `WITH TEMP AS 
      (
        SELECT 
          A.CODIGO codigo,
          A.DESCRICAO descricao,
          E.DESCRICAO categoria,
          D.DESCRICAO subCategoria,
          C.DESCRICAO marca,
          A.IMAGEM imagem,
          A.ProdutoID
        FROM SKU A
          INNER JOIN PRODUTO B WITH (NOLOCK) ON A.PRODUTOID = B.ID
          INNER JOIN MARCA C WITH (NOLOCK) ON B.MARCAID = C.ID
          INNER JOIN PRODUTOSUBCATEGORIA D WITH (NOLOCK) ON B.PRODUTOSUBCATEGORIAID = D.ID
          INNER JOIN PRODUTOCATEGORIA E WITH (NOLOCK) ON B.PRODUTOCATEGORIAID = E.ID
        WHERE A.GCRECORD IS NULL
        AND B.GCRECORD IS NULL
        AND C.GCRECORD IS NULL
        AND D.GCRECORD IS NULL
        AND E.GCRECORD IS NULL
      )
      SELECT A.codigo, A.descricao, A.categoria, A.subCategoria, A.marca, A.imagem, COUNT(1) OVER () AS total 
      FROM TEMP A
      ${prodPorCanal}
      ${filtroSku}
      ORDER BY A.codigo
      ${filtroOffset}`;

    pool = await new sql.connect(connectionString)
    let sqlReturn = await pool.request()
        .input('tokenAccount', sql.VarChar, tokenAccount)
        .input('offset', sql.Int, offset)
        .input('limit', sql.Int, limit)
        .input('sku', sql.VarChar, sku)
        .query(query);

    if (!sqlReturn.recordset.length)
      throw `SKU '${sku}' não encontrado para o Token '${tokenAccount}'`


    let total = sqlReturn.recordset[0].total;
    sqlReturn.recordset.forEach(v => { 
      delete v.total;
    });

    retorno = {list: sqlReturn.recordset, total};  
  } finally {
    if (pool) await pool.close();
  }

  return retorno;
}

const getSkuStatus = async (connectionString, tokenAccount, ignoreDePara = false, sku = null, offset = null, limit = null) => {
  let retorno = {list:[], total: 0};
  let pool; 
  
  try {
    let prodPorCanal = '';
    if (!ignoreDePara) 
      prodPorCanal = `  INNER JOIN PRODUTOPRODUTOS_CANALVENDACANALVENDAS K WITH (NOLOCK) ON (K.PRODUTOS = A.PRODUTOID)
                        INNER JOIN CANALVENDA L WITH (NOLOCK) ON (L.ID = K.CANALVENDAS)
                      WHERE L.TOKENACCOUNT = @tokenAccount`;

    let filtroOffset = '';
    if (offset != null && limit != null)
      filtroOffset = `OFFSET @offset ROWS
                      FETCH NEXT @limit ROWS ONLY`;

    let filtroSku = '';
    if (sku)
      filtroSku = prodPorCanal == '' ? `WHERE A.sku = @sku` : `  AND A.sku = @sku`;
    
    let query = 
      `WITH TEMP AS 
      (
        SELECT 
          A.CODIGO sku,
          a.ProdutoID,
          ISNULL(
          CASE A.KITVENDAS 
            WHEN 0 THEN (
            SELECT TOP 1 C.PRECODE 
            FROM CANALVENDA B WITH (NOLOCK)
              INNER JOIN PACOTECOMERCIALITEM C WITH (NOLOCK) ON (B.PACOTECOMERCIALID = C.PACOTECOMERCIALID)
            WHERE B.TOKENACCOUNT = @tokenAccount
              AND B.GCRECORD IS NULL
              AND C.GCRECORD IS NULL
              AND C.SKUID = A.ID
            )
            WHEN 1 THEN	(
            SELECT TOP 1 SUM(C.PRECODE  * D.QUANTIDADE) PRECODE
            FROM CANALVENDA B WITH (NOLOCK)
              INNER JOIN PACOTECOMERCIALITEM C WITH (NOLOCK) ON (B.PACOTECOMERCIALID = C.PACOTECOMERCIALID)
              INNER JOIN PRODUTOESTRUTURAITEM D WITH (NOLOCK) ON (D.SKUID = C.SKUID)
              INNER JOIN PRODUTOESTRUTURA J WITH (NOLOCK) ON (D.PRODUTOESTRUTURAID = J.ID)
            WHERE B.TOKENACCOUNT = @tokenAccount
              AND B.GCRECORD IS NULL
              AND C.GCRECORD IS NULL
              AND D.GCRECORD IS NULL
              AND J.GCRECORD IS NULL
              AND J.SKUID = A.ID
            GROUP BY J.SKUID
            ) 
          END, 0) fromPrice, 
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
            SELECT TOP 1 SUM(C.PRECO * I.QUANTIDADE) PRECODE
            FROM CANALVENDA B WITH (NOLOCK)
              INNER JOIN PACOTECOMERCIALITEM C WITH (NOLOCK) ON (B.PACOTECOMERCIALID = C.PACOTECOMERCIALID)
              INNER JOIN PRODUTOESTRUTURAITEM I WITH (NOLOCK) ON (I.SKUID = C.SKUID)
              INNER JOIN PRODUTOESTRUTURA J WITH (NOLOCK) ON (I.PRODUTOESTRUTURAID = J.ID)
            WHERE B.TOKENACCOUNT = @tokenAccount
              AND B.GCRECORD IS NULL
              AND C.GCRECORD IS NULL
              AND I.GCRECORD IS NULL
              AND J.GCRECORD IS NULL
              AND J.SKUID = A.ID
            GROUP BY J.SKUID
            )
          END, 0) price, 
          ISNULL(
          CASE A.KITVENDAS 
            WHEN 0 THEN (
            SELECT TOP 1 H.QTDEATUAL - H.QTDEALOCADA SALDO  
            FROM CANALVENDA F WITH (NOLOCK)
              INNER JOIN UNIDADENEGOCIOUNIDADENEGOCIOS_ESTOQUEDEPOSITOESTOQUEDEPOSITOS G WITH (NOLOCK) ON (G.UNIDADENEGOCIOS = F.UNIDADENEGOCIOID)
              INNER JOIN ESTOQUESALDO H WITH (NOLOCK) ON (H.ESTOQUEDEPOSITOID = G.ESTOQUEDEPOSITOS)
            WHERE F.TOKENACCOUNT = @tokenAccount
              AND F.GCRECORD IS NULL
              AND H.GCRECORD IS NULL
              AND H.SKUID = A.ID)
            WHEN 1 THEN (
              SELECT TOP 1 MIN((ISNULL(H.QTDEATUAL,0) - ISNULL(H.QTDEALOCADA,0)) / J.QUANTIDADE) SALDO
              FROM PRODUTOESTRUTURAITEM J  
                INNER JOIN PRODUTOESTRUTURA K WITH (NOLOCK) ON (J.PRODUTOESTRUTURAID = K.ID)
                LEFT JOIN (
                  SELECT * 
                  FROM ESTOQUESALDO WITH (NOLOCK)
                  WHERE EXISTS (
                    SELECT 1 
                    FROM UNIDADENEGOCIOUNIDADENEGOCIOS_ESTOQUEDEPOSITOESTOQUEDEPOSITOS G
                      INNER JOIN CanalVenda F WITH (NOLOCK) ON (G.UNIDADENEGOCIOS = F.UNIDADENEGOCIOID)
                    WHERE F.TOKENACCOUNT = @tokenAccount 
                      AND F.GCRECORD IS NULL
                      AND ESTOQUEDEPOSITOID = G.ESTOQUEDEPOSITOS
                  )
                ) H ON (J.SkuID = H.SkuID)
              WHERE K.SKUID = A.ID
                AND J.GCRECORD IS NULL
                AND K.GCRECORD IS NULL
              GROUP BY K.SKUID
            ) 
          END, 0) stock                    
        FROM SKU A WITH (NOLOCK)
        WHERE A.GCRECORD IS NULL
      )
      SELECT A.sku, round(A.fromPrice, 2) fromPrice, round(A.price, 2) price, round(A.stock, 0,1) stock, COUNT(1) OVER () AS total 
      FROM TEMP A
      ${prodPorCanal}
      ${filtroSku}
      ORDER BY A.SKU
      ${filtroOffset}`;

    pool = await new sql.connect(connectionString)
    let sqlReturn = await pool.request()
        .input('tokenAccount', sql.VarChar, tokenAccount)
        .input('offset', sql.Int, offset)
        .input('limit', sql.Int, limit)
        .input('sku', sql.VarChar, sku)
        .query(query);

    if (!sqlReturn.recordset.length)
      throw `SKU '${sku}' não encontrado para o Token '${tokenAccount}'`

    let total = sqlReturn.recordset[0].total;
    sqlReturn.recordset.forEach(v => { 
      delete v.total;
      v.avaible = v.price > 0 && v.stock > 0;
    });

    retorno = {list: sqlReturn.recordset, total};  
  } finally {
    if (pool) await pool.close();
  }

  return retorno;
}

module.exports = {getSku, getSkuStatus};