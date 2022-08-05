let {
  chunkArray
} = require('../helper/javaScript');

let {
  postPedidoInvento,
  getQueuePrice,
  getQueueStock,
  removeQueue,
  getOrderNumberInvento,
  getPedidoStatusInvento
} = require('../http/invento');

let {
  putSkuDigigrow, getFilaPedidoDigigrow, getPedidosDigigrow, deleteFilaPedidoDigigrow, putStatusPedidoDigigrow
} = require('../http/digigrow');

let {
  digiOrderToInvento,
  inventoSkuToDigi,
  inventoStatusToDigi
} = require('../interface/digiInvento');


const executeDigigrow = async (service, database, config) => {
  switch (service.name) {
    case "integrarSaldoDigiInvento":
      await integrarSaldoDigiInvento(database, config, service);
      break;
    case "integrarPrecoDigiInvento":
      await integrarPrecoDigiInvento(database, config, service);
      break;
    case "integrarFilaPedidoDigigrow":
      await integrarFilaPedidoDigigrow(database, config, service);
      break;
    case "integrarStatusPedidoDigigrow":
      await integrarStatusPedidoDigigrow(database, config, service);
      break;
  }
}

const integrarSaldoDigiInvento = async (database, config, service) => {
  let erroColl = database.collection('erro');
  let sucessoColl = database.collection('sucesso');

  for (let sellerDigigrow of config.sellerDigigrow.filter(f => f.invento.tokenAccount && f.integrarSaldo)) {
    try {
      // Get Stock invento
      let { list } = await getQueueStock(config, sellerDigigrow.invento.tokenAccount);
      let packsStock = chunkArray(list, 50);

      let confirmInvento = [];

      for (let pack of packsStock) {
        try {
          let packRet = await putSkuDigigrow(config, sellerDigigrow, inventoSkuToDigi(pack));
          if (!packRet) 
            packRet = [];

          for (let ret of packRet) {
            if (ret.type == 'success') {
              queueInvento = pack.find(f => f.sku == ret.sku);

              await sucessoColl.updateOne(
                {
                  sku: ret.sku,
                  serviceName: service.name,
                  'sellerDigigrow._id': sellerDigigrow._id
                },
                {
                  $set: {
                    sku: ret.sku,
                    serviceName: service.name,
                    seller: sellerDigigrow.nome,
                    responseDigigrow: ret,
                    data: new Date()
                  }
                },
                { upsert: true });

              confirmInvento.push(queueInvento.queueId);
            }
            else {
              await erroColl.updateOne(
                {
                  sku: ret.sku,
                  serviceName: service.name,
                  'sellerDigigrow._id': sellerDigigrow._id
                },
                {
                  $set: {
                    sku: ret.sku,
                    serviceName: service.name,
                    sellerDigigrow,
                    responseDigigrow: ret,
                    data: new Date(),
                  }
                },
                { upsert: true });
            }

          }

        }
        catch (error) {
          let errorMessage = error.response ? error.response.data : error.message ? error.message : JSON.stringify(error);
          let log = { data: new Date(), errorMessage, sellerDigigrow, pack };
          await erroColl.updateOne(
            { 'sellerDigigrow._id': sellerDigigrow._id, serviceName: service.name },
            { $set: { log, serviceName: service.name } },
            { upsert: true }
          );
        }
      }

      if (confirmInvento.length) {
        // remove da fila do invento após processar
        await removeQueue(config, sellerDigigrow.invento.tokenAccount, confirmInvento);
      }


    } catch (error) {
      let errorMessage = error.response ? error.response.data : error.message ? error.message : JSON.stringify(error);
      let log = { data: new Date(), errorMessage, sellerDigigrow };
      await erroColl.updateOne(
        { 'sellerDigigrow._id': sellerDigigrow._id, serviceName: service.name },
        { $set: { log, serviceName: service.name } },
        { upsert: true }
      );
    }
  }
}

const integrarPrecoDigiInvento = async (database, config, service) => {
  let erroColl = database.collection('erro');
  let sucessoColl = database.collection('sucesso');

  for (let sellerDigigrow of config.sellerDigigrow.filter(f => f.invento.tokenAccount && f.integrarSaldo)) {
    try {
      // Get Preço invento
      let { list } = await getQueuePrice(config, sellerDigigrow.invento.tokenAccount);
      let packsStock = chunkArray(list, 50);

      let confirmInvento = [];

      for (let pack of packsStock) {
        try {
          let packRet = await putSkuDigigrow(config, sellerDigigrow, inventoSkuToDigi(pack));


          for (let ret of packRet) {

            if (ret.type == 'success') {
              queueInvento = pack.find(f => f.sku == ret.sku);

              await sucessoColl.updateOne(
                {
                  sku: ret.sku,
                  serviceName: service.name,
                  'sellerDigigrow._id': sellerDigigrow._id
                },
                {
                  $set: {
                    sku: ret.sku,
                    serviceName: service.name,
                    seller: sellerDigigrow.nome,
                    responseDigigrow: ret,
                    data: new Date()
                  }
                },
                { upsert: true });

              confirmInvento.push(queueInvento.queueId);
            }
            else {
              await erroColl.updateOne(
                {
                  sku: ret.sku,
                  serviceName: service.name,
                  'sellerDigigrow._id': sellerDigigrow._id
                },
                {
                  $set: {
                    sku: ret.sku,
                    serviceName: service.name,
                    sellerDigigrow,
                    responseDigigrow: ret,
                    data: new Date(),
                  }
                },
                { upsert: true });
            }


          }

        }
        catch (error) {
          let errorMessage = error.response ? error.response.data : error.message ? error.message : JSON.stringify(error);
          let log = { data: new Date(), errorMessage, sellerDigigrow, pack };
          await erroColl.updateOne(
            { 'sellerDigigrow._id': sellerDigigrow._id, serviceName: service.name },
            { $set: { log, serviceName: service.name } },
            { upsert: true }
          );
        }
      }

      if (confirmInvento.length) {
        // remove da fila do invento após processar
        await removeQueue(config, sellerDigigrow.invento.tokenAccount, confirmInvento);
      }


    } catch (error) {
      let errorMessage = error.response ? error.response.data : error.message ? error.message : JSON.stringify(error);
      let log = { data: new Date(), errorMessage, sellerDigigrow };
      await erroColl.updateOne(
        { 'sellerDigigrow._id': sellerDigigrow._id, serviceName: service.name },
        { $set: { log, serviceName: service.name } },
        { upsert: true }
      );
    }
  }
}

const integrarFilaPedidoDigigrow = async (database, config, service) => {
  let erroColl = database.collection('erro');
  let sucessoColl = database.collection('sucesso');

  try {
    let filaDigi = await getFilaPedidoDigigrow(config, config.sellerDigigrow[0]);
    let pacotes = chunkArray(filaDigi, 50);


    for (let pacote of pacotes) {
      try {

        let ordersDigi = await getPedidosDigigrow(config, config.sellerDigigrow[0], pacote.map(m => { return m.content.externalId }).join(','))

        for (let orderDigi of ordersDigi) {
          let requestInvento;

          let cliente;
          try {
            cliente = config.sellerDigigrow.find(f => f.digigrow.sellerId == orderDigi.sellerId)
            if (!cliente) throw `Cliente sellerId ${orderDigi.sellerId} não encontrado na collection sellerDigigrow.digigrow.sellerId`;

            let numeroInvento = await getOrderNumberInvento(
              config,
              cliente.invento.tokenAccount,
              orderDigi.packId ? orderDigi.packId : orderDigi.externalId
            );

            let numeroPedido =
              numeroInvento.Numero ? numeroInvento.Numero : orderDigi.packId ? orderDigi.packId : orderDigi.externalId;

            let nomeCliente =
              cliente.invento.channels && cliente.invento.channels.find(f => f.marketPlaceId == orderDigi.marketPlaceId) ?
                cliente.invento.channels.find(f => f.marketPlaceId == orderDigi.marketPlaceId).title : cliente.nome;

            requestInvento = digiOrderToInvento(orderDigi, cliente.invento.tokenAccount, nomeCliente, numeroPedido);
            let retornoInvento = (await postPedidoInvento(config, cliente.invento, requestInvento))[0];

            if (retornoInvento.Success) {
              await sucessoColl.updateOne(
                {
                  order: orderDigi.externalId,
                  serviceName: service.name
                },
                {
                  $set: {
                    order: orderDigi.externalId,
                    serviceName: service.name,
                    cliente,
                    requestInvento,
                    retornoInvento,
                    data: new Date()
                  }
                },
                { upsert: true }
              );

              let queueByOrder = pacote.find(f => f.content.externalId == orderDigi.packId || f.content.externalId == orderDigi.externalId);
              await deleteFilaPedidoDigigrow(config, cliente, [queueByOrder._id])
              await erroColl.deleteOne({ order: orderDigi.externalId });
            }
            else throw retornoInvento;
          }
          catch (error) {
            let errorMessage =
              error.response ?
                error.response.data :
                error.Message ?
                  error.Message : error.message ? error.message :
                    Array.isArray(error) || typeof error == 'string' ?
                      error :
                      JSON.stringify(error);

            await erroColl.updateOne(
              { 'cliente._id': cliente ? cliente._id : null, serviceName: service.name, order: orderDigi.externalId },
              { $set: { serviceName: service.name, order: orderDigi.externalId, requestInvento, cliente, errorMessage } },
              { upsert: true }
            );
          }
        }
      }
      catch (error) {
        let errorMessage =
          error.response ?
            error.response.data :
            error.Message ?
              error.Message : error.message ? error.message :
                Array.isArray(error) || typeof error == 'string' ?
                  error :
                  JSON.stringify(error);

        await erroColl.insertOne(
          { serviceName: service.name, errorMessage, pacote }
        );
      }
    }
  }
  catch (error) {
    let errorMessage =
      error.response ?
        error.response.data :
        error.Message ?
          error.Message : error.message ? error.message :
            Array.isArray(error) || typeof error == 'string' ?
              error :
              JSON.stringify(error);

    await erroColl.insertOne(
      { serviceName: service.name, errorMessage }
    );
  }
}

const integrarStatusPedidoDigigrow = async (database, config, service) => {
  let erroColl = database.collection('erro');
  let sucessoColl = database.collection('sucesso');

  for (let sellerDigigrow of config.sellerDigigrow.filter(f => f.invento.tokenAccount && f.integrarStatus)) {
    try {
      let listaStatusInvento = await getPedidoStatusInvento(config, sellerDigigrow.invento);

      if (listaStatusInvento && listaStatusInvento.length) {
        let listaRetornoDigi = await putStatusPedidoDigigrow(config, sellerDigigrow, inventoStatusToDigi(listaStatusInvento));

        let statusInventoToDelete = [];

        statusInventoToDelete.push(
          {
            SellerKey: cliente.tokenAccount,
            QueueID: status.QueueID
          }
        );

        if (statusInventoToDelete.length) {
          // Apagar itens da fila do invento
          let retornos = (await removePedidoStatusInvento(config, cliente, statusInventoToDelete)).data;

          for (let retorno of retornos) {
            if (retorno.Error) {
              retorno.date = new Date();
              await erroColl.updateOne({ QueueID: retorno.QueueID }, { $set: retorno }, { upsert: true })
            }
          }
        }

      }

    } catch (error) {
      let errorMessage = error.response ? error.response.data : error.message ? error.message : JSON.stringify(error);
      let log = { data: new Date(), errorMessage, sellerDigigrow };
      await erroColl.updateOne(
        { 'sellerDigigrow._id': sellerDigigrow._id, serviceName: service.name },
        { $set: { log, serviceName: service.name } },
        { upsert: true }
      );
    }
  }
}

module.exports = { executeDigigrow }  