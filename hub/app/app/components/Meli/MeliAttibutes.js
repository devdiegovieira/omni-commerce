import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Divider, Grid, Input, MenuItem, Select, Switch, } from '@material-ui/core';
import { getAttributes } from '../../utils/mercadoLivre';




function MeliAttibutes(props) {
  const {
    category,
    attributes = [],
    filter = f => !f.tags.find(ff => ff == 'variation_attribute' || ff == 'allow_variations'),
    onChange = () => { }
  } = props;

  const [meliAttributes, setMeliAttributes] = useState([]);

  useEffect(() => {
    if (category) {
      // let reqFields = []

      getAttributes(
        category,
        (retAtts) => {
          let newAtts = [];

          for (let group of retAtts.groups) {
            for (let component of group.components) {
              newAtts.push(...component.attributes)
            }
          }

          // for (let att of newAtts.filter(f => f.tags.find(ff => ff == 'catalog_required'))) {
          //   reqFields.push({
          //     field: att.id,
          //     message: `O Campo Ficha Técnica do Anúncio > ${att.name} é obrigatório`
          //   });
          // }

          // setRequiredFields([...reqFields]);
          setMeliAttributes([...newAtts.filter(f => f.relevance == 1 && f.id != 'SELLER_SKU' && f.id != 'GTIN' && !f.tags.find(ff => ff == 'read_only')).filter(filter)]);
        },
        (err) => enqueueSnackbar(err, { variant: 'error' })
      )
    }
  }, [category]);


  useEffect(() => {
    if (
      Array.isArray(attributes)  &&
      Array.isArray(meliAttributes) && meliAttributes.length &&
      (attributes.length || meliAttributes.find(f => f.value_name))
    ) {
      meliAttributes.map(m => {
        delete m.value_name;

        let att = attributes.find(f => f.id == m.id)
        if (att) {
          m.value_name = att.value_name;
        }
      })

      setMeliAttributes([...meliAttributes])
    }
  }, [attributes])


  useEffect(() => {
    if (
      Array.isArray(meliAttributes) && 
      Array.isArray(attributes) &&
      meliAttributes.filter(f => f.value_name).find(f => !attributes.find(att => att.value_name == f.value_name)) 
    ) {

      onChange(meliAttributes.filter(f => f.value_name != undefined).map(m => {
        return {
          id: m.id,
          value_name: m.value_name
        }
      }));
    }
  }, [meliAttributes])

  return (

    <Grid container spacing={1} >
      {
        meliAttributes.map((row, index, specs) => {

          return (

            <>
              {
                specs[index - 1] && row.relevance != specs[index - 1].relevance && (
                  <Grid item xs={12}>
                    <Divider style={{ marginTop: 20 }} />
                  </Grid>
                )
              }

              <Grid item >
                <p style={{ marginBottom: 0, fontSize: 12 }}>{row.name}</p>
                {
                  row.value_type == 'boolean' && (
                    <Switch
                      id={row.id}
                      checked={row.value_name || false}
                      onChange={e => {
                        row.value_name = !row.value_name;
                        setMeliAttributes([...meliAttributes])
                      }}
                      color="primary"
                    />
                  )
                }

                {
                  row.value_type == 'list' && (

                    <Select
                      id={row.id}
                      fullWidth
                      value={row.value_name || ''}
                      onChange={e => {
                        row.value_name = String(e.target.value);
                        setMeliAttributes([...meliAttributes])
                      }}
                    >
                      {row.values.map(value => <MenuItem key={value.id} value={value.id}>{value.name}</MenuItem>)}
                    </Select>
                  )
                }
                {
                  row.value_type != 'boolean' && row.value_type != 'list' && (
                    <Input
                      id={row.id}
                      fullWidth
                      value={row.value_name || ''}
                      onChange={e => {
                        row.value_name = e.target.value;
                        setMeliAttributes([...meliAttributes])
                      }}
                    />

                  )
                }
              </Grid>

            </>

          )
        })

      }

    </Grid>

  );

}

MeliAttibutes.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default (MeliAttibutes);
