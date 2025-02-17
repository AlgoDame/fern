import * as FernRegistryApiRead from "@fern-fern/registry-browser/api/resources/api/resources/v1/resources/read";
import { useApiDefinitionContext } from "../../api-context/useApiDefinitionContext";
import { ApiPackageContents } from "../ApiPackageContents";
import { Markdown } from "../markdown/Markdown";
import { ApiPageMargins } from "../page-margins/ApiPageMargins";
import { useApiPageCenterElement } from "../useApiPageCenterElement";
import { SubpackageTitle } from "./SubpackageTitle";

export declare namespace ApiSubpackage {
    export interface Props {
        subpackageId: FernRegistryApiRead.SubpackageId;
        slug: string;
    }
}

export const ApiSubpackage: React.FC<ApiSubpackage.Props> = ({ subpackageId, slug }) => {
    const { resolveSubpackageById } = useApiDefinitionContext();

    const subpackage = resolveSubpackageById(subpackageId);

    const { setTargetRef } = useApiPageCenterElement({ slug });

    return (
        <>
            <ApiPageMargins>
                <div ref={setTargetRef} className="pt-20 text-4xl font-bold">
                    <SubpackageTitle subpackage={subpackage} />
                </div>
                {subpackage.description != null && (
                    <div className="flex space-x-[5vw] pt-10">
                        <Markdown className="flex-1">{subpackage.description}</Markdown>
                        <div className="hidden flex-1 md:flex" />
                    </div>
                )}
            </ApiPageMargins>
            <ApiPackageContents key={subpackageId} package={subpackage} slug={slug} />
        </>
    );
};
