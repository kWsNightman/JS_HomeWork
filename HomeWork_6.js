"use strict";
/*
1. Доработать модуль корзины.
a. Добавлять в объект корзины выбранные товары по клику на кнопке «Купить» без перезагрузки страницы
b. Привязать к событию покупки товара пересчет корзины и обновление ее внешнего вида
* */

let cartDiv = {
    renderItems(a) {
        return `<div class="cartItem" data-id ="${a.id}">
                            <div class="cartName"><b>Товар</b>: ${a.name}</div>
                            <div class="cartCost"><b>Цена за штуку</b>: ${a.cost}</div>
                            <div class="numItem"><b>Штук</b>: ${a.countProd}</div>
                            </div>
`
    },
    renderTotal(a) {
        return `<div class="allItem"><b>Общее количество товаров</b>: 
                        ${a.countItems()}<br>
                        <b>На цену</b>: ${a.countBasketPrice()}</div>
                        <button class="buyItems" onclick="shoppingBasket.delAll()">Купить товары</button>`
    }

}

let catalogDiv = {
    render(i) {
        return `<div class="items" data-id="${i.id}">
                    <div class="name"><b>Товар</b>: ${i.name}</div>
                    <div class="price"><b>Цена</b>: ${i.cost}</div>
                    <button class="addButt">Добавить в корзину</button>
                </div> `
    }
}

let products = {

    gods: [
        {
            id: 1,
            name: 'Мышка',
            cost: 1000,
            countProd: 1

        },
        {
            id: 13,
            name: 'Монитор',
            cost: 4000,
            countProd: 1
        }, {
            id: 14,
            name: 'Клавиатура',
            cost: 3500,
            countProd: 1

        },
        {
            id: 12,
            name: 'Коврик',
            cost: 500,
            countProd: 1
        }, {
            id: 1554,
            name: 'Геймпад',
            cost: 6000,
            countProd: 1

        },
        {
            id: 112,
            name: 'Колонки',
            cost: 15000,
            countProd: 1
        },
    ],

    findObj(id) {
        for (let i of this.gods) {
            if (i.id === id) {
                return i
            }
        }
        return null
    },

    catalogRender() {
        let result = ''
        for (let i of this.gods) {
            result += catalogDiv.render(i)
        }
        return result
    },

    init() {
        let catalogObj = document.getElementById('catalog');
        catalogObj.innerHTML = this.catalogRender()
        document.getElementById('catalog').addEventListener('click', (event) => {
            if (event.target.tagName === 'BUTTON') {
                let idElem = event.target.parentNode.dataset.id
                shoppingBasket.addBasket({...this.findObj(+idElem)})
            }
        })
        console.log(this.findObj(112))
    },

}

products.init()

let shoppingBasket = {
    product: [
        {
            id: 1,
            name: 'Мышка',
            cost: 1000,
            countProd: 1

        },
        {
            id: 13,
            name: 'Монитор',
            cost: 4000,
            countProd: 1
        },
    ],

    addBasket(a) {
        if (this.indObj(+a.id)) {
            let b = this.findObj(a.id)
            b.countProd = b.countProd + 1
        } else {
            this.product.push(a)
        }
        this.render()
    },

    findObj(id) {
        for (const idElement of this.product) {
            if (idElement.id === id) {
                return idElement
            }
        }
        return null
    },

    indObj(id) {
        for (const idElement of this.product) {
            if (idElement.id === id) {
                return true
            }
        }
        return false
    },

    countBasketPrice() {
        let result = 0
        for (const argument of this.product) {
            result += argument.cost * argument.countProd
        }
        return result
    },

    countItems() {
        let result = 0
        for (const argument of this.product) {
            result += argument.countProd
        }
        return result
    },

    delAll() {
        this.product = []
        alert('Товары успешно оформлены')
        this.render()
    },

    render() {
        const basket = document.querySelector(`.cart`)
        let result = ''
        if (this.product.length > 0) {
            for (const aElement of this.product) {
                result += cartDiv.renderItems(aElement)
            }
            result += cartDiv.renderTotal(this)
            basket.innerHTML = result
        } else {
            basket.textContent = 'Корзина пуста!'
        }
    },

}

shoppingBasket.render();