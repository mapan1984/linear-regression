class Game {
    constructor() {
        this.fps = 10
        this.runing = false
        this.actions = {}
        this.width = 450
        this.height = 450

        this.map = document.querySelector('#map')
        this.context = this.map.getContext('2d')
    }

    point(x, y) {
        this.context.beginPath()
        this.context.arc(x, y, 3, 0, 2*Math.PI)
        this.context.closePath()
        this.context.fillStyle = '#ffffff'
        this.context.fill()
    }

    line(x1, y1, x2, y2) {
        this.context.beginPath()
        this.context.moveTo(x1, y1)
        this.context.lineTo(x2, y2)
        this.context.closePath()
        this.context.strokeStyle = '#ffffff'
        this.context.stroke()
    }

    // 注册按键key与之触发的事件action
    registerAction(key, action) {
        if (key === 'click') {
            this.actions[key] = action
        }
        this.actions[key] = action
    }

    // 开始监听按键，并处理与之对应的事件
    listen() {
        window.addEventListener('keydown', (event) => {
            let key = event.key
            let action = this.actions[event.key]
            action && action()
        })

        const clickAction = this.actions['click']
        if (clickAction) {
            window.addEventListener('click', clickAction)
        }
    }

    clean() {
        this.context.clearRect(0, 0, this.width, this.height)
    }

    update() {
    }

    draw() {
    }

    start() {
        if (!this.runing) {
            this.runing = true
            this.interval = setInterval(() => {
                try {
                    this.update()
                    this.draw()
                } catch(e) { // 死亡
                    clearInterval(this.interval)
                    this.runing = false
                }
            }, 1000/this.fps)
        }
    }
}
