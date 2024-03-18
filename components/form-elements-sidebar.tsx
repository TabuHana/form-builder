import { FormElements } from "@/components/form-elements";
import { SidebarButtonElement } from "@/components/sidebar-button-element";

export const FormElementsSidebar = () => {
    return (
        <div>
            Elements
            <SidebarButtonElement formElement={FormElements.TextField} />
        </div>
    );
};
