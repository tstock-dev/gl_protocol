import React, { useState } from "react";
import TopicsList from "../common/topics_list";
import DatePicker from "react-datepicker";
import {AGENDA_SEPARATOR, LINE_SEPARATOR} from "../constants";

const CreateProtocol = () => {

  const [ date, setDate ] = useState(new Date());

  const clickSave = () => {

  }

  return (
    <>
      <div className="firstLineOfGrid-col1"></div>
      <div className="firstLineOfGrid-col2"></div>
      <div className="page-header-col1"></div>
      <div className="page-header">
        <h2>Protokoll erstellen
          <div className="page-header-protocol-date">
            <div className="page-header-protocol-date-label">für den:</div>
            <div className="page-header-protocol-date-date">
              <DatePicker
                className="resubmission agenda-date"
                closeOnScroll={true}
                dateFormat="dd.MM.yyyy"
                locale="de"
                name="startDate"
                onChange={(date) => setDate(date)}
                selected={date}
                showWeekNumbers={true}
                todayButton="Heute"
              />
            </div>
          </div>
          <div className="page-header-protocol-save">
            <button className="action-button save page-header-protocol-save-btn" onClick={() => clickSave()}>Speichern</button>
          </div>
        </h2>
      </div>

      <div className="table-col1"></div>
      <div className="table protocol-table">
        <div className="table-fieldname">Protokollant:</div>
        <div><input type="text"></input></div>
        <div className="table-seperator"></div>
        <div className="table-fieldname">Moderator:</div>
        <div><input type="text"></input></div>
      </div>
      <div className="table-col1"></div>
      <div className="table protocol-table2">
        <div className="table-fieldname">Kurzbeschreibung:</div>
        <div><input type="text"></input></div>
      </div>

      <div className="table-col1"></div>
      {LINE_SEPARATOR}

      <div className="table-col1"></div>
      <div className="table agenda-table">
        <div className="resubmission agenda-header">WV-Termin</div>
        <div className="agenda-topic agenda-header">Inhalt</div>
        <div className="responsible agenda-header">Verantwortliche</div>
        <div className="doing agenda-header center">benutzen</div>
        <div></div>
        
        {AGENDA_SEPARATOR}

        <TopicsList useAuthtoken={false} onlyOpen={true} />
      </div>
    </>
  );
};

export default CreateProtocol;
