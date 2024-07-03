

export function DispatchPickingLabel(orders) {

  for (let order of orders) {
    var myWindow = window.open('', 'PRINT', 'height=400,width=600');
    myWindow.document.write(`<h1>Pedido: ${order.order}</h1>`)
    myWindow.document.write(`<hr border-top: 3px dotted;/>`)
    myWindow.document.write(`<img width='350' src='data:image/jpeg;charset=utf-8;base64,${order.label}'/>`);
    myWindow.document.write(`<div style="page-break-after: always"></div>`);

  }
  myWindow.focus();
  myWindow.document.close();

  setTimeout(() => { myWindow.print() }, 200)

}

