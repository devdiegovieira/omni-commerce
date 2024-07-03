let { toLocalDate } = require('../helper/date');

function digiOrderToInvento(digiOrder, tokenAccount, nomeCliente, numero) {


  let freight = digiOrder.freight * -1

  // PAYMENTS
  let payments = [];
  digiOrder.payments.forEach(e => {
    payments.push({
      Description: e.method.toLowerCase(),
      Parcels: e.installments,
      Value: e.value,
      InventoPaymentTransaction: e.paymentId
    });
  });


  //ITEMS
  let items = [];
  digiOrder.items.forEach(e => {
    items.push({
      SkuCode: e.sku,
      Quantity: e.amount,
      UnitPrice: e.unit,
      DiscountAmount: e.discount ? e.discount : 0,
      FinancialAmount: e.FinancialAmount ? (e.total / e.total) * e.FinancialAmount : 0,
      TotalAmount: e.total
    });
  });

  return [{
    SellerKey: tokenAccount,
    Customer: {
      Name: digiOrder.buyer.name,
      DocumentType: digiOrder.buyer.documentType,
      DocumentNumber: digiOrder.buyer.document,
      Email: digiOrder.buyer.email,
      PhoneNumber: digiOrder.buyer.phone,
      Gender: 1,
      StateInscription: null,
      Address: {
        Recipient: null,
        Identification: null,
        Street: digiOrder.shipping ? digiOrder.shipping.street : null,
        Complement: digiOrder.shipping ? digiOrder.shipping.comment : null,
        Number: digiOrder.shipping ? digiOrder.shipping.number : null,
        ZipCode: digiOrder.shipping ? digiOrder.shipping.zipCode : null,
        State: digiOrder.shipping ? digiOrder.shipping.state : null,
        City: digiOrder.shipping ? digiOrder.shipping.city : null,
        Neighborhood: digiOrder.shipping ? digiOrder.shipping.neighborhood : null,
        Reference: null
      }
    },
    Status: digiOrder.status == 'invoiced' ? 2 : digiOrder.status == 'paid' ? 1 : digiOrder.status == 'cancelled' ? 9 : 0,
    Number: numero,
    SaleDate: digiOrder.dateClosed ? toLocalDate(digiOrder.dateClosed) : null,
    CancellationDate: null,
    Payments: payments,
    CarrierService: {
      Description: digiOrder.shipping && digiOrder.shipping.trackingMethod ? digiOrder.shipping.trackingMethod.toLowerCase() : 'À COMBINAR',
      ShippingAmount: freight,
      DeliveryDate: digiOrder.shipping && digiOrder.shipping.estimateDeliveryDate ? toLocalDate(digiOrder.saleDate) : null,
      Gift: null,
      GiftMessage: null,
      Transports: null,
      ShippingAddress: {
        Recipient: null,
        Identification: null,
        Street: digiOrder.shipping ? digiOrder.shipping.address : null,
        Complement: digiOrder.shipping ? digiOrder.shipping.comment : null,
        Number: digiOrder.shipping ? digiOrder.shipping.number : null,
        ZipCode: digiOrder.shipping ? digiOrder.shipping.zipCode : null,
        State: digiOrder.shipping ? digiOrder.shipping.state : null,
        City: digiOrder.shipping ? digiOrder.shipping.city : null,
        Neighborhood: digiOrder.shipping ? digiOrder.shipping.neighborhood : null,
        Reference: null
      }
    },
    Amount: digiOrder.gross,
    FinancialAmount: parseFloat((items.reduce((n, { FinancialAmount }) => n + FinancialAmount, 0)).toFixed(2)),
    Channel: nomeCliente.toLowerCase(),
    PriceListName: null,
    TotalAmountCollected: digiOrder.gross + freight,
    Fulfillment: digiOrder.shipping ? digiOrder.shipping.fulfillment : false,
    FulfillmentInvoiceLink: digiOrder.invoice ? digiOrder.invoice.invoiceLink : '',
    Items: items,
    Messages: null
  }];
}

let inventoSkuToDigi = (packSku) => {
  let skus = []

  for (let skuInvento of packSku) {
    skus.push(
      {
        sku: skuInvento.sku,
        stock: skuInvento.stock,
        price: skuInvento.price
      }
    );
  }

  return skus;
}

let inventoStatusToDigi = (packStatus) => {
  return packStatus.map(m => {
    return {
      status: m.Status,
      tracking: {
        number: m.Transports && m.Transports.length ? m.Transports[0].TrackingNumber : null,
        shippedDate: '',
        deliveredDate: new Date(),
      },
      orderId: m.OrderNumber.split('-')[0]
    }
  });
}

module.exports = { digiOrderToInvento, inventoSkuToDigi, inventoStatusToDigi };


