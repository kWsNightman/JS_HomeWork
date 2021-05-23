/*1.
Создать функцию, генерирующую шахматную доску.
При этом можно использовать любые html-теги по своему желанию.
Доска должна быть разлинована соответствующим образом, т.е. чередовать черные и белые ячейки.
Строки должны нумероваться числами от 1 до 8, столбцы – латинскими буквами A, B, C, D, E, F, G, H.
*/
"use strict";


function chessBoard() {
    const table = document.createElement("table");
    const literal = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    for (let i = 0; i < 9; i++) {
        let tr = document.createElement(`tr`);
        for (let j = 0; j < 9; j++) {
            let td = document.createElement(`td`);
            if (i === 0 && j !== 0) {
                td.innerText = literal[j - 1];
                td.style.border = 0;
            } else if (j === 0) {
                td.style.border = 0;
                if (i === 0 && j === 0) {
                    td.style.backgroundColor = "white"
                } else {
                    td.innerText = i;
                }
            } else if (i % 2 === j % 2) {
                td.style.backgroundColor = "black";
            } else {
                td.style.backgroundColor = "white";
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    onceButton.insertAdjacentElement("afterend", table);
}

let onceButton = document.getElementById('chess')
onceButton.addEventListener("click", chessBoard, {once: true})

/*
2. Сделать генерацию корзины динамической: верстка корзины не должна находиться в HTML-структуре.
Там должен быть только div, в который будет вставляться корзина, сгенерированная на базе JS:
    2.1. Пустая корзина должна выводить строку «Корзина пуста»;
    2.2. Наполненная должна выводить «В корзине: n товаров на сумму m рублей».
*/

let shoppingBasket = {
    product: [
        {
            name: 'Товар_1',
            cost: 1000,
            countProd: 3
        },
        {
            name: 'Товар_2',
            cost: 4000,
            countProd: 1
        }
    ],

    addBasket() {
        let args = Array.from(arguments);
        for (const argsKey in args) {
            this.product.push(args[argsKey])
        }
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
    this.render()
    },

    render() {
    const basket = document.getElementById('basket')
    const a = document.createElement("div")
    if (shoppingBasket.product.length > 0) {
        basket.textContent = `В корзине ${shoppingBasket.countItems()} 
        товаров на цену ${shoppingBasket.countBasketPrice()}`
    } else {

        basket.textContent = 'Корзина пуста!'
        basket.appendChild(a)
    }
    },

}

shoppingBasket.render();

/*
3*. Сделать так, чтобы товары в каталоге выводились при помощи JS:
3.1. Создать массив товаров (сущность Product);
3.2. При загрузке страницы на базе данного массива генерировать вывод из него.
HTML-код должен содержать только div id=”catalog” без вложенного кода. Весь вид каталога генерируется JS.
*/
let products = {
    gods:[
        {
        name: 'Товар_1',
        cost: 1000,
        countProd: 3
        },
        {
        name: 'Товар_2',
        cost: 4000,
        countProd: 1
        }
    ],

    catalogRender() {
    let result = ''
    for (let i of this.gods) {
        result = result + `<div>Товар ${i.name}<br> Цена ${i.cost}<br><br></div>`
    }
    return result
    },

    init(){
        let catalogObj = document.getElementById('catalog');
        catalogObj.innerHTML = this.catalogRender()
    },
}

products.init()



