import React from "react";
import TopicsList from "../common/topics_list";
import { registerLocale } from "react-datepicker";
import {AGENDA_SEPARATOR} from "../constants";
import de from "date-fns/locale/de";

import "react-datepicker/dist/react-datepicker.css";

registerLocale("de", de);

const MyTopics = () => {

    return (
        <>
          <div className="firstLineOfGrid-col1"></div>
          <div className="firstLineOfGrid-col2"></div>
          <div className="page-header-col1"></div>
          <div className="page-header">
            <h2>Alle Agenda-Punkte</h2>
          </div>
    
          <div className="table-col1"></div>
          <div className="table agenda-table">
            <div className="resubmission agenda-header">WV-Termin</div>
            <div className="agenda-topic agenda-header">Inhalt</div>
            <div className="responsible agenda-header">Verantwortliche</div>
            <div className="doing agenda-header center">Doing</div>
            <div className="done agenda-header center">Done</div>
            
            {AGENDA_SEPARATOR}
    
            <TopicsList useAuthtoken={true}/>
          </div>
          
        </>
    );
};

export default MyTopics;