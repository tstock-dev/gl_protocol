import React from "react";
import {
    DropdownWrapper,
    StyledSelect,
    StyledOption,
} from "./styles.js";

const Dropdown = ({name, title, options, selected_id, onChange, withDefault}) => {

    // the format of the options has to be JSON
    // [{ "id": 1, "value": "value 01"},{ "id": 2, "value": "value 02"}, etc]

    //console.log("selected_id", selected_id);
    let optionsList = <></>
    if (typeof options !== "undefined" && options.length > 0) {
        optionsList =   options.map((option) =>
                            <React.Fragment key={option.id}>
                                <StyledOption value={option.id}>{option.value}</StyledOption>
                            </React.Fragment>
                        );
    }

    const selectedChanged = (element) => {
        if (typeof onChange !== "undefined")
            onChange(element.target.selectedIndex);
    }

    return (
        <>
            <DropdownWrapper >
                <StyledSelect   id={name} name={name} title={title}
                                value={typeof withDefault !== "undefined" 
                                            ? selected_id === -1 
                                                ?   "DEFAULT"
                                                :   selected_id
                                            :   selected_id
                                        }
                                onChange={(elem) => selectedChanged(elem)}>
                    {typeof withDefault !== "undefined"
                        ?   <StyledOption value="DEFAULT">bitte auswählen</StyledOption>
                        :   null
                    }
                    {optionsList}
                </StyledSelect>
            </DropdownWrapper>
        </>
    );

};

export default Dropdown;