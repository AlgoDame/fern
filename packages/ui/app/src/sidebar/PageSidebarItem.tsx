import * as FernRegistryDocsRead from "@fern-fern/registry-browser/api/resources/docs/resources/v1/resources/read";
import { NavigatingSidebarItem } from "./NavigatingSidebarItem";

export declare namespace PageSidebarItem {
    export interface Props {
        slug: string;
        pageMetadata: FernRegistryDocsRead.PageMetadata;
    }
}

export const PageSidebarItem: React.FC<PageSidebarItem.Props> = ({ slug, pageMetadata }) => {
    return <NavigatingSidebarItem slug={slug} title={pageMetadata.title} />;
};
