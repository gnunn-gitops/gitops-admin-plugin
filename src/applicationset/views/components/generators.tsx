import React from "react";
import { GitGeneratorFragment } from "./generators/GitGenerator";
import { GenericGeneratorFragment } from "./generators/GenericGenerator";

interface GeneratorsProps {
    generators: Object[]
}

export const Generators: React.FC<GeneratorsProps> = ({ generators }) => {

    return (
        <div>
            {
                generators.map((generator, i) => {
                    {
                        return (
                            <div>
                                {renderGenerator(generator)}
                                <br/>
                            </div>
                        )
                    }
                })
            }
        </div>
    );
}

function renderGenerator(generator: Object) {
    var gentype = Object.keys(generator)[0];
    switch (gentype) {
        case "git":
            return (
                <GitGeneratorFragment generator={generator}/>
            )
        default:
            return (
                <GenericGeneratorFragment gentype={gentype} generator={generator}/>
            )
    }
}

export default Generators;
