import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { useQuery, useMutation, gql } from '@apollo/client';
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
        resubmit_date
        assigned_to_member {
          last_name 
          first_name
        }
      }
    }
    `
  ;

  const TOPICS_SET_STATE = gql`
    mutation updateTopicState($id: ID!, $stateId: Int!) {
      updateTopicState(id: $id, state_id: $stateId) {
        id
        state_id
      } 
    }
    `
  ;

  const TOPICS_SET_RESUBMITION = gql`
    mutation updateTopicResubmitDate($id: ID!, $resubmit_date: Date!) {
      updateTopicResubmitDate(id: $id, resubmit_date: $resubmit_date) {
        id
        resubmit_date
      } 
    }
    `
  ;

  // const { loading, error, data, refetch } = useQuery(TOPICS_QUERY);
  const { loading, error, data } = useQuery(TOPICS_QUERY);

  const [ setTopicState ]        = useMutation(TOPICS_SET_STATE);
  const [ setTopicResubmitDate ] = useMutation(TOPICS_SET_RESUBMITION);


  const clickDoing = (topicId) => {
    console.log(topicId);
    setStateInDB(topicId, 2);
  };

  const clickClosed = (topicId) => {
    console.log(topicId);
    setStateInDB(topicId, 4);
  };

  const setStateInDB = (topicId, newStateId) => {
    setTopicState({
      variables: {
        id: topicId,
        stateId: newStateId
      }
    });
  };

  const setResubmitDateInDB = (topicId, resubmitDate) => {
    setTopicResubmitDate({
      variables: {
        id: topicId,
        resubmit_date: resubmitDate
      }
    });
  };

  // const setStateInDB = (topicId, newStateId) => {
  //   setTopicState({
  //     variables: {
  //       id: topicId,
  //       stateId: newStateId
  //     },
  //     onCompleted: refetch,
  //   });
  // };
    
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  
  const listItems = data.topics.map((topic) =>
    <React.Fragment key={topic.id}>
      <div>
        <DatePicker
          className="resubmission agenda-date"
          closeOnScroll={true}
          dateFormat="dd.MM.yyyy"
          locale="de"
          name="startDate"
          onChange={(date) => setResubmitDateInDB(topic.id, date)}
          selected={Date.parse(topic.resubmit_date)}
          showWeekNumbers={true}
          todayButton="Heute"
        />
      </div>
      <div className="agenda-topic agenda-item">
          {topic.title}
      </div>
      {topic.assigned_to_member
        ? <div className="responsible agenda-item">{topic.assigned_to_member.last_name}, {topic.assigned_to_member.first_name}</div>
        : <div className="responsible agenda-item"></div> }
      <button className={"doing agenda-button" + (topic.state_id === 2 ? " checked" : "")}
              onClick={() => clickDoing(topic.id)}></button>
      <button className={"done agenda-button" + (topic.state_id === 4 ? " checked" : "")}
              onClick={() => clickClosed(topic.id)}></button>
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
