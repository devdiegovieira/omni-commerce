import { Grid, List, ListItem, ListItemText } from "@material-ui/core"
import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useSnackbar } from 'notistack';


function MeliCategories(props) {
  let { category, onSetCategory, dislabled } = props

  const [categories, setCategories] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const getSubCategoriesMeli = (mlb, calbackSuccess) => {
    Axios
      .get(`https://api.mercadolibre.com/categories/${mlb}`)
      .then((response) => {
        calbackSuccess(response.data);
      })
      .catch((err) => enqueueSnackbar(err, { variant: 'error' }))
  }



  useEffect(() => {

    if (!category) {

      Axios
        .get('https://api.mercadolibre.com/sites/MLB/categories')
        .then((response) => {
          let cat = [{ level: 0, items: response.data }];
          setCategories(cat);
        })
        .catch((err) => {
           enqueueSnackbar(err, { variant: 'error' })
        });

    }

    if (category) {
      Axios
        .get('https://api.mercadolibre.com/sites/MLB/categories')
        .then((response) => {
          let cat = [{ level: 0, items: response.data }];

          getSubCategoriesMeli(category, (baseCat) => {

            baseCat.path_from_root.map((m, i) => {
              setTimeout(() => {
                getSubCategoriesMeli(m.id, (newCat) => {
                  if (newCat.children_categories.length) {
                    cat.push({
                      level: i + 1,
                      items: newCat.children_categories
                    })
                  }

                  cat.find(f => f.level == i).items.map(mm => {
                    mm.selected = mm.id == m.id
                  })


                  if (i == baseCat.path_from_root.length - 1) {
                    setCategories(cat);
                  }
                })
              }, i * 300);

            })

          })
        })
        .catch((err) => {
          enqueueSnackbar(err, { variant: 'error' })
        });
    }

  }, [category])

  const handleSearch = (mlb, itemLevel) => {
    getSubCategoriesMeli(mlb, (data) => {

      let newCats = categories.filter(f => f.level <= itemLevel);

      newCats.find(f => f.level == itemLevel).items.map(m => {
        m.selected = m.id == mlb;
      })

      if (data.children_categories.length > 0)
        newCats.push({
          level: itemLevel + 1,
          items: data.children_categories
        })

      setCategories([...newCats]);
      onSetCategory(mlb);
    })
  }



  return (
    <Grid container >

      <Grid item xs={12} style={{ paddingBottom: 15 }}>
        {categories.map(m => {
          if (m.items.find(f => f.selected)) return m.items.find(f => f.selected).name
        }).join(' > ')}
      </Grid>

      <Grid
        container
        spacing={1}
        style={{
          display: "flex",
          flexWrap: "nowrap",
          overflowX: "scroll",
        }}
        gutter={24}
      >
        {
          categories.map(m => {
            return (
              <Grid item >
                <List
                  style={{
                    overflow: 'auto',
                    maxHeight: 200,
                  }}
                >
                  {
                    m.items.map(item => {
                      return (
                        <ListItem
                          disabled={dislabled && dislabled != 'pending'}
                          button
                          key={item.id}
                          selected={item.selected}
                          onClick={() => { handleSearch(item.id, m.level) }}
                        >
                          <ListItemText
                            primary={item.name}
                          />
                        </ListItem>
                      )
                    })
                  }
                </List>
              </Grid>
            )
          })
        }
      </Grid>
    </Grid>

  )
}


export default MeliCategories;