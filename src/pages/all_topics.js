import React, { useState, useEffect, useCallback } from "react";
import TopicsList from "../common/topics_list";
import TopicHistoryList from "../common/topic_history_list";
import Dropdown from "../components/combobox/dropdown";
import { registerLocale } from "react-datepicker";
import { useQuery, useApolloClient } from '@apollo/client';
import {AGENDA_SEPARATOR, AGENDA_HISTORY_SEPARATOR} from "../constants";
import { TOPICS_QUERY, GET_TOPIC_HISTORY } from "../queries/topic_queries";
import { MEMBER_NAMES_QUERY } from "../queries/member_queries";
import { PRIORITIES_QUERY } from "../queries/priority_queries";
import de from "date-fns/locale/de";

import "react-datepicker/dist/react-datepicker.css";

registerLocale("de", de);

const AllTopics = () => {

  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState(false);
  const [ topicsData, setTopicsData ] = useState({"topics": []});
  const [ allTopicsData, setAllTopicsData ] = useState({"topics": []});
  const [ topicHistoryId, setTopicHistoryId ] = useState(-1);
  const [ elements, setElements ] = useState(0);
  const [ members, setMembers ] = useState({});
  const [ priorities, setPriorities ] = useState({});
  const [ modes, setModes ] = useState({});
  const [ mode, setMode ] = useState(0);

  const { loading : historyLoading, error : historyError, data : historyData } = useQuery(GET_TOPIC_HISTORY, {
    variables: { topicId: topicHistoryId },
  });

  const { loading : membersLoading, error : membersError, data : memberData } = useQuery(MEMBER_NAMES_QUERY);
  const { loading : prioLoading, error : priorityError, data : priorityData } = useQuery(PRIORITIES_QUERY);

  const client = useApolloClient();

  const loadTopicList = useCallback(() => {
    if (!loading) {
        // Set the loading true.
        setLoading(true);

        // Manually query the topics.
        client.query({ query: TOPICS_QUERY })
              .then((queryResult) => {
                // build own json without apollo fields
                let newData = {"topics": []};
                queryResult.data.topics.forEach((topic) => {
                  let newTopic = {  "internalId": newData.topics.length,
                                    "id": topic.id,
                                    "created": topic.created,
                                    "closed": topic.closed,
                                    "priority_id": topic.priority_id,
                                    "priority": topic.priority,
                                    "resubmit_date": topic.resubmit_date,
                                    "state_id": topic.state_id,
                                    "title": topic.title,
                                    "assigned_to_member": topic.assigned_to_member,
                                    "used_protocol_id": -1
                                  };
                  newData.topics.push(newTopic);
                });
                    newData.topics = newData.topics.sort((a, b) => a.resubmit_date > b.resubmit_date ? 1 : -1)
                    setAllTopicsData(newData);
                })
                .catch((err) => {
                    setError(err);
                });

        // Reset the loading state.
        setLoading(false);
    }
  }, [client, loading]);

  useEffect(() => { 
    loadTopicList();
    // define modes
    let modeOptions = [];
    modeOptions.push({"id": 1, "value": "nur offene Punkte"});
    modeOptions.push({"id": 2, "value": "alle Punkte"});
    setModes(modeOptions);
  }, [loadTopicList]); 

  useEffect(() => { 
    if(membersLoading === false && !membersError && memberData) {
      let memberOptions = [];
      memberData.members.forEach(element => {
        memberOptions.push({"id": element.id, "value": element.combined_name});
      });
      setMembers(memberOptions);
    }
  }, [membersLoading, membersError, memberData])

  useEffect(() => {
    if (allTopicsData.topics.length > 0) {
      if (mode == 0) {
        let tempTopicsData = {"topics": []};
        allTopicsData.topics.forEach((topic) => {
          if (topic.state_id < 4)
          {
            let newTopic = {"internalId": tempTopicsData.topics.length,
                            "id": topic.id,
                            "created": topic.created,
                            "closed": topic.closed,
                            "priority_id": topic.priority_id,
                            "priority": topic.priority,
                            "resubmit_date": topic.resubmit_date,
                            "state_id": topic.state_id,
                            "title": topic.title,
                            "assigned_to_member": topic.assigned_to_member,
                            "used_protocol_id": -1
                            };
            tempTopicsData.topics.push(newTopic);
          }
        });
        setTopicsData(tempTopicsData);
        console.log(tempTopicsData);
      } else
        setTopicsData(allTopicsData);
    } else
      setTopicsData(allTopicsData);
  }, [allTopicsData, mode]);

  useEffect(() => { 
    if(prioLoading === false && priorityData) {
      let priorityOptions = [];
      priorityData.priorities.forEach(element => {
        priorityOptions.push({"id": element.id, "value": element.description});
      });
      setPriorities(priorityOptions);
    }
  }, [prioLoading, priorityData])



  const changeMode = (modeId) => {
    setMode(modeId);
  }

  const handleRowClick = (topicId) => {
    setTopicHistoryId(1 * topicId);
  }

  const clickPlus = () => {
    storeNewTopic();
  }

  const storeNewTopic = (topic) => {
    // store it to data
    let tempData = topicsData;
    let e = elements;
    let order = "000" + (e + 1);
    let newTopic = {    "internalId": tempData.topics.length,
                        "id": topic ? topic.id : -1,
                        "created": topic ? topic.created : -1,
                        "closed": false,
                        "priority_id": topic ? topic.priority_id : 1,
                        "priority": topic ? topic.priority : "",
                        "resubmit_date": new Date(0),
                        "state_id": topic ? topic.state_id : 1,
                        "title": topic ? topic.title : "",
                        "member_assigned": topic ? topic.member_assigned : -1,
                        "assigned_to_member": topic ? topic.assigned_to_member : {},
                        "order": e + 1,
                        "order_text": order.substring(order.length - 3, order.length),
                        "used_protocol_id": -1
                    }
                    
    tempData.topics.push(newTopic);
    setTopicsData(tempData);
    setElements(tempData.topics.length);
  }

  const handleChangeTitle = (orderId, value) => {
    let tempData = topicsData;
    // update data in cache.
    tempData.topics.forEach((topic) => {
        if (topic.order === orderId) {
            topic.title = value;
        }
    });
    setTopicsData(tempData);
    setElements(-1 * elements);
  }

  const handleChangeMember = (orderId, value) => {
    let tempData = topicsData;
    // update data in cache.
    tempData.topics.forEach((topic) => {
        if (topic.order === orderId) {
            topic.member_assigned = value;
        }
    });
    setTopicsData(tempData);
    setElements(-1 * elements);
  }

  const handleChangePriority = (orderId, value) => {
    let tempData = topicsData;
    // update data in cache.
    tempData.topics.forEach((topic) => {
        if (topic.order === orderId) {
            //console.log(topic.priority_id, value);
            topic.priority_id = value;
        }
    });
    setTopicsData(tempData);
    setElements(-1 * elements);
  }

  if (error) return <p>Error :(</p>;

  if (priorityError)
    console.log("priority error : ", priorityError);

  return (
    <>
      <div className="page-header-seperator-col1"></div>
      <div className="page-header-seperator-col2"></div>
      <div className="page-header-seperator-col3"></div>
      <div className="page-header">
        <h2>Alle Agenda-Punkte</h2>
        <div className="agenda-selector-table">
          <Dropdown   name="mode" title="Modus auswählen"
                      options={modes} 
                      selected_id={mode}
                      onChange={(itemNumber) => changeMode(itemNumber)}
                      withDefault={false} />
          <div className="page-header-seperator-col2"></div>
          <button className="page-header-protocol-save-btn plus agenda-button"
                onClick={() => clickPlus()} 
                title="klicken, um neuen Eintrag zu erstellen">
          </button>
        </div>
      </div>
      <div className="page-header-seperator-col2"></div>
      <div className="page-header-seperator-col3"></div>

      <div className="table agenda-table">
        <div className="resubmission agenda-header">WV-Termin</div>
        <div className="agenda-topic agenda-header">Inhalt</div>
        <div className="responsible agenda-header">Verantwortliche</div>
        <div className="doing agenda-header center">Doing</div>
        <div className="done agenda-header center">Done</div>
        
        {AGENDA_SEPARATOR}

        <TopicsList useAuthtoken={false} onlyOpen={mode === 0} topicsData={topicsData} 
                    isNormalList={true}
                    memberOptions={members} priorityOptions={priorities}
                    onChangeTitle={handleChangeTitle} onChangeMember={handleChangeMember}
                    onChangePriority={handleChangePriority} onRowClick={handleRowClick} />
      </div>
      
      <div className="page-header-seperator-col2"></div>

      <div className="page-content-right">
        <div className="table agenda-history-table">
          <div className="date agenda-history-header centered">Historie</div>
          {historyData && historyData.topic_history.length > 0
            ? <>
                <div className="date agenda-history-header">Datum</div>
                <div className="note agenda-history-header">Notiz</div>
                <div className="responsible agenda-history-header">Verantwortliche</div>

                {AGENDA_HISTORY_SEPARATOR}
              </>
            : null
          }
        </div>
        {historyData && historyData.topic_history.length > 0
          ? <ul className="agenda-history-list">
              <TopicHistoryList loading={historyLoading} error={historyError} topicsHistoryData={historyData} />
            </ul>
          : null
        }
      </div>
      <div className="page-header-seperator-col2"></div>
      
    </>
  );
};

export default AllTopics;
