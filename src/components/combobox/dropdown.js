import React from "react";
import {
    DropdownWrapper,
    StyledSelect,
    StyledOption,
} from "./styles.js";

const Dropdown = ({name, options, selected_id, onChange}) => {

    // the format of the options has to be JSON
    // [{ "id": 1, "value": "value 01"},{ "id": 2, "value": "value 02"}, etc]

    //console.log("selected_id", selected_id);
    let optionsList = <></>
    if (typeof options !== "undefined" && options.length > 0) {
        optionsList =   options.map((option) =>
                            <React.Fragment key={option.id}>
                                <StyledOption selected={option.id * 1 === selected_id}>{option.value}</StyledOption>
                            </React.Fragment>
                        );
    }

    const selectedChanged = (element) => {
        onChange(element.target.selectedIndex);
    }

    return (
        <>
            <DropdownWrapper >
                <StyledSelect id={name} name={name} onChange={(elem) => selectedChanged(elem)}>
                    {optionsList}
                </StyledSelect>
            </DropdownWrapper>
        </>
    );

};

export default Dropdown;