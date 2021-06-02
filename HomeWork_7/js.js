"use strict";
const settings = {
    rowsCount: 21,
    colsCount: 21,
    speed: 2,
    winFoodCount: 10,
};

const config = {
    settings,

    init(userSettings) {
        Object.assign(this.settings, userSettings);
    },

    getRowsCount() {
        return this.settings.rowsCount;
    },

    getColsCount() {
        return this.settings.colsCount;
    },

    getSpeed() {
        return this.settings.speed;
    },

    getWinFoodCount() {
        return this.settings.winFoodCount;
    },

    validate() {
        const result = {
            isValid: true,
            errors: [],
        };

        if (this.getRowsCount() < 10 || this.getRowsCount() > 30) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение rowsCount должно быть в диапазоне [10, 30].');
        }

        if (this.getColsCount() < 10 || this.getColsCount() > 30) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение colsCount должно быть в диапазоне [10, 30].');
        }

        if (this.getSpeed() < 1 || this.getSpeed() > 10) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение speed должно быть в диапазоне [1, 10].');
        }

        if (this.getWinFoodCount() < 5 || this.getWinFoodCount() > 50) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение winFoodCount должно быть в диапазоне [5, 50].');
        }

        return result;
    },
};

const map = {
    cells: {},
    usedCells: [],

    init(rowsCount, colsCount) {
        const table = document.getElementById('game');
        table.innerHTML = '';

        this.cells = {};
        this.usedCells = [];

        for (let row = 0; row < rowsCount; row++) {
            const tr = document.createElement('tr');
            table.appendChild(tr);
            tr.classList.add('row');

            for (let col = 0; col < colsCount; col++) {
                const td = document.createElement('td');
                td.classList.add('cell');
                tr.appendChild(td);

                this.cells[`x${col}_y${row}`] = td;
            }
        }
    },

    render(snakePointsArray, foodPoint, obstaclesPoint) {
        for (const cell of this.usedCells) {
            cell.className = 'cell';
        }

        this.usedCells = [];

        snakePointsArray.forEach((point, idx) => {
            const snakeCell = this.cells[`x${point.x}_y${point.y}`];
            snakeCell.classList.add(idx === 0 ? 'snakeHead' : 'snakeBody');
            this.usedCells.push(snakeCell)
        });

        const foodCell = this.cells[`x${foodPoint.x}_y${foodPoint.y}`];
        foodCell.classList.add('food');
        this.usedCells.push(foodCell);

        // Отрисовка препятствия на карте
        for (const obstaclesCellElement of obstaclesPoint) {
            let obstaclesCell = this.cells[`x${obstaclesCellElement.x}_y${obstaclesCellElement.y}`];
            obstaclesCell.classList.add('obstacles');
            this.usedCells.push(obstaclesCell);
        }

    },
};

const snake = {
    body: [],
    direction: null,
    lastStepDirection: null,

    init(startBody, direction) {
        this.body = startBody;
        this.setDirection(direction);
        this.lastStepDirection = direction;
    },

    getBody() {
        return this.body;
    },

    getLastStepDirection() {
        return this.lastStepDirection;
    },

    setDirection(direction) {
        this.direction = direction;
    },
    // И этот метод больше не вызывается ни где
    // isOnPoint(point) {
    //     return this.getBody().some((snakePoint) => {
    //         return snakePoint.x === point.x && snakePoint.y === point.y;
    //     });
    // },

    makeStep() {
        this.lastStepDirection = this.direction;
        this.getBody().unshift(this.getNextStepHeadPoint());
        this.getBody().pop();
    },

    growUp() {
        const lastBodyIdx = this.getBody().length - 1;
        const lastBodyPoint = this.getBody()[lastBodyIdx];
        const lastBodyPointClone = Object.assign({}, lastBodyPoint);

        this.getBody().push(lastBodyPointClone);
    },

    getNextStepHeadPoint() {
        const firstPoint = this.getBody()[0];
        // Наверное это не совсем верно так запрашивать каждый раз статические значения но пока что не придумал как это
        // сделать по другому
        let col = settings.colsCount;
        let row = settings.rowsCount;
        // 3. Убрать границы поля. Т.е. при пересечении границы поля змейка появляется с противоположной стороны.
        // По сути мы тут проверяем границы и если за них заходим задаем нужные значения
        switch (this.direction) {
            case 'up':
                return {x: firstPoint.x, y: (firstPoint.y - 1) === -1 ? row - 1 : firstPoint.y - 1};
            case 'right':
                return {x: firstPoint.x + 1 === col ? 0 : firstPoint.x + 1, y: firstPoint.y};
            case 'down':
                return {x: firstPoint.x, y: firstPoint.y + 1 === row ? 0 : firstPoint.y + 1};
            case 'left':
                return {x: firstPoint.x - 1 === -1 ? col - 1 : firstPoint.x - 1, y: firstPoint.y};
        }
    },
};

const food = {
    x: null,
    y: null,

    getCoordinates() {
        return {
            x: this.x,
            y: this.y,
        };
    },

    setCoordinates(point) {
        this.x = point.x;
        this.y = point.y;
    },

    isOnPoint(point) {
        return this.x === point.x && this.y === point.y;
    },
};

// 2. Генерировать временные препятствия на поле.
// Тут обьект препятствие
const obstacles = {
    x: null,
    y: null,

    getCoordinates() {
        return {
            x: this.x,
            y: this.y,
        };
    },

    setCoordinates(point) {
        this.x = point.x;
        this.y = point.y;
    },

    isOnPoint(point) {
        return this.x === point.x && this.y === point.y;
    },
};
// Создал список обьектов препятствий
let obstaclesList = []

const status = {
    condition: null,

    setPlaying() {
        this.condition = 'playing';
    },

    setStopped() {
        this.condition = 'stopped';
    },

    setFinished() {
        this.condition = 'finished';
    },

    isPlaying() {
        return this.condition === 'playing';
    },

    isStopped() {
        return this.condition === 'stopped';
    },
};

const game = {
    config,
    map,
    snake,
    food,
    obstacles,
    status,
    tickInterval: null,
    obstaclesList,

    init(userSettings = {}) {
        this.config.init(userSettings);
        const validation = this.config.validate();

        if (!validation.isValid) {
            for (const err of validation.errors) {
                console.error(err);
            }
            return;
        }

        this.map.init(this.config.getRowsCount(), this.config.getColsCount());

        this.setEventHandlers();
        this.reset();
    },

    setEventHandlers() {
        document.getElementById('playButton').addEventListener('click', () => {
            this.playClickHandler();
        });
        document.getElementById('newGameButton').addEventListener('click', () => {
            this.newGameClickHandler();
        });
        document.addEventListener('keydown', (event) => this.keyDownHandler(event));
    },

    playClickHandler() {
        if (this.status.isPlaying()) {
            this.stop();
        } else if (this.status.isStopped()) {
            this.play();
        }
    },

    newGameClickHandler() {
        this.reset();
    },

    keyDownHandler(event) {
        if (!this.status.isPlaying()) return;

        const direction = this.getDirectionByCode(event.code);

        if (this.canSetDirection(direction)) this.snake.setDirection(direction);
    },

    getDirectionByCode(code) {
        switch (code) {
            case 'KeyW':
            case 'ArrowUp':
                return 'up';
            case 'KeyD':
            case 'ArrowRight':
                return 'right';
            case 'KeyS':
            case 'ArrowDown':
                return 'down';
            case 'KeyA':
            case 'ArrowLeft':
                return 'left';
        }
    },

    canSetDirection(direction) {
        const lastStepDirection = this.snake.getLastStepDirection();

        return direction === 'up' && lastStepDirection !== 'down' ||
            direction === 'right' && lastStepDirection !== 'left' ||
            direction === 'down' && lastStepDirection !== 'up' ||
            direction === 'left' && lastStepDirection !== 'right';
    },

    reset() {
        // В ресете обнуляем список препятствий
        this.obstaclesList = []
        this.stop();
        this.snake.init(this.getStartSnakeBody(), 'up');
        this.food.setCoordinates(this.getRandomFreeCoordinates());
        // Переопределяем координаты
        this.obstacles.setCoordinates(this.getRandomFreeCoordinates());
        this.obstaclesList.push({...this.obstacles})
        this.render();
        this.renderScore();
    },

    render() {
        this.map.render(this.snake.getBody(), this.food.getCoordinates(), this.obstaclesList);
    },

    getStartSnakeBody() {
        return [
            {
                x: Math.floor(this.config.getColsCount() / 2),
                y: Math.floor(this.config.getRowsCount() / 2),
            }
        ];
    },

    getRandomFreeCoordinates() {
        const exclude = [this.food.getCoordinates(), ...this.snake.getBody(), this.obstacles];

        while (true) {
            const rndPoint = {
                x: Math.floor(Math.random() * this.config.getColsCount()),
                y: Math.floor(Math.random() * this.config.getRowsCount()),
            }

            if (!exclude.some((exPoint) => {
                return rndPoint.x === exPoint.x && rndPoint.y === exPoint.y;
            })) {
                return rndPoint;
            }
        }
    },

    play() {
        this.status.setPlaying();
        this.tickInterval = setInterval(() => {
            this.tickHandler();
        }, 1000 / this.config.getSpeed());
        this.setPlayButton('Стоп');
    },

    tickHandler() {
        // После 3 задания эту проверку можно удалить как и сам метод
        // if (!this.canSnakeMakeStep()) this.finish();
        if (this.food.isOnPoint(this.snake.getNextStepHeadPoint())) {
            this.snake.growUp();
            // Обновление очков после еды
            this.renderScore();
            // Переопределение новых координат препятствия
            this.obstaclesGen();
            this.food.setCoordinates(this.getRandomFreeCoordinates());
            if (this.isGameWon()) return this.finish();
        }
        // Обработка столкнавения с препятствием и завершение игры
        for (const argument of this.obstaclesList) {
            if (argument.isOnPoint(this.snake.getNextStepHeadPoint())) {
                this.finish()
            }
        }

        this.snake.makeStep();
        this.render();
    },
    // Генерируем препятствия в зависимости от очков
    obstaclesGen() {
        this.obstaclesList = []
        for (let i = 0; i < Math.trunc(this.snake.getBody().length / 2); i++) {
            this.obstacles.setCoordinates(this.getRandomFreeCoordinates())
            this.obstaclesList.push({...this.obstacles})
        }
    },

    isGameWon() {
        return this.snake.getBody().length > this.config.getWinFoodCount();
    },
    //  Этот метод можно удалить так как он после 3 задания не нужен
    // canSnakeMakeStep() {
    //     const nextHeadPoint = this.snake.getNextStepHeadPoint();
    //     return !this.snake.isOnPoint(nextHeadPoint) &&
    //         nextHeadPoint.x < this.config.getColsCount() &&
    //         nextHeadPoint.y < this.config.getRowsCount() &&
    //         nextHeadPoint.x > 0 &&
    //         nextHeadPoint.y> 0;
    // },

    stop() {
        this.status.setStopped();
        clearInterval(this.tickInterval);
        this.setPlayButton('Старт');
    },

    finish() {
        this.status.setFinished();
        clearInterval(this.tickInterval);
        this.setPlayButton('Игра закончена', true);
    },

    setPlayButton(text, isDisabled = false) {
        const playButton = document.getElementById('playButton');

        playButton.textContent = text;

        isDisabled
            ? playButton.classList.add('disabled')
            : playButton.classList.remove('disabled');
    },

    // 1. Выводить счёт в режиме реального времени.
    // Отрисовка счетчика
    renderScore() {
        let scoreNode = document.querySelector('.score');
        scoreNode.textContent = `Счет: ${this.snake.getBody().length - 1}`;
    },

};
// Пытался все сделать аккуратно но чтото это все не так красиво вяглядит как хотелось бы
game.init();
