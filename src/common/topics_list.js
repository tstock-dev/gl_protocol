import React from "react";
import DatePicker from "react-datepicker";
import { useQuery, useMutation, gql } from '@apollo/client';

const TopicsList = () => {
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

    const { loading, error, data } = useQuery(TOPICS_QUERY);

    const [ setTopicState ]        = useMutation(TOPICS_SET_STATE);
    const [ setTopicResubmitDate ] = useMutation(TOPICS_SET_RESUBMITION);

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

    const clickDoing = (topicId) => {
        console.log(topicId);
        setStateInDB(topicId, 2);
    };
    
    const clickClosed = (topicId) => {
        console.log(topicId);
        setStateInDB(topicId, 4);
    };
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
  
    return data.topics.map((topic) =>
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

};

export default TopicsList;