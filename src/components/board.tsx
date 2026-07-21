import Square from './square'
import '../style/board.scss'

import {create} from 'zustand'
import { combine } from 'zustand/middleware'


function calculateWinner(squares: Array<number>): number | null{
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]

    for(let i = 0; i < lines.length; i++){
        const [a, b, c] = lines[i];
        
        if(squares[a] && squares[a] == squares[b] && squares[a] == squares[c]){
            return squares[a];
        }
    }

    return null;
}

function calculateTurns(squares: Array<number>){
    return squares.filter((square: number) => !square).length;
}

function calculateStatus(winner: number | null, turns: number, player: string){
    if(!winner && !turns) return 'Draw';
    if(winner) return `Congrats, ${winner}`;
    return `Next player is ${player}`
}


const useGameStore = create(
    combine({history: [Array(9).fill(null)], currentMove: 0, xIsNext: true}, (set) =>{
        return{
            setHistory: (nextHistory: Array<string> | Function) => {
                set((state) =>({
                    history:
                        typeof nextHistory == 'function'
                        ? nextHistory(state.history)
                        : nextHistory,
                }))
            },
            setCurrentMove:(nextCurrentMove: number | Function) =>{
                set((state) => ({
                    currentMove: 
                        typeof nextCurrentMove == 'function'
                        ? nextCurrentMove(state.currentMove)
                        : nextCurrentMove,
                }))
            },
            setXNext: (nextXIsNext: boolean | Function) => {
                set((state) =>({
                    xIsNext:
                        typeof nextXIsNext == 'function'
                        ? nextXIsNext(state.xIsNext)
                        : nextXIsNext,
                }))
            }
        }
    })
)

interface IBoard{
    xIsNext: boolean
    squares: Array<any>
    onPlay: Function
}

function Board({xIsNext, squares, onPlay}: IBoard){
    const winner = calculateWinner(squares);
    const turns = calculateTurns(squares);

    const player = xIsNext ? 'X' : 'O';

    const status = calculateStatus(winner, turns, player);
    

    function handleClick(index: number){
        if(squares[index] || winner) return;
        const nextSquare = squares.slice();
        nextSquare[index] = player;
        onPlay(nextSquare)
    }

    return (
        <div>
            <div style={{
                    marginBottom: '0.5rem'
            }}>
                {status}
            </div>
            <div className="board">
                
                {squares.map((square, squareIndex) => (
                    <Square 
                        key={squareIndex} 
                        value={square} 
                        onSquareClick={() => handleClick(squareIndex)}
                    />
                ))}
            </div>
        </div>
        
    )
}

export default function Game(){
    const history: any = useGameStore((state) => state.history);
    const setHistory = useGameStore((state) => state.setHistory);

    const currentMove = useGameStore((state) => state.currentMove);
    const setCurrentMove = useGameStore((state) => state.setCurrentMove);

    const xIsNext = currentMove % 2 === 0;

    const currentSquares = history[currentMove];

    function handlePlay(nextSquares: any){
        const nextHistory = history.slice(0, currentMove + 1).concat([nextSquares]);
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove: number | Function){
        setCurrentMove(nextMove);
    }

    return(
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                fontFamily: 'monospace',
            }}
        >
            <div>
                <Board
                    xIsNext={xIsNext}
                    squares={currentSquares}
                    onPlay={handlePlay}
                />
            </div>
            <div style={{ marginLeft: '1rem' }}>
                <ol>
                    {history.map((_: never, historyIndex: number) => {
                        const description = 
                            historyIndex > 0
                            ? `Go to move #${historyIndex}`
                            : `Go to the game start`
                        
                        return (
                            <li key={historyIndex}>
                                <button onClick={() => jumpTo(historyIndex)}>
                                    {description}
                                </button>
                            </li>
                        )
                    })}
                </ol>
            </div>
        </div>
    )
}


