

export function SeparacaoPickList(orders) {

  for (let order of orders) {

    var mywindow = window.open('', 'PRINT', 'height=400,width=600');
    // mywindow.document.write(`<div style="page-break-after:"always">`)
    mywindow.document.write('<div style="justify-content: center"><strong><h1>SEPARAÇÃO DE MERCADORIAS<h1></strong></div>');
    mywindow.document.write(`<div><b>Pedido Número: </b>${order.order}`);
    mywindow.document.write(`<b> Nome</b>: ${order.name}<div>`);
    mywindow.document.write(`<div><b>CPF/CNPJ: </b>${order.document}</div>`);
    mywindow.document.write(`<div><b>Data da venda: </b>${new Date(order.dateClosed).toLocaleString()}`);

    order.items.map(mm =>
      mywindow.document.write(`<div><hr><input type="checkbox"> ${mm.title} <p><b>SKU</b> : ${mm.sku} | <b>Quatidade:</b> ${mm.quantity}<p><hr></div >`))
    mywindow.document.write(`<div style="page-break-after: always"></div>`);
  }
  mywindow.focus();
  mywindow.print();
  mywindow.document.close();
}

