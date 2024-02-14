import React from "react";
import { GitGeneratorFragment } from "./generators/GitGenerator";
import { GenericGeneratorFragment } from "./generators/GenericGenerator";
import { AppSetGenerator } from "src/applicationset/model/ApplicationSetModel";
import { ListGeneratorFragment } from "./generators/ListGenerator";
import { MatrixGeneratorFragment } from "./generators/MatrixGenerator";
import { UnionGeneratorFragment } from "./generators/UnionGenerator";
import { MergeGeneratorFragment } from "./generators/MergeGenerator";

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
        case "list":
            return (
                <ListGeneratorFragment generator={generator.list}/>
            )
        case "merge":
            return (
                <MergeGeneratorFragment generator={generator.merge}/>
            )
        case "matrix":
            return (
                <MatrixGeneratorFragment generator={generator.matrix}/>
            )
        // I think union is a 2,10 thing so cannot test it yet
        case "union":
            return (
                <UnionGeneratorFragment generator={generator.matrix}/>
        )
        default:
            return (
                <GenericGeneratorFragment gentype={gentype} generator={generator}/>
            )
    }
}

export default Generators;
