import '../style/square.scss'


interface Sqr{
    value: string
    onSquareClick?: () => void
}

export default function Square({value, onSquareClick}: Sqr){
    return(
        <button
            className='square'
            onClick={onSquareClick}
        >
            {value}
        </button>
    )
}