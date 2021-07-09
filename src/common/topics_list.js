import React, { useEffect, useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import Dropdown from "../components/combobox/dropdown";
import { useMutation, useApolloClient } from "@apollo/client";
import { AUTH_TOKEN, USE_AUTH_TOKEN } from "../constants";
import { TOPICS_QUERY, TOPICS_SET_STATE, TOPICS_SET_RESUBMITION } from "../queries/topic_queries";

const TopicsList = ({useAuthtoken, onlyOpen, topicsData, isNormalList,
                     memberOptions, priorityOptions, 
                     onTakeIt, onUp, onDown, onRowClick, 
                     onChangeTitle, onChangeMember, onChangePriority}) => {
    const client = useApolloClient();
    const [ data, setData ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(false);

    const loadTopicList = useCallback(() => {
        if (!loading) {
            // Set the loading true.
            setLoading(true);

            // create headers
            let authToken =  "Bearer " + (AUTH_TOKEN in localStorage) ? localStorage.getItem(AUTH_TOKEN) :  "-";
            let headersToSend = {};
            let lastUseOfAuthToken = localStorage.getItem(USE_AUTH_TOKEN) === "true";
            let disableCache = lastUseOfAuthToken !== useAuthtoken;
            if (useAuthtoken) {
                headersToSend.Authorization = authToken;
            }
            localStorage.setItem(USE_AUTH_TOKEN, useAuthtoken);
            let fetchPolicy = (disableCache) ? "no-cache" : "cache-first";
            //console.log("fetch-policy: ", fetchPolicy);
                
            // Manually query the topics.
            client.query({ query: TOPICS_QUERY,
                           fetchPolicy: fetchPolicy,
                           context: {
                                headers: headersToSend
                           } })
                    .then((queryResult) => {
                        // build own json without apollo fields
                        let newData = {"topics": []};
                        queryResult.data.topics.forEach((topic) => {
                            // only Open
                            if (!onlyOpen || topic.state_id < 4) {
                                let newTopic = {    "internalId": newData.topics.length,
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
                            }
                        });
                        newData.topics = newData.topics.sort((a, b) => a.resubmit_date > b.resubmit_date ? 1 : -1)
                        setData(newData);
                    })
                    .catch((err) => {
                        setError(err);
                    });

            // Reset the loading state.
            setLoading(false);
        }
    }, [useAuthtoken, onlyOpen, client, loading]);

    useEffect(() => { 
        if (typeof topicsData === "undefined")
        {
            // load data
            loadTopicList();
        } else {
            setData(topicsData);
        }
    }, [topicsData, loadTopicList]); 

    const [ setTopicState ]        = useMutation(TOPICS_SET_STATE);
    const [ setTopicResubmitDate ] = useMutation(TOPICS_SET_RESUBMITION);

    const setStateInDB = (topicId, newStateId) => {
        setTopicState({
            variables: {
                id: topicId,
                stateId: newStateId
            }
        });
        let tempTopicsData = data;
        // update data on this page from cache.
        tempTopicsData.topics.forEach((topic) => {
            if (topic.id === topicId) {
                topic.state_id = newStateId;
            }
        });
        setData(tempTopicsData);
    };

    const setResubmitDateInDB = (topicId, resubmitDate) => {
        setTopicResubmitDate({
            variables: {
                id: topicId,
                resubmit_date: resubmitDate
            }
        });
        let tempTopicsData = data;
        // update data on this page from cache.
        tempTopicsData.topics.forEach((topic) => {
            if (topic.id === topicId) {
                topic.resubmit_date = resubmitDate;
            }
        });
        setData(tempTopicsData);
    };

    const clickRow = (topicId) => {
        if (typeof onRowClick !== "undefined")
            onRowClick(topicId);
    }

    const clickDoing = (topicId) => {
        if (useAuthtoken)
            setStateInDB(topicId, 2);
        else if (typeof onRowClick !== "undefined")
            onRowClick(topicId);
    };
    
    const clickClosed = (topicId) => {
        if (useAuthtoken)
            setStateInDB(topicId, 4);
        else if (typeof onRowClick !== "undefined")
            onRowClick(topicId);
    };

    const clickTakeIt = (topicId) => {
        let onlyShowData = typeof onRowClick != "undefined";
        if (!onlyShowData) {
            // update the flag of taken it
            let tempTopicsData = data;
            tempTopicsData.topics.forEach((topic) => {
                if (topic.id === topicId) {
                    if (typeof onTakeIt !== "undefined")
                        onTakeIt(topic);
                    topic.used_protocol_id = 0;
                }
            })
            setData(tempTopicsData);
        } else {
            onRowClick(topicId);
        }
    }

    const clickUp = (topicId) => {
        if (typeof onUp !== "undefined")
            onUp(topicId);
    };

    const clickDown = (topicId) => {
        if (typeof onDown !== "undefined")
            onDown(topicId);
    };

    const changeTitle = (orderId, input) => {
        if (typeof onChangeTitle !== "undefined")
            onChangeTitle(orderId, input.target.value);
    }

    const changeMemberAssigned = (orderId, itemNumber) =>  {
        if (typeof onChangeMember !== "undefined")
            onChangeMember(orderId, itemNumber);
    }

    const changePriority = (orderId, itemNumber) => {
        if (typeof onChangePriority !== "undefined") {
            // + 1 because in the list is no DEFAULT value on position 0
            onChangePriority(orderId, itemNumber + 1);
        }
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    if (data === null) {
        return <>loading...</>
    } else {
        let onlyShowData = typeof onRowClick != "undefined";
        return data.topics.map((topic) =>
            <React.Fragment key={topic.internalId}>
                { typeof topicsData === "undefined" || isNormalList
                    ?   <div>
                            {useAuthtoken 
                                ?   <div className="resubmission agenda-date">
                                         {topic.resubmit_date.substring(8,10) + "." +
                                          topic.resubmit_date.substring(5,7) + "." + 
                                          topic.resubmit_date.substring(0,4)}
                                    </div>
                                :   topic.resubmit_date && Date.parse(topic.resubmit_date) === 0
                                        ?   <div    className="resubmission agenda-history-date"
                                                    onClick={() => clickRow(-1)}>Themenspeicher</div>
                                        :   <DatePicker
                                                className="resubmission agenda-date"
                                                closeOnScroll={true}
                                                dateFormat="dd.MM.yyyy"
                                                locale="de"
                                                name="startDate"
                                                onClick={() => clickRow(topic.id)}
                                                onChange={(date) => setResubmitDateInDB(topic.id, date)}
                                                selected={Date.parse(topic.resubmit_date)}
                                                showWeekNumbers={true}
                                                todayButton="Heute"
                                            />
                            }
                        </div>
                    :   <div className="agenda-order">{topic.order_text}</div>
                }
                { typeof topicsData === "undefined" || isNormalList
                    ?   null
                    :   topic.id > 0
                            ?   <div className="agenda-prio" onClick={() => clickRow(topic.id)}>{topic.priority.description}</div>
                            :   <div className="agenda-prio">
                                    <Dropdown   name="priority" title={onlyShowData ? "klicken, um Historie anzuzeigen" : "Priorität auswählen"}
                                                options={priorityOptions} 
                                                selected_id={topic.priority_id}
                                                onChange={(itemNumber) => changePriority(topic.order, itemNumber)}
                                                withDefault={false} />
                                </div>
                }
                {topic.id > 0
                    ?   <div className="agenda-topic agenda-item" onClick={() => clickRow(topic.id)}
                            title="klicken, um Historie anzuzeigen">{topic.title}</div>
                    :   <input  className="agenda-topic agenda-item"
                                type="text" value={topic.title} 
                                onChange={(obj) => changeTitle(topic.order, obj)}
                                onClick={() => clickRow(-1)} ></input>
                }
                {topic.id > 0
                    ?   topic.assigned_to_member
                        ?   <div className="responsible agenda-item" onClick={() => clickRow(topic.id)}
                                 title="klicken, um Historie anzuzeigen">{topic.assigned_to_member.last_name}, {topic.assigned_to_member.first_name}</div>
                        :   <div className="responsible agenda-item" onClick={() => clickRow(topic.id)}
                                 title="klicken, um Historie anzuzeigen"></div>
                    :   <div className="agenda-item">
                            <Dropdown   name="assigned_to_member" 
                                        title={onlyShowData ? "klicken, um Historie anzuzeigen" : "Verantwortliche auswählen"}
                                        options={memberOptions} 
                                        selected_id={topic.member_assigned}
                                        onChange={(itemNumber) => changeMemberAssigned(topic.order, itemNumber)}
                                        onClick={() => clickRow(-1)}
                                        withDefault={true} />
                        </div>
                }
                { onlyOpen && !isNormalList
                    ?   <button className={"doing agenda-button" + (topic.used_protocol_id !== -1 ? " checked" : "")}
                                onClick={() => clickTakeIt(topic.id)} 
                                title={onlyShowData ? "klicken, um Historie anzuzeigen" : "klicken, um diesen offenen Agenda-Punkt ins Protokoll auzunehmen"}></button>
                    :   "order" in topic
                            ?   topic.order > 1 && !isNormalList
                                    ?   <button className="up agenda-button checked"
                                                onClick={() => clickUp(topic.internalId)} title='klicken, um nach oben zu bewegen'></button>
                                    :   <div></div>
                            :   <button className={"doing agenda-button" + (topic.state_id === 2 ? " checked" : "")}
                                        onClick={() => clickDoing(topic.id)}
                                        title={onlyShowData ? "klicken, um Historie anzuzeigen" : 'klicken, um auf "in Bearbeitung" umzustellen'}></button>
                }
                { onlyOpen 
                    ?   <div></div>
                    :   "order" in topic
                            ?   topic.order < data.topics.length && !isNormalList
                                    ?   <button className="down agenda-button checked"
                                                onClick={() => clickDown(topic.internalId)} 
                                                title={onlyShowData ? "klicken, um Historie anzuzeigen" : 'klicken, um nach unten zu bewegen'}></button>
                                    :   <div></div>
                            :   <button className={"done agenda-button" + (topic.state_id === 4 ? " checked" : "")}
                                        onClick={() => clickClosed(topic.id)} 
                                        title={onlyShowData ? "klicken, um Historie anzuzeigen" : 'klicken, um auf "Erledigt" umzustellen'}></button>
                }
            </React.Fragment>
        );
    }

};

export default TopicsList;