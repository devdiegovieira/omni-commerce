/// <reference types="Cypress" />

const btnPageProducts = '[class*="MuiButtonBase-root"]'
// const inputSKU = 'input[name*="sku"]'
// const inputTitle = 'input[name*="title"]'
// const openselectSeller = 'input[name*="sellerId"]'
// const selectSeller = 'li[class*="MuiButtonBase-root"]'
// const inputPrice = '[name*="price"]'
// const inputStock = '[name*="stock"]'
// const inputCategory = 'input[name*="categoryId"]'
// const inputAttribute = 'input[name*="attId"]'
// const inputAttValue = 'input[name*="attValue"]'
// const inputSkuVar = '[name*="sku_0"]'
// const inputStockVar = '[name*="stock_0"]'
// const inputPriceVar = '[name*="price_0"]'
// const inputCest = '[name*="cest"]'
// const inputNcm = '[name*="ncm"]'
// const inputHeight = '[name*="height"]'
// const inputWidth = '[name*="width"]'
// const inputLength = '[name*="length"]'
// const inputWeight = '[name*="weight"]'
// const btnActivateProduct = '[class*="PrivateSwitchBase-input"]'
// const msgConfirmSave = '[id*="notistack-snackbar"]'
// const btnBackProductsPage= '[title*="Produtos"]'
// const selectCheckBox= '[class*="MUIDataTableBodyCell"]'
// const slctButtonGroup= '[class*="MuiButtonGroup-root"]'
// const slctButtonProducts= ''



const fixtureFileProducts = 'ImagemTest.jpg'
const inputEANCode= '[id="findBarCode"]'
const inputTittle= '[id="title"]'
const slctSeller= '[id="seller"]'
const listSeller= '[role="listbox"]'
const inputDescription= '[id="description"]'
const inputBrand= '[id="BRAND"]'
const inputBarCode= '[id="barCode"]'
const inputSKU= '[id="sku"]'
const inputPriceProducts= '[id="price"]'
const inputStockProducts= '[id="stock"]'
const inputCest= '[id="cest"]'
const inputNCM= '[id="ncm"]'
const inputHeigth= '[id="heigth"]'
const inputWidth= '[id="width"]'
const inputDepth= '[id="depth"]'
const inputWeigth= '[id="weigth"]'


export function typeCEST(cest){
    cy.get(inputCest).type(cest)
}

export function typeNCM(ncm){
    cy.get(inputNCM).type(ncm)
}

export function typeHeigth(height){
    cy.get(inputHeigth).type(height)
}

export function typeWidth(width){
    cy.get(inputWidth).type(width)
}

export function typeDepth(depth){
    cy.get(inputDepth).type(depth)
}

export function typeWeigth(weigth){
    cy.get(inputWeigth).type(weigth)
}

export function typeBrand(brand){
    cy.get(inputBrand).type(brand)
}

export function typeBarCode(barCode){
    cy.get(inputBarCode).type(barCode)
}

export function typeSKU(sku){
    cy.get(inputSKU).type(sku)
}

export function typePriceProduct(price){
    cy.get(inputPriceProducts).type(price)
}

export function typeStockProduct(stock){
    cy.get(inputStockProducts).type(stock)
}

export function slctCategory(){
    cy.get(btnPageProducts).children().children().contains('Acessórios para Veículos').click() &&
    cy.wait(1000) &&
    cy.get(btnPageProducts).children().children().contains('Aces. de Carros e Caminhonetes').click() &&
    cy.wait(1000) &&
    cy.get(btnPageProducts).children().children().contains('Exterior').click() &&
    cy.wait(1000) &&
    cy.get(btnPageProducts).children().children().contains('Acabamentos para Racks').click() &&
    cy.wait(1000) &&
    cy.get(btnPageProducts).children().children().contains('Acabamentos para Racks').click() 

}

export function typeDescription(description){
    cy.get(inputDescription).type(description)
}

export function slctSellerProducts(){
    cy.get(slctSeller).click() &&
    cy.get(listSeller).children().contains('Twenty').click()
}

export function typeTittleProducts(tittle){
    cy.get(inputTittle).type(tittle)
}

export function typeEANCode(code){
    cy.get(inputEANCode).type(code)
}

export function clickAddVariation(){
    cy.get(btnPageProducts).children().contains('Adicionar Variação').click()
}

export function clickNewProducts(){
    cy.get(btnPageProducts).contains('Novo Produto').click()
}

export function getUploadFileProducts(){
    cy.get('[type*="file"]').attachFile(fixtureFileProducts)
    &&  cy.get('[type*="file"]').attachFile(fixtureFileProducts)
  }

export function clickSaveProduct(){
    cy.get(btnPageProducts).contains('Salvar Rascunho').click()
}

export function clickPublishProduct(){
    cy.get(btnPageProducts).contains('Publicar').click()
}

//TELA PRODUTOS NOVA

// export function btnButtonGroup(){
//     cy.get(slctButtonGroup).children().contains('Atualizar').parent().siblings().click()
// }


// export function typeSku(skuCode){
// cy.get(inputSKU).type(skuCode)
// }

// export function typeTittle(titleProduct){
//     cy.get(inputTitle).type(titleProduct)
// }

// export function clickOpenSelectSeller(){
// cy.get(openselectSeller).parent().click();
// }

// export function clickSelectSeller(){
//     cy.get(selectSeller).contains('Empresa1').click()
// }

// export function clickSelectSeller2(){
//     cy.get(selectSeller).contains('Empresa2').click()
// }

// export function typePrice(productPrice){
//     cy.get(inputPrice).type(productPrice)
// }

// export function typeStock(productStock){
//     cy.get(inputStock).type(productStock)
// }

// export function typeCategory(productCategory){
//     cy.get(inputCategory).type(productCategory)
// }

// export function clickAddAttribute(){
//     cy.get(btnPageProducts).contains('Adicionar Atributo').click()
// }

// export function typeAttribute(attId){
//     cy.get(inputAttribute).type(attId)
// }

// export function typeAttValue(attValue){
//     cy.get(inputAttValue).type(attValue, {force: true})
// }

// export function clickConfirmAtt(){
//     cy.get(btnPageProducts).contains('Confirmar').click()
// }

// export function typeSkuVar(skuVar){
//     cy.get(inputSkuVar).type(skuVar)
// }

// export function typeStockVar(stockVar){
//     cy.get(inputStockVar).type(stockVar)
// }

// export function typePriceVar(priceVar){
//     cy.get(inputPriceVar).type(priceVar)
// }

// export function clickTaxData(){
//     cy.get(btnPageProducts).contains('Fiscal').click()
// }

// export function typeCest(cest){
//     cy.get(inputCest).type(cest)
// }

// export function typeNcm(ncm){
//     cy.get(inputNcm).type(ncm)
// }

// export function clickDimensions(){
//     cy.get(btnPageProducts).contains('Dimensões').click()
// }

// export function typeHeight(height){
//     cy.get(inputHeight).type(height)
// }

// export function typeWidth(width){
//     cy.get(inputWidth).type(width)
// }

// export function typeLength(length){
//     cy.get(inputLength).type(length)
// }

// export function typeWeight(weight){
//     cy.get(inputWeight).type(weight)
// }

// export function clickActivateProduct(){
//     cy.get(btnActivateProduct).click()
// }


// export function getMsgConfirmSave(){
//     return cy.get(msgConfirmSave).invoke('text')
// }

// export function clickBackProductsPage(){
//     cy.get(btnBackProductsPage).click()
// }

// export function clickCheckBoxProd01(){
//     cy.get(selectCheckBox).contains('PROD001').parent().parent().parent().find('[type*="checkbox"]').click()
// }

// export function clickCheckBoxProd02(){
//     cy.get(selectCheckBox).contains('PROD002').parent().parent().parent().find('[type*="checkbox"]').click()
// }

// export function clickGenerateAd(){
//     cy.get(btnPageProducts).contains('Gerar Anúncio').click()
// }

