import { RefObject, useEffect, useRef } from "react"

const useGameLoop = (canvasRef: RefObject<HTMLCanvasElement>) => {
    let canvasContext: CanvasRenderingContext2D | null;
    let zero  = new Image();
    let one   = new Image();
    let two   = new Image();
    let three = new Image();
    let four  = new Image();
    let five  = new Image();
    let six   = new Image();
    let seven = new Image();
    let eight = new Image();
    let nine  = new Image();
    let los: Array<any>  = [];//list of score img
    
    zero.src  = '/assets/sprites/0.png';
    one.src   = '/assets/sprites/1.png';
    two.src   = '/assets/sprites/2.png';
    three.src = '/assets/sprites/3.png';
    four.src  = '/assets/sprites/4.png';
    five.src  = '/assets/sprites/5.png';
    six.src   = '/assets/sprites/6.png';
    seven.src = '/assets/sprites/7.png';
    eight.src = '/assets/sprites/8.png';
    nine.src  = '/assets/sprites/9.png';

    let background = new Image();
    let base       = new Image();
    let blueBird   = new Image();
    let redBird    = new Image();
    let yellowBird = new Image();
    let gameover   = new Image();
    let message    = new Image();
    let pipe       = new Image();
    let pipeR      = new Image();
    
    background.src = '/assets/sprites/background-day.png';
    base.src       = '/assets/sprites/base.png';
    blueBird.src   = '/assets/sprites/bluebird-midflap.png';
    redBird.src    = '/assets/sprites/redbird-midflap.png';
    yellowBird.src = '/assets/sprites/yellowbird-midflap.png';
    gameover.src   = '/assets/sprites/gameover.png';
    message.src    = '/assets/sprites/message.png';
    pipe.src       = '/assets/sprites/pipe-green.png';
    pipeR.src      = '/assets/sprites/pipe-green-reverse.png';
    
    let birdX: number, birdY: number, birdAngle, jumpSpeed: number, freeFallSpeed: number;
    let gravity: number, pipeSpeed: number, pipeGapX: number, pipeGapY: number, pipeWidth: number, pipeHeight: number, difficulty: number;
    let listOfPipe: Array<any> = [];
    let TO_RADIANS = Math.PI/180;
    let randomFactor = 120;
    let gameState: string;//died, in game, menu
    let score: number, scoreActive: boolean;
    const drawScore = () => {
        let s = score;
        los = [];
        while(s != 0){
            var i = s%10;
            s = (s-i)/10;
            switch(i){
                case 1:
                los = [...los, one];
                break;
                case 2:
                los = [...los, two];
                break;
                case 3:
                los = [...los, three];
                break;
                case 4:
                los = [...los, four];
                break;
                case 5:
                los = [...los, five];
                break;
                case 6:
                los = [...los, six];
                break;
                case 7:
                los = [...los, seven];
                break;
                case 8:
                los = [...los, eight];
                break;
                case 9:
                los = [...los, nine];
                break;
                case 0:
                los = [...los, zero];
                break;
            }
        }
        for(var j = 0; j < los.length; j++){
            canvasContext?.drawImage(los[j], canvasRef.current!.width - (j+1)*los[j].width - 5, 5);
        }
    };

    const drawAll = () => {
        canvasContext?.drawImage(background, 0, 0);
        
        if(gameState == 'menu'){
            canvasContext?.drawImage(message, canvasRef.current!.width/2 - message.width/2, canvasRef.current!.height/2 - message.height/2);
            return;
        }
        if(gameState == 'died'){
            canvasContext?.drawImage(gameover, canvasRef.current!.width/2 - gameover.width/2, canvasRef.current!.height/2 - gameover.height/2);
            return;
        }
        for (let aPipe of listOfPipe){
            canvasContext?.drawImage(pipeR, aPipe.pipeX, aPipe.pipeY);
            canvasContext?.drawImage(pipe, aPipe.pipeX, aPipe.pipeY + pipeHeight + pipeGapY);
            
        }
        canvasContext?.drawImage(blueBird, birdX, birdY);
        drawScore();
    }

    const moveAll = () => {
        if(gameState == 'menu' || gameState == 'died'){
            return;
        }
        if(checkCollision()){
            gameState = 'died';
            return;
        }
        addPipe();
        for (var i = 0; i < listOfPipe.length; i++){

            if(listOfPipe[i].pipeX + pipeWidth < 0){
                listOfPipe = listOfPipe.slice(1, listOfPipe.length-1);
            }
        }
        for (var i = 0; i < listOfPipe.length; i++){
            listOfPipe[i].pipeX -= pipeSpeed;
        }
        birdY += freeFallSpeed;
        birdY -= jumpSpeed;
        freeFallSpeed += gravity;
        if(jumpSpeed > 0){
            jumpSpeed -= 10;
        } 
    }

    const reset = () => {
        jumpSpeed  = 0;
        freeFallSpeed = 0;
        birdX      = canvasRef.current!.width/2 - 17;
        birdY      = canvasRef.current!.height/2 + 37;
        listOfPipe = [];
        score = 0;
        scoreActive = false;
    }
    
    const checkCollision = () => {
        console.log(score);
        var die = false;
        if(birdY > canvasRef.current!.height){
            return true;
        }
        for(let aPipe of listOfPipe){
            var upper = pipeHeight + aPipe.pipeY;
            var lower = upper + pipeGapY;
            var left = aPipe.pipeX;
            var right = left + pipeWidth;
            if(birdX > left && birdX < right && birdY < lower && birdY > upper){
                scoreActive = true;
            }
            else if(scoreActive && birdX >= right){
                scoreActive = false;
                score ++;
            }
            if(birdX + blueBird.width/2 < right && birdX + blueBird.width/2 > left && (birdY + blueBird.height/2 < upper || birdY + blueBird.height/2 > lower)){
                return true;
            }
        }
        return false;
    }

    const addPipe = () => {

        if (listOfPipe.length == 0){
            let aPipe = {
                pipeX: canvasRef.current!.width,
                pipeY: -pipeHeight/2 + Math.random()*randomFactor
            }
            listOfPipe.push(aPipe);
        }
        if (listOfPipe.length < 5){
            let lastPipe = listOfPipe[listOfPipe.length-1];
            let newPipe  = {
                pipeX: lastPipe.pipeX + pipeWidth + pipeGapX,
                pipeY: -pipeHeight/2 + Math.random()*randomFactor
            }
            listOfPipe = [...listOfPipe, newPipe];
        }
    }
    useEffect(() => {
        if (!!canvasRef.current) {
            canvasContext = canvasRef.current.getContext('2d');
            canvasContext!.fillStyle = 'black';
            canvasContext!.fillRect(0,0,800, 600);
            let FPS    = 30;
            pipeSpeed  = 2;
            pipeGapX   = 130;
            pipeGapY   = 100;
            pipeWidth  = 50;
            pipeHeight = 320;
            gravity    = 0.5;
            jumpSpeed  = 0;
            freeFallSpeed = 0;
            difficulty = 0;
            score = 0;
            los = [...los, zero];
            scoreActive = false;
            birdX      = canvasRef.current.width/2 - 17;
            birdY      = canvasRef.current.height/2 + 37;
            gameState = 'menu';
            canvasRef.current.addEventListener(
                'click', 
                function(){
                    if(gameState == 'menu'){
                        gameState = 'in_game';
                    }else if(gameState == 'died'){
                        gameState = 'menu';
                        reset();
                        return;
                    }
                    jumpSpeed = 30;
                    freeFallSpeed = 0;
            });
            setInterval(function(){moveAll();drawAll();}, 1000/FPS);
        }
    }, []);
}

export const FlappyBird = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useGameLoop(canvasRef);
    return (
        <canvas ref={canvasRef} width="288" height="512"/>
    )
}