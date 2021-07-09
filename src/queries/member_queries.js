import { gql } from '@apollo/client';

export const MEMBER_NAMES_QUERY = gql`
    query getAllMembers {
        members {
            id
            combined_name
        }
    }
`;