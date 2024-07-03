import Axios from 'axios';
import { promisseApi } from '../api/api';

export const getMeliWarranty = (categoryId) => {

  let config = {
    url: `https://api.mercadolibre.com/categories/${categoryId}/sale_terms`
  }

  promisseApi(
    'get',
    '',
    ret => {

      let type = ret.data.filter(f => f.id == 'WARRANTY_TYPE' || f.id == 'WARRANTY_TYPE');
      let time = ret.data.filter(f => f.id == 'WARRANTY_TIME' || f.id == 'WARRANTY_TIME');

      let array = {};

      time.map(m => { return array = { id: m.id, title: m.allowed_units.map((m0, index) => m0.name) } })

      let retArr = [];

      array.title.map((item, index) => {
        retArr.push({
          id: array.id,
          title: item
        })
      })

      type.map(m => { return array = { id: m.id, title: m.values.map((m0, index) => m0.name) } })

      array.title.map((item, index) => {
        retArr.push({
          id: array.id,
          title: item
        })
      })

      handleSuccess(retArr.filter(f => f.id == `WARRANTY_${filter.toUpperCase()}`));
    },
    handleError,
    {},
    config
  );
}

export const getMeliSuggestionCategory = (title) => {

  let config = {
    url: `https://api.mercadolibre.com/sites/MLB/domain_discovery/search`,
    params: {
      limit: 1,
      q: `${title}`,
    }
  }

  promisseApi(
    'get',
    '',
    ret => {

      let selected = [];

      ret.map(m =>
        selected.push({ id: m.category_id, title: m.category_name }));


      handleSuccess(selected);
    },
    handleError,
    {},
    config
  );
}

export const getSaleTerms = (category, handleSuccess, handleError) => {


   Axios.get(`https://api.mercadolibre.com/categories/${category}/sale_terms`)
    .then((ret) => handleSuccess(ret.data)).catch(handleError)
}

export const getCondition = (category_id) => {

  let config = {
    url: `https://api.mercadolibre.com/categories/${category_id}/attributes`,
    params: {
    }
  }
  promisseApi(
    'get',
    '',
    ret => {

      let selected = ret.seller.id.filter(m => m == 'ITEM_CONDITION');

      let arrayRet = [];

      selected.values.map(m => { return arrayRet.push({ id: m._id, title: m.name }) })

      handleSuccess(arrayRet);
    },
    handleError,
    {},
    config
  );
}

export const getMeliOfficialStore = (sellerId) => {

  let config = {
    url: `https://api.mercadolibre.com/users/${sellerId}/brands`,
    params: {
    }
  }

  promisseApi(
    'get',
    '',
    ret => {

      let selected = [];

      ret.brands.map(m =>
        selected.push({ id: m.official_store_id, title: m.name }));

      handleSuccess(selected);
    },
    handleError,
    {},
    config
  );
}

export const getMeliListing_type_id = (sellerId) => {


  let config = {
    url: `https://api.mercadolibre.com/users/${sellerId}/brands`,
    params: {
    }
  }
  promisseApi(
    'get',
    '',
    ret => {

      let selected = ret.filter(m => m.id == 'gold_pro' || m.id == 'gold_special' || m.id == 'free');

      let array = [];

      selected.map(m => { return array.push({ id: m.id, title: m.name }) });

      handleSuccess(selected);
    },
    handleError,
    {},
    config
  );
}

export const getEshop = (sellerId) => {

  let config = {
    url: `https://api.mercadolibre.com/sites/MLB/search`,
    params: {
      seller_id: `${sellerId}`
    }
  }
  promisseApi(
    'get',
    '',
    ret => {

      let selected = ret.seller.tags.filter(m => m == 'mshops');

      let arrayRet = [];

      selected.map(m => { return arrayRet.push({ id: 1, title: m }, { id: 2, title: 'marketplace' }) })

      handleSuccess(arrayRet);
    },
    handleError,
    {},
    config
  );
}

export const getShipMode = (sellerId) => {

  let config = {
    url: `https://api.mercadolibre.com/users/${sellerId}/shipping_preferences`,
    params: {

    }
  }
  promisseApi(
    'get',
    '',
    ret => {

      let selected = ret.seller.modes;

      let arrayRet = [];

      selected.map((m, index) => { return arrayRet.push({ id: index, title: m }) })

      handleSuccess(arrayRet);
    },
    handleError,
    {},
    config
  );
}

export const getAttributes = (categoryId, handleSuccess, handleError) => {

  Axios.get(`https://api.mercadolibre.com/categories/${categoryId}/technical_specs/input`)
    .then((ret) => handleSuccess(ret.data)).catch(handleError)

}
