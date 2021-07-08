import React, { useState } from "react";
import TopicsList from "../common/topics_list";
import TopicHistoryList from "../common/topic_history_list";
import { registerLocale } from "react-datepicker";
import { gql, useQuery } from '@apollo/client';
import {AGENDA_SEPARATOR, AGENDA_HISTORY_SEPARATOR} from "../constants";
import de from "date-fns/locale/de";

import "react-datepicker/dist/react-datepicker.css";

registerLocale("de", de);

const GET_TOPIC_HISTORY = gql`
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

const AllTopics = () => {

  const [ topicHistoryId, setTopicHistoryId ] = useState(-1);

  const { loading, error, data } = useQuery(GET_TOPIC_HISTORY, {
    variables: { topicId: topicHistoryId },
  });

  const handleRowClick = (topicId) => {
    setTopicHistoryId(1 * topicId);
  }

  return (
    <>
      <div className="page-header-seperator-col1"></div>
      <div className="page-header-seperator-col2"></div>
      <div className="page-header-seperator-col3"></div>
      <div className="page-header">
        <h2>Alle Agenda-Punkte</h2>
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

        <TopicsList useAuthtoken={false} onlyOpen={false} onRowClick={handleRowClick} />
      </div>
      
      <div className="page-header-seperator-col2"></div>

      <div className="page-content-right">
        <div className="table agenda-history-table">
          <div className="date agenda-history-header centered">Historie</div>
          {data && data.topic_history.length > 0
            ? <>
                <div className="date agenda-history-header">Datum</div>
                <div className="note agenda-history-header">Notiz</div>
                <div className="responsible agenda-history-header">Verantwortliche</div>

                {AGENDA_HISTORY_SEPARATOR}
              </>
            : null
          }
        </div>
        {data && data.topic_history.length > 0
          ? <ul className="agenda-history-list">
              <TopicHistoryList loading={loading} error={error} topicsHistoryData={data} />
            </ul>
          : null
        }
      </div>
      <div className="page-header-seperator-col2"></div>
      
    </>
  );
};

export default AllTopics;
