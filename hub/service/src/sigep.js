

const { clientSoap, prepareTags, calcFreight } = require('../../lib/data/sigepWeb');
const { toFixed } = require('../../lib/util/javaScript');

const executeSigep = async (service, db, config) => {
  switch (service.name) {
    case "getLabelPack":
      await getLabelPack(db, config);
      break;
    case "updatePriceFreight":
      await updatePriceFreight(db, config);
      break;

  }
};

const getLabelPack = async (db, config) => {

  try {

    let labelsColl = db.collection('labels');
    let availableLabels = await labelsColl.find({ status: 'available' }).toArray();

    let minQtyLabel = config.sigep.minQtdLabel;
    let serviceCode = config.sigep.transportServiceCode;
    let qtdEtiquetas = config.sigep.qtdLabelAdd;
    let business = config.sigep.cnpj;
    let credentials = config.sigep.credentials;

    for (let code of serviceCode) {

      if (availableLabels.filter(f => f.transportServiceCode == code.serviceName).length < minQtyLabel) {

        const client = await clientSoap('cep');

        const requestData = {
          tipoDestinatario: 'C',
          identificador: business,
          idServico: code.idServiceTransport,
          qtdEtiquetas: qtdEtiquetas,
          usuario: credentials.login,
          senha: credentials.password
        }

        let solicitaEtiquetasAsync = await client.solicitaEtiquetasAsync(requestData);
        let result = prepareTags(solicitaEtiquetasAsync[0].return);

        let insertLabels = result.map(m => { return { contract: config.sigep.contrato, code: m, status: 'available', orderIds: [], transportServiceCode: code.serviceName, createdAt: new Date() } })


        await labelsColl.insertMany(insertLabels);

      }
    }


  } catch (err) {
    err
  }

};

const updatePriceFreight = async (db, config) => {
  try {

    let zipCodeColl = db.collection('cep');
    let freightColl = db.collection('freight')
    let { sigep } = config;

    let zipCode = await zipCodeColl.find({}).toArray();

    let cServico = sigep.transportServiceCode.map(m => m.cServico);
    for (let cep of sigep.cepOrigin) {
      for (let zip of zipCode) {

        let { UF, zipStart, zipEnd } = zip;

        zipStart = parseInt(zipStart);
        zipEnd = parseInt(zipEnd);

        for (let weith of sigep.fieldsWeith) {

          for (let servico of cServico) {
            try {

              if (servico == '03220' && UF == cep.ufOrigin || UF != cep.ufOrigin && servico == '03298') {
                let body = {
                  nCdEmpresa: sigep.codAdministrativo,
                  sDsSenha: sigep.credentials.password,
                  nCdServico: servico,
                  sCepOrigem: cep.cepOriginCapital,
                  sCepDestino: zipEnd,
                  nVlPeso: weith,
                  nCdFormato: 1,
                  nVlComprimento: 60,
                  nVlAltura: 10,
                  nVlLargura: 10,
                  nVlDiametro: 10,
                  sCdMaoPropria: 'N',
                  nVlValorDeclarado: 0,
                  sCdAvisoRecebimento: 'N'

                }
                let resultCalc = await calcFreight(body);

                switch (servico) {
                  case "03220":
                    servico = "Expresso";
                    break;
                  case "03298":
                    servico = "Normal";
                    break;
                }

                let { PrazoEntrega, Valor, MsgErro, } = resultCalc;


                PrazoEntrega = Number(PrazoEntrega);
                let valueCost = Number((Valor.replace(',', '.')));
                let value = toFixed((valueCost * sigep.applyCost) + valueCost, 2);

                let update = {

                  $set: {
                    ufDestino: UF, cepOrigin: cep.cepOriginCapital, ufOrigin: cep.ufOrigin, zipStart, zipEnd, service: servico, estimaded: Number(PrazoEntrega), createdAt: new Date(), msgErro: MsgErro
                  },

                  $addToSet: {
                    values: { valueCost: toFixed(valueCost, 2), price: value, weithEnd: weith }
                  }
                };
                let filter = {
                  estimaded: PrazoEntrega, zipStart, zipEnd, service: servico, cepOrigin: cep.cepOriginCapital, ufDestino: UF,
                };

                await freightColl.updateMany(filter,
                  { $pull: { values: { weithEnd: weith } } },
                  { multi: true })

                await freightColl.updateOne(filter, update, { upsert: true });

              }


            } catch (err) {
              err
            }
          }
        }

      }
    }

  } catch (err) {
    err

  }

};


module.exports = { executeSigep, clientSoap, updatePriceFreight };