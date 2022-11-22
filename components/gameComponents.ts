import { winnerResult, gameHands } from './gameSchema'

export class GameBoard {
  canvas: any
  buttons: {}
  constructor(canvas: any) {
    this.canvas = canvas
    this.buttons = {}
  }

  // Visual
  draw() {
    this.canvas.setAttribute('width', `${window.innerWidth - 200}`)
    this.canvas.setAttribute('height', '600')
    let context = this.canvas.getContext('2d')

    const paperButtonCentered = this.canvas.width / 2

    const paperButton = new Button(paperButtonCentered, 350, 'Paper', 'grey')
    const rockButton = new Button(
      paperButtonCentered - 150,
      350,
      'Rock',
      'grey'
    )
    const scissorButton = new Button(
      paperButtonCentered + 150,
      350,
      'Scissors',
      'grey'
    )
    const settingsButton = new Button(
      paperButtonCentered - 50,
      425,
      'Setting',
      'grey'
    )
    const resetButton = new Button(
      paperButtonCentered + 70,
      450,
      'Reset',
      'grey'
    )

    this.buttons = {
      Rock: rockButton,
      Paper: paperButton,
      Scissors: scissorButton,
      Setting: settingsButton,
      Reset: resetButton,
    }

    rockButton.draw(context)
    paperButton.draw(context)
    scissorButton.draw(context)
    resetButton.draw(context)
  }

  gameWinnerAnimation(
    winner: winnerResult,
    result: {
      playerHand: gameHands
      computerHand: string
    },
    reset: boolean
  ) {
    const playerWinText = new Text('You Win')
    const computerWinText = new Text('You Lose!!')
    const noWinner = new Text('Tied Game!')

    let context = this.canvas.getContext('2d')
    if (!reset) {
      this.clearCanvas()
    } else {
      this.forceReset()
    }

    if (winner === winnerResult.PLAYER) {
      playerWinText.draw(context, this.canvas.width, result)
    }

    if (winner === winnerResult.COMPUTER) {
      computerWinText.draw(context, this.canvas.width, result)
    }

    if (winner === winnerResult.TIE) {
      noWinner.draw(context, this.canvas.width, result)
    }
  }

  startGameText() {
    let context = this.canvas.getContext('2d')
    context.font = '30px Arial'
    context.fillStyle = 'white'
    context.textAlign = 'center'
    context.fillText('Rock, Paper, Scissor', this.canvas.width / 2, 150)
    context.save()
  }

  drawScore(playerScore, computerScore, tieCount, totalGames) {
    let context = this.canvas.getContext('2d')
    context.beginPath()
    context.font = '12px Arial'
    context.fillStyle = 'white'
    context.textAlign = 'center'
    context.fillText(
      `Total Games Played : ${totalGames}  Player Wins : ${playerScore}  Computer Wins : ${computerScore}  Tie Games : ${tieCount}`,
      this.canvas.width / 2,
      500
    )
  }

  clearCanvas() {
    let context = this.canvas.getContext('2d')
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.draw()
  }

  forceReset() {
    let context = this.canvas.getContext('2d')
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    const resetButton = new Button(
      this.canvas.width / 2 + 70,
      450,
      'Reset',
      'grey'
    )
    resetButton.draw(context)
  }

  continueGame(gameResult) {
    this.clearCanvas()
    const text = new Text('Choose Next Hand')
    let context = this.canvas.getContext('2d')
    text.draw(context, this.canvas.width, gameResult)
  }
}

class Button {
  xpoint: number
  ypoint: number
  text: string
  color: string
  path?: Path2D
  size: { width: number; height: number }
  constructor(xpoint: number, ypoint: number, text: string, color: string) {
    this.xpoint = xpoint
    this.ypoint = ypoint
    this.text = text
    this.color = color
    this.path = undefined
    this.size = {
      width: 100,
      height: 50,
    }
  }

  draw(context: any) {
    const newPath = new Path2D()
    this.path = newPath
    this.path.rect(
      this.xpoint - this.size.width / 2,
      this.ypoint - this.size.height / 1.75,
      this.size.width,
      this.size.height
    )
    context.font = '15px Arial'
    context.fillStyle = 'white'
    context.strokeStyle = 'red'
    context.lineWidth = 2
    context.fill(this.path)
    context.stroke(this.path)
    context.fillStyle = 'black'
    context.textAlign = 'center'
    context.fillText(this.text, this.xpoint, this.ypoint)
  }

  onClick(xMouse, yMouse) {
    const xLowRange = this.xpoint - this.size.width / 2
    const xHighRange = this.xpoint + this.size.width - 20
    const yLowRange = this.ypoint
    const yHighRange = this.ypoint + this.size.height

    const clicked =
      xMouse >= xLowRange &&
      xMouse <= xHighRange &&
      yMouse >= yLowRange &&
      yMouse <= yHighRange
      
    return clicked
  }
}

class Text {
  text: string
  path: Path2D
  constructor(text: string) {
    this.text = text
    this.path = new Path2D()
  }

  draw(
    context: any,
    canvasWidth,
    gameHands: {
      playerHand?: gameHands
      computerHand?: string
    }
  ) {
    context.fill(this.path)
    context.stroke(this.path)
    context.font = '50px Arial'
    context.fillStyle = 'white'
    context.textAlign = 'center'
    context.fillText(this.text, canvasWidth / 2, 175)
    context.font = '25px Arial'
    context.fillText(
      `COMPUTER: ${gameHands.computerHand} `,
      canvasWidth / 2,
      225
    )
    context.fillText(`vs`, canvasWidth / 2, 250)
    context.fillText(`YOU : ${gameHands.playerHand}`, canvasWidth / 2, 275)
  }
}
