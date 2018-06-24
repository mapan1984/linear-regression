let m = tf.variable(tf.scalar(1))
let b = tf.variable(tf.scalar(0.5))

const learningRate = 0.5
const optimizer = tf.train.sgd(learningRate)


function predict(xs) {
    // y = m * x + b
    return tf.tidy(() => tf.tensor1d(xs).mul(m).add(b))
}


function loss(predictions, labels) {
    return predictions.sub(labels).square().mean()
}


/*
 * transform(200, 0, 400, 0, 1) = 0.5
 * transform(0.5, 0, 1, 0, 400) = 200
 */
function transform(num, ol=0, oh=450, dl=0, dh=1) {
    if (num == ol) {
        return dl
    }
    if (num == oh) {
        return dh
    }

    return (num - ol) / (oh - ol) * (dh - dl) + dl
}


const game = new Game()


let xs = []
let ys = []
const lineX = [0, 450]
const lineTfXData = [0, 1]
let lineY = [0, 450]


game.registerAction('click', (event) => {
    const x = event.offsetX
    const y = event.offsetY
    if (x < 0 || x > 450) {
        return
    }
    if (y < 0 || y > 450) {
        return
    }

    xs.push(transform(x))
    ys.push(transform(y))

    // game.point.call(game, event.offsetX, event.offsetY)
})


function train() {
    if (xs.length > 0) {
        const tfys = tf.tensor1d(ys)

        // optimizer.minimize(() => loss(predict(xs), tfys))
        optimizer.minimize(() => {
            const prys = predict(xs)
            return loss(prys, tfys)
            prys.dispose()
        })

        tfys.dispose()
    }

}

function update() {
    // train
    train()

    // predict lineY
    const lineTfY = predict(lineTfXData)

    const lineTfYData = lineTfY.dataSync()
    lineY = [
        transform(lineTfYData[0], 0, 1, 0, 450),
        transform(lineTfYData[1], 0, 1, 0, 450),
    ]

    lineTfY.dispose()
}

function draw() {
    game.clean()

    for (let i = 0; i < xs.length; i++) {
        game.point.call(
            game,
            transform(xs[i], 0, 1, 0, 450),
            transform(ys[i], 0, 1, 0, 450),
        )
    }

    game.line.call(game, lineX[0], lineY[0], lineX[1], lineY[1])
}

game.registerAction('t', () => {
    update()

    draw()
})

game.listen()

game.update = update

game.draw = draw

game.start()

