import React from "react";
import { GitGeneratorFragment } from "./generators/GitGenerator";
import { GenericGeneratorFragment } from "./generators/GenericGenerator";
import { AppSetGenerator } from "src/applicationset/model/ApplicationSetModel";

interface GeneratorsProps {
    generators: AppSetGenerator[]
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

function renderGenerator(generator: AppSetGenerator) {
    var gentype = Object.keys(generator)[0];
    switch (gentype) {
        case "git":
            return (
                <GitGeneratorFragment generator={generator.git}/>
            )
        default:
            return (
                <GenericGeneratorFragment gentype={gentype} generator={generator}/>
            )
    }
}

export default Generators;
