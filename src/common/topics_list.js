import React, { useEffect, useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import Dropdown from "../components/combobox/dropdown";
import { useMutation, gql, useApolloClient } from '@apollo/client';
import { AUTH_TOKEN, USE_AUTH_TOKEN } from '../constants';

const TopicsList = ({useAuthtoken, onlyOpen, tempData, 
                     memberOptions, priorityOptions, 
                     onTakeIt, onUp, onDown, onRowClick, 
                     onChangeTitle, onChangeMember, onChangePriority}) => {
    const client = useApolloClient();
    const [ data, setData ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(false);

    const TOPICS_QUERY = gql`
        query getAllTopics {
            topics {
                id
                title
                priority_id
                priority {
                    id
                    description
                }
                state_id
                created
                closed
                resubmit_date
                member_assigned
                assigned_to_member {
                    last_name 
                    first_name
                }
            }
        }
    `;

    const TOPICS_SET_STATE = gql`
        mutation updateTopicState($id: ID!, $stateId: Int!) {
            updateTopicState(id: $id, state_id: $stateId) {
                id
                state_id
            } 
        }
    `;

    const TOPICS_SET_RESUBMITION = gql`
        mutation updateTopicResubmitDate($id: ID!, $resubmit_date: Date!) {
            updateTopicResubmitDate(id: $id, resubmit_date: $resubmit_date) {
                id
                resubmit_date
            } 
        }
    `;

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
    }, [TOPICS_QUERY, useAuthtoken, onlyOpen, client, loading]);

    useEffect(() => { 
        
        if (typeof tempData === "undefined")
        {
            // load data
            loadTopicList();
        } else {
            setData(tempData);
        }
    }, [tempData, loadTopicList]); 


    const [ setTopicState ]        = useMutation(TOPICS_SET_STATE);
    const [ setTopicResubmitDate ] = useMutation(TOPICS_SET_RESUBMITION);

    const setStateInDB = (topicId, newStateId) => {
        setTopicState({
            variables: {
                id: topicId,
                stateId: newStateId
            }
        });
        let topicsData = data;
        // update data on this page from cache.
        topicsData.topics.forEach((topic) => {
            if (topic.id === topicId) {
                topic.state_id = newStateId;
            }
        });
        setData(topicsData);
    };

    const setResubmitDateInDB = (topicId, resubmitDate) => {
        setTopicResubmitDate({
            variables: {
                id: topicId,
                resubmit_date: resubmitDate
            }
        });
        let topicsData = data;
        // update data on this page from cache.
        topicsData.topics.forEach((topic) => {
            if (topic.id === topicId) {
                topic.resubmit_date = resubmitDate;
            }
        });
        setData(topicsData);
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
        // update the flag of taken it
        let topicsData = data;
        topicsData.topics.forEach((topic) => {
            if (topic.id === topicId) {
                if (typeof onTakeIt !== "undefined")
                    onTakeIt(topic);
                topic.used_protocol_id = 0;
            }
        })
        setData(topicsData);
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
                { typeof tempData === "undefined"
                    ?   <div>
                            <DatePicker
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
                        </div>
                    :   <div className="agenda-order">{topic.order_text}</div>
                }
                { typeof tempData === "undefined"
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
                                onChange={(obj) => changeTitle(topic.order, obj)}></input>
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
                                        withDefault={true} />
                        </div>
                }
                { onlyOpen 
                    ?   <button className={"doing agenda-button" + (topic.used_protocol_id !== -1 ? " checked" : "")}
                                onClick={() => clickTakeIt(topic.id)} title="klicken, um diesen offenwn Agenda-Punkt ins Protokoll auzunehmen"></button>
                    :   "order" in topic
                            ?   topic.order > 1
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
                            ?   topic.order < data.topics.length
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