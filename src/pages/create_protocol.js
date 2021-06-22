import React, { useState, useEffect } from "react";
import TopicsList from "../common/topics_list";
import DatePicker from "react-datepicker";
import { gql, useQuery } from '@apollo/client';
import {AGENDA_SEPARATOR, LINE_SEPARATOR} from "../constants";

const CreateProtocol = () => {

  const MEMBERS_QUERY = gql`
        query getAllMembers {
            members {
                id
                first_name
                last_name
            }
        }
    `;

  const { loading, error, data } = useQuery(MEMBERS_QUERY);

  const [ date, setDate ] = useState(new Date());
  const [ topicsData, setTopicsData ] = useState({"topics": []});
  const [ elements, setElements ] = useState(0);
  const [ members, setMembers ] = useState({});
  
  useEffect(() => { 
    // load member data
    if(loading === false && data) {
      setMembers(data);
    }
  }, [loading, data])

  const clickSave = () => {
    console.log(members);
  }

  const handleTakeIt = (topic) => {
    // only unused
    if (topic.used_protocol_id < 0) {
      // store it to data
      let tempData = topicsData;
      let e = elements;
      let order = "000" + (e + 1);
      let newTopic = {    "id": topic.id,
                          "created": topic.created,
                          "priority_id": topic.priority_id,
                          "state_id": topic.state_id,
                          "title": topic.title,
                          "assigned_to_member": topic.assigned_to_member,
                          "order": e + 1,
                          "order_text": order.substring(order.length - 3, order.length),
                          "used_protocol_id": -1
                      }
                      
      tempData.topics.push(newTopic);
      setTopicsData(tempData);
      setElements(tempData.topics.length);
    }
  }

  const handleUp = (topicId) => {
    handleUpDown(topicId, 1);
  }

  const handleDown = (topicId) => {
    handleUpDown(topicId, - 1);
  }

  const handleUpDown = (topicId, direction) => {
    let tempData = topicsData;
    // get order of the topic
    let oldOrder = -1;
    tempData.topics.forEach((topic) => {
      if (topic.id === topicId) {
        oldOrder = topic.order;
        topic.order = oldOrder - direction;
        let order = "000" + (topic.order);
        topic.order_text = order.substring(order.length - 3, order.length);
      }
    });

    // set order of the second item
    tempData.topics.forEach((topic) => {
      if (topic.order === oldOrder - direction && topic.id !== topicId) {
        topic.order = oldOrder;
        let order = "000" + (oldOrder);
        topic.order_text = order.substring(order.length - 3, order.length);
      }
    });

    // sort topics
    tempData.topics.sort(function(a,b){
      //return a.attributes.OBJECTID - b.attributes.OBJECTID;
      if(a.order < b.order)
          return -1;
      if(a.order > b.order)
          return 1;
      return 0;
    });

    // write back
    setTopicsData(tempData);
    setElements(elements * -1);
  };

  if (loading) return "Loading...";
  if (error) return "Error! {error.message}";

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
      <h3 className="page-sub-header">Agenda-Punkte für das Protokoll:</h3>
      <div className="table-col1"></div>
      <div className="table agenda-table">
        <div className="agenda-topic agenda-header">Nr</div>
        <div className="agenda-topic agenda-header">Inhalt</div>
        <div className="responsible agenda-header">Verantwortliche</div>
        <div className="doing agenda-header center"></div>
        <div className="doing agenda-header center"></div>
        
        {AGENDA_SEPARATOR}
        
        <TopicsList useAuthtoken={false} onlyOpen={false} tempData={topicsData} onUp={handleUp} onDown={handleDown} />
      </div>

      <div className="table-col1"></div>
      {LINE_SEPARATOR}

      <div className="table-col1"></div>
      <h3 className="page-sub-header">Offene Agenda-Punkte:</h3>
      <div className="table-col1"></div>
      <div className="table agenda-table">
        <div className="resubmission agenda-header">WV-Termin</div>
        <div className="agenda-topic agenda-header">Inhalt</div>
        <div className="responsible agenda-header">Verantwortliche</div>
        <div className="doing agenda-header center">benutzt</div>
        <div className="doing agenda-header center"></div>
        
        {AGENDA_SEPARATOR}

        <TopicsList useAuthtoken={false} onlyOpen={true} onTakeIt={handleTakeIt} />
      </div>
    </>
  );
};

export default CreateProtocol;
