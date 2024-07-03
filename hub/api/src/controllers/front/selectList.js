const express = require('express');
const { ObjectId } = require('mongodb');
const { getSelectList } = require('../../../../lib/data/selectList');
const { getUserByToken } = require('../../../../lib/data/user');
const { getAttributes } = require('../../../../lib/http/mercadoLivre');
const { getErrorMessage } = require('../../../../lib/util/error');
const user = require('./user');

const router = express.Router();

router.get('/condition', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    res.status(200).json(
      await getSelectList(db, user.sellerIds, 'publish', 'condition', undefined, (distinct) => {
        return distinct.map(m => {
          let title;

          switch (m) {
            case 'new':
              title = 'Novo';
              break;
            case 'used':
              title = 'Usado'
              break;
            case 'not_specified':
              title = 'Não especificado'
              break;
            default:
              title = 'Nenhum'
          };

          return {
            id: m,
            title
          }
        })
      })
    );
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/shipmode', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    res.status(200).json(
      await getSelectList(db, user.sellerIds, 'publish', 'shipMode', undefined, (distinct) => {
        return distinct.map(m => {
          let title = m;

          switch (m) {
            case 'me1':
              title = 'Mercado Envios 1';
              break;
            case 'me2':
              title = 'Mercado Envios 2';
              break;
            case 'not_specified':
              title = 'Não Especificado'
              break;
            default:
              title = 'Nenhum'
          };

          return {
            id: m,
            title
          }
        })
      })
    );
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/listingtype', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    res.status(200).json(
      await getSelectList(db, user.sellerIds, 'publish', 'listingType', undefined, (distinct) => {
        return distinct.map(m => {
          let title = m;

          switch (m) {
            case 'gold_pro':
              title = 'Premium';
              break;
            case 'gold_special':
              title = 'Clássico';
              break;
            default:
              title = 'Nenhum'


          };

          return {
            id: m,
            title
          }
        })
      })
    );
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/sellerid', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    res.status(200).json(
      await getSelectList(db, user.sellerIds, 'seller', '_id', 'code', undefined, { status: 'concluded' })
    );
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/platformid', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    res.status(200).json(
      await getSelectList(db, user.sellerIds, 'platform', '_id', 'name')
    );
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/research', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let configColl = db.collection('config')
    let researchList = await configColl.findOne({})
    let research = researchList.registrationResearch

    res.status(200).json(research);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/marketplaceid', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    res.status(200).json(
      await getSelectList(db, user.sellerIds, 'marketPlace', '_id', 'name')
    );
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/orderstatus', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    // test = await getSelectList(db, user.sellerIds, 'order', 'status', undefined, (distinct) => {
    //   return distinct.map(m => {
    //     let title = m;

    //     switch (m) {
    //       case 'cancelled':
    //         title = 'Cancelado';
    //         break;
    //       case 'invoiced':
    //         title = 'Faturado';
    //         break;
    //       case 'paid':5
    //         title = 'Pago';
    //         break;
    //       case 'shipped':
    //         title = 'Finalizado';
    //         break;        
    //     };

    //     return {
    //       id: m,
    //       title
    //     }
    //   })
    // })


    res.status(200).json([
      {
        id: 'cancelled',
        title: 'Cancelado'
      },
      {
        id: 'invoiced',
        title: 'Faturado'
      },
      {
        id: 'paid',
        title: 'Pago'
      },
      {
        id: 'delivered',
        title: 'Enviado'
      },
      {
        id: 'concluded',
        title: 'Concluido'
      }
    ]
    );
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/oficialstore', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    res.status(200).json(
      ret = await getSelectList(db, user.sellerIds, 'publish', 'oficialStore', undefined, (distinct) => {
        return distinct.map(m => {
          return {
            id: m,
            title: `Loja ${m}`,
          }
        })
      })
    );
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/status', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    res.status(200).json(
      await getSelectList(db, user.sellerIds, 'publish', 'status', undefined, (distinct) => {
        return distinct.map(m => {
          let title;

          switch (m) {
            case 'active':
              title = 'Ativo';
              break;
            case 'closed':
              title = 'Finalizado';
              break;
            case 'paused':
              title = 'Em Pausa';
              break;
            case 'unlinked':
              title = 'Desvinculado'
              break;
            case 'pending':
              title = 'Pendente'
              break;
            case 'inactive':
              title = 'Inativo'
              break;
            default:
              title = 'Nenhum'
          };

          return {
            id: m,
            title
          }
        })
      })
    );
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/paymentstatus', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    res.status(200).json(
      await getSelectList(db, user.sellerIds, 'order', 'payments.status', undefined, (distinct) => {
        return distinct.map(m => {
          let title = m;

          switch (m) {
            case 'approved':
              title = 'Aprovado';
              break;
            case 'cancelled':
              title = 'Cancelado';
              break;
            case 'charged_back':
              title = 'Estornado';
              break;
            case 'in_mediation':
              title = 'Em mediação';
              break;
            case 'received':
              title = 'Recebido';
              break;
            case 'refunded':
              title = 'Devolvido';
              break;
            case 'rejected':
              title = 'Rejeitado';
              break;
            default:
              title = 'Nenhum'
          };

          return {
            id: m,
            title
          }
        })
      })
    );
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/attributes/:category', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let configColl = db.collection('config');
    let config = await configColl.findOne({});

    let { category, tags } = req.params;

    let retMeli = await getAttributes(db, config, category);

    let rett1 = retMeli.filter(f => f.tags.read_only != true);
    let rett2 = rett1.filter(f => f.tags.restricted_values != true);
    let rett3 = rett2.filter(f => f.tags.inferred != true);

    let attributes = rett3.map(m => { return { id: m.id, title: m.name, tag: m.tags } });

    res.status(200).json(attributes);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/skuatt', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    let skuCollection = db.collection('sku');

    res.status(200).json((await skuCollection.distinct('attributes.id', { sellerId: { $in: user.sellerIds } })).map(m => { return { id: m, title: m } }));

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/category/', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    let skuCollection = db.collection('sku');

    res.status(200).json((await skuCollection.distinct('categoryId', { sellerId: { $in: user.sellerIds } })).map(m => { return { id: m, title: m } }));

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/pubatt', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    let publishCollection = db.collection('publish');
    let skuXPublishColl = db.collection('skuXPublish');

    let { category } = req.query;

    let pubArray = await publishCollection.find({ category, sellerId: { $in: user.sellerIds } }, { projection: { publishId: 1 } }).toArray();

    let atts = await skuXPublishColl.distinct('attributes.name', { 'attributes.custom': true, publishId: { $in: pubArray.map(m => m.publishId) } });


    res.status(200).json(atts.map(m => {
      return {
        id: m,
        title: m
      }
    }));

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/pubatt/:id/value', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let skuXPublishCollection = db.collection('skuXPublish');

    let atts = await skuXPublishCollection.find({ 'attributes.value_name': { $ne: null }, 'attributes.custom': true, 'attributes.name': req.params.id, sellerId: { $in: user.sellerIds } }, { projection: { attributes: 1 } }).toArray();

    let attsArray = [];
    atts.map(m => {
      let teste = m.attributes.filter(f => f.custom && f.name == req.params.id)
      attsArray.push(...teste);
    })

    res.status(200).json(attsArray.map(m => {
      return {
        id: m.value_name,
        title: m.value_name
      }
    }));

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/skuatt/:id/value', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    let skuCollection = db.collection('sku');

    let atts = await skuCollection.distinct('attributes', { sellerId: { $in: user.sellerIds }, 'attributes.id': req.params.id });


    res.status(200).json(atts.filter(f => f.id == req.params.id).map(m => { return { id: m.value, title: m.value } }));

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/printed', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    let result = await getSelectList(db, user.sellerIds, 'order', 'printed', undefined, (distinct) => {
      return distinct.map(m => {
        let title = m;

        switch (m) {
          case false:
            title = 'Impressão Pendente';
            break;
          case true:
            title = 'Impresso';
            break;
            
        };

        return {
          id: m,
          title
        }
      })
    })


    res.status(200).json(result);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});


module.exports = app => app.use('/v1/front/selectlist', router);
