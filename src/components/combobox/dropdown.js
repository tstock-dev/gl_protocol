import React from "react";
import {
    DropdownWrapper,
    StyledSelect,
    StyledOption,
} from "./styles.js";

const Dropdown = ({name, title, options, selected_id, onChange, onClick, withDefault}) => {

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

    const handleClick = (element) => {
        if (typeof onClick !== "undefined")
            onClick(element.target);
    }

    if (typeof withDefault !== "undefined" && withDefault) {
        return (
            <>
                <DropdownWrapper onClick={(elem) => handleClick(elem)}>
                    <StyledSelect   id={name} name={name} title={title}
                                    selectedIndex={selected_id === -1 
                                                        ?   "DEFAULT"
                                                        :   selected_id
                                                }
                                    onChange={(elem) => selectedChanged(elem)}>
                        <StyledOption value="DEFAULT">bitte auswählen</StyledOption>
                        {optionsList}
                    </StyledSelect>
                </DropdownWrapper>
            </>
        );
    } else {
        return (
            <>
                <DropdownWrapper onClick={(elem) => handleClick(elem)}>
                    <StyledSelect   id={name} name={name} title={title}
                                    selectedIndex={selected_id}
                                    onChange={(elem) => selectedChanged(elem)}>
                        {optionsList}
                    </StyledSelect>
                </DropdownWrapper>
            </>
        );
    }
};

export default Dropdown;