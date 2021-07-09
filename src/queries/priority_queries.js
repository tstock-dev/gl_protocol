import { gql } from '@apollo/client';

export const PRIORITIES_QUERY = gql`
    query getAllPriorities {
        priorities {
            id
            description
        }
    }
`;