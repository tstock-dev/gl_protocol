import { gql } from '@apollo/client';

export const TOPICS_QUERY = gql`
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

export const TOPICS_SET_STATE = gql`
    mutation updateTopicState($id: ID!, $stateId: Int!) {
        updateTopicState(id: $id, state_id: $stateId) {
            id
            state_id
        } 
    }
`;

export const TOPICS_SET_RESUBMITION = gql`
    mutation updateTopicResubmitDate($id: ID!, $resubmit_date: Date!) {
        updateTopicResubmitDate(id: $id, resubmit_date: $resubmit_date) {
            id
            resubmit_date
        } 
    }
`;

export const GET_TOPIC_HISTORY = gql`
    query GetTopicHistory($topicId: Int!) {
        topic_history(topicId: $topicId) {
            id
            topic_id
            protocol_id
            protocol_date
            assigned_to_member {
                combined_name
            }
            note
        }
    }
`;