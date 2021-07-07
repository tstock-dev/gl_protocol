import React from "react";

const TopicHistoryList = ({loading, error, topicsHistoryData}) => {

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    if (topicsHistoryData === null) {
        return <>loading...</>
    } else {
        //console.log(data.topics)
        return topicsHistoryData.topic_history.map((topic) =>
            <React.Fragment key={topic.id}>
                <div className="agenda-history-date">{topic.protocol_date.substring(8,10) + "." +
                                                      topic.protocol_date.substring(5,7) + "." + 
                                                      topic.protocol_date.substring(0,4)}</div>
                <div className="agenda-history-note">{topic.note}</div>
                {topic.assigned_to_member
                    ?   <div className="agenda-history-responsible">{topic.assigned_to_member.combined_name}</div>
                    :   <div className="agenda-history-responsible"></div>
                }
            </React.Fragment>
        );
    }

};

export default TopicHistoryList;