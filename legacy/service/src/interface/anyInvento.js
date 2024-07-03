function anyOrderToInvento(anyOrder, tokenAccount){

  // PAYMENTS
  let payments = []; 
  anyOrder.payments.forEach(e => {
    payments.push({
      Description: e.method.toLowerCase(),
      Parcels: e.installments,
      Value: e.value,
      InventoPaymentTransaction: e.marketplaceId
    });
  });
  

  //ITEMS
  let items = []; 
  anyOrder.items.forEach(e => {
    items.push({
      SkuCode: e.sku.partnerId,
      Quantity: e.amount,
      UnitPrice: e.unit,      
      DiscountAmount: e.discount ? e.discount : 0,
      FinancialAmount: anyOrder.FinancialAmount ? (e.total / anyOrder.total) * anyOrder.FinancialAmount : 0,
      TotalAmount: e.total
    });
  });

  return [{
    SellerKey: tokenAccount,
    Customer: {
      Name: anyOrder.buyer.name,
      DocumentType: anyOrder.buyer.documentType,
      DocumentNumber: anyOrder.buyer.document,
      Email: anyOrder.buyer.email,
      PhoneNumber: anyOrder.buyer.phone,
      Gender: 1,
      StateInscription: null,
      Address: {
        Recipient: null,
        Identification: null,
        Street: anyOrder.shipping.street,
        Complement: anyOrder.shipping.comment,
        Number: anyOrder.shipping.number,
        ZipCode: anyOrder.shipping.zipCode,
        State: anyOrder.shipping.state,
        City: anyOrder.shipping.city,
        Neighborhood: anyOrder.shipping.neighborhood,
        Reference: null
      }
    },
    Status: anyOrder.status == 'PAID_WAITING_SHIP' ? 1 : anyOrder.status == 'CANCELED' ? 9 : 0,
    Number: anyOrder.marketPlaceUrl ? `${anyOrder.marketPlaceUrl.split('/')[4]}-${anyOrder.id}` : `${anyOrder.marketPlaceNumber}-${anyOrder.id}`,
    // SaleDate: `${data.getFullYear()}-${data.getMonth().padStart(2, '0') + 1}-${data.getDate().padStart(2, '0')}T${data.getHours().padStart(2, '0')}:${data.getMinutes().padStart(2, '0')}:${data.getSeconds().padStart(2, '0')}Z`  ,
    SaleDate: anyOrder.paymentDate ,
    CancellationDate: null,
    Payments: payments,
    CarrierService: {
      Description: anyOrder.items[0].shippings[0].shippingtype.toLowerCase(),
      ShippingAmount: anyOrder.freight + anyOrder.sellerFreight,
      DeliveryDate:  anyOrder.shipping.promisedShippingTime,
      Gift: null,
      GiftMessage: null,
      Transports: null,
      ShippingAddress: {
        Recipient: null,
        Identification: null,
        Street: anyOrder.shipping.address,
        Complement: anyOrder.shipping.comment,
        Number:anyOrder.shipping.number,
        ZipCode: anyOrder.shipping.zipCode,
        State: anyOrder.shipping.state,
        City: anyOrder.shipping.city,
        Neighborhood: anyOrder.shipping.neighborhood,
        Reference: null
      }
    },
    Amount: anyOrder.gross,
    FinancialAmount: anyOrder.interestValue,
    Channel: anyOrder.accountName,
    PriceListName: null,
    TotalAmountCollected: anyOrder.gross + anyOrder.freight + anyOrder.sellerFreight,
    Fulfillment: anyOrder.fulfillment,
    FulfillmentInvoiceLink: anyOrder.invoice ? anyOrder.invoice.invoiceLink : '',
    Items: items,
    Messages: null    
  }];
}

let inventoToAnyStatus = (idAny, status) => {

  let dataAny = { order_id: idAny };
                
  // Faturado
  if (status.Status == 2) {
    dataAny.status = 'INVOICED';
    dataAny.invoice = {
      series: status.Transports[0].Invoice.AccessKey.substring(22, 25),
      number: status.Transports[0].Invoice.Number,
      accessKey: status.Transports[0].Invoice.AccessKey,
      date: `${status.Transports[0].Invoice.RegisterDate.split('.')[0]}Z`
    };
  }

  // Enviado
  if (status.Status == 3) {
    let tracking = status.Transports.filter(f => f.TrackingNumber);

    if (tracking.length > 0) tracking = tracking[0];

    dataAny.status = 'PAID_WAITING_DELIVERY';
    dataAny.tracking = {
      date: `${new Date().toISOString().split('.')[0]}Z`,
      shippedDate: `${new Date().toISOString().split('.')[0]}Z`,
      carrier: tracking.CarrierName,
      number: tracking.TrackingNumber,
      url: tracking.TrackingLink
    };
  }

  return dataAny;
}

// let inventoToAnyStock = (skusInvento, skusAny) => {
//   let stockAny = [];
//   skusInvento.forEach(skuInvento => {
//     if (skusAny.find(skuAny => skuAny.skuInvento == skuInvento.sku)) {
//       stockAny.push({
//         partnerId: skuInvento.sku,
//         quantity: skuInvento.stock,
//         cost: 1
//       });    
//     }
//   });

//   return stockAny;
// }

let inventoToAnyStock = (skuInvento) => {
  return [{
    partnerId: skuInvento.sku,
    quantity: skuInvento.stock,
    cost: 1
  }];
}

let inventoToAnyPrice = (skuInvento) => {
  return {
    title: skuInvento.descricao,
    partnerId: skuInvento.sku,
    ean: skuInvento.ean,
    price: skuInvento.price
  };
}

module.exports = {anyOrderToInvento, inventoToAnyStatus, inventoToAnyStock, inventoToAnyPrice}; 


