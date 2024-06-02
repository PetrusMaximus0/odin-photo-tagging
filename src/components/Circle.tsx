interface IPosition{
    position?: {
        x: number,
        y: number,
    }
}

export default function Circle({position = {x:0, y:0}}: IPosition) {
        return (
        <div style={{ top: position.y - 16, left: position.x - 16 }} className="border-2 border-purple-700 bg-opacity-40 bg-purple-900 w-8 h-8 absolute rounded-xl">

        </div>
    )

}