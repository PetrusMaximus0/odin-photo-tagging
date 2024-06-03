import waldoProfile from "../assets/waldo_space.png"
import wizzardProfile from "../assets/wizzard_space.png"
import yeldoProfile from "../assets/yeldo_space.png"

interface IPosition{
    x?: number,
    y?: number,    
}

interface IFoundCharacters {
    waldo: boolean,
    wizzard: boolean,
    yeldo: boolean,
}

export default function Circle({handleClick,  position = { x: 0, y: 0 }, foundCharacters}: {handleClick: (e: React.MouseEvent<HTMLElement>, elementName: string) => void, position: IPosition, foundCharacters: IFoundCharacters}) {
    const boxSize = 24;

    return (
        <div style={{ top: position.y! - boxSize/2, left: position.x! - boxSize/2 }} className={"marker w-6 h-6 border-2 border-purple-700 bg-opacity-40 bg-purple-900 absolute rounded-xl"}>
            <ul className="w-fit bg-slate-800 p-1 rounded relative top-6 left-1/2 -translate-x-1/2 flex justify-between gap-1">
                {!foundCharacters.waldo &&
                    <li>
                        <figure onClick={(e)=>handleClick(e, "waldo")} className="w-20 h-auto">
                            <img src={waldoProfile} alt="Waldo"/>
                        </figure>
                    </li>
                }

                {!foundCharacters.wizzard && 
                    <li>
                        <figure onClick={(e)=>handleClick(e, "wizzard")} className="w-20 h-auto">
                            <img src={wizzardProfile} alt="The Wizzard"/>
                        </figure>
                    </li>
                }
                {!foundCharacters.yeldo &&
                <li>
                    <figure onClick={(e)=>handleClick(e, "yeldo")} className="w-20 h-auto">
                        <img src={yeldoProfile} alt="Yeldo"/>
                    </figure>
                </li>


                    
                }
            </ul>        
        </div>
    )

}