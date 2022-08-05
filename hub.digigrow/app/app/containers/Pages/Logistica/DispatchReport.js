

export function DispatchReport(orders) {
  let limit = 37;
  let offset = 0
  for (let order of orders) {
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write(`
      <head>
        <style>
          table {
            border-collapse: collapse;
            width: 100%;
          }
      
          tr {
            border-bottom: 1px solid #ddd;
          }
          th {
            text-align: left;
          } 
          h1 {
            text-align:center;
          }
          h6 {
            border-top: 1px solid;
            text-align:center;
            margin-top: 10px;

          }
          
          h5 {
            border-top: 1px solid;
            text-align:center;
            margin-top: 50px;

          }
        </style>
      </head>`)
    if (offset == 0) {
      mywindow.document.write(`<div><strong><h1>LISTA DE POSTAGEM<h1></strong></div>`)
      mywindow.document.write(`<div><b>Data da Expedição: </b>${order.shipping.shippedDate ? new Date(order.shipping.shippedDate) : new Date()}`)
      mywindow.document.write(`<tbody><table>
        <thead>  
          <tr>
            <th>Número do Pedido</th>
            <th>Nome do Cliente</th>
            <th>Nota Fiscal</th>
            <hr>
          </tr>
        </thead>`)
    }
    mywindow.document.write(`     
        <tr>
          <td>${order.packId ? order.packId : order.externalId}</td>
          <td>${order.buyer.name.substring(0, 30)}</td>
          <td>${order.invoice.number}</td>          
          </tr>`);


    offset += 1

    if (offset > limit) { mywindow.document.write(`<tbody></table><div style="page-break-after: always"> </div>`); offset = 0 }
    // if (orders.length == offset) mywindow.document.write(`<tbody></table><footer><h5>Carimbo e assinatura / Matrícula da Transportadora</h5></footer><div style="page-break-after: always"> </div>`)
  }


  mywindow.focus();
  mywindow.print();
  mywindow.document.close();
}
