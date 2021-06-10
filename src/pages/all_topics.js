import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { useQuery, gql } from '@apollo/client';
import de from "date-fns/locale/de";

import "react-datepicker/dist/react-datepicker.css";

registerLocale("de", de);

const AllTopics = () => {
  const [startDate, setStartDate] = useState(new Date());

  const TOPICS_QUERY = gql`
    query getAllTopics {
      topics {
        id
        title
        priority_id
        state_id
        created
        closed
        assigned_to_member {
          last_name 
          first_name
        }
      }
    }
    `
  ;

  const { loading, error, data } = useQuery(TOPICS_QUERY);
    
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  
  const listItems = data.topics.map((topic) =>
    <React.Fragment key={topic.id}>
      <div></div>
      <div className="agenda-topic agenda-item">
          {topic.title}
      </div>
      {topic.assigned_to_member
        ? <div className="responsible agenda-item">{topic.assigned_to_member.last_name}, {topic.assigned_to_member.first_name}</div>
        : <div className="responsible agenda-item"></div> }
      <button className="doing agenda-button checked"></button>
      <button className="done agenda-button"></button>
    </React.Fragment>
  );

  const Separator = <>
                        <div className="agenda-separator" /><div className="agenda-separator" /><div className="agenda-separator" />
                        <div className="agenda-separator" /><div className="agenda-separator" />
                    </>;

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
        
        {Separator}

        <div>
          <DatePicker
            className="resubmission agenda-date"
            closeOnScroll={true}
            dateFormat="dd.MM.yyyy"
            locale="de"
            name="startDate"
            onChange={(date) => setStartDate(date)}
            selected={startDate}
            showWeekNumbers={true}
            todayButton="Heute"
          />
        </div>
        <div className="agenda-topic agenda-item">
          Achja nochmal Februar Eintrag zum Testen der gefixten
          Tabellenüberschriften
        </div>
        <div className="responsible agenda-item">Claudia Flör</div>
        <button className="doing agenda-button checked"></button>
        <button className="done agenda-button"></button>

        {listItems}
      </div>
      
    </>
  );
};

export default AllTopics;
