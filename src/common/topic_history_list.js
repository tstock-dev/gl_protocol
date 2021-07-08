import React from "react";

const TopicHistoryList = ({loading, error, topicsHistoryData}) => {

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    if (topicsHistoryData === null) {
        return <>loading...</>
    } else {
        return topicsHistoryData.topic_history.map((topic, index) =>
            <li className="agenda-history-item" key={topic.id}>
                <div className={"agenda-history-date" + (index > 0 ? " agenda-history-line" : "")}>
                    {topic.protocol_date.substring(8,10) + "." +
                    topic.protocol_date.substring(5,7) + "." + 
                    topic.protocol_date.substring(0,4)}</div>
                <div className={"agenda-history-note" + (index > 0 ? " agenda-history-line" : "")}>
                    {topic.note}
                </div>
                <div className={"agenda-history-responsible" + (index > 0 ? " agenda-history-line" : "")}>
                    {topic.assigned_to_member
                        ?   topic.assigned_to_member.combined_name
                        :   null
                    }
                </div>
            </li>
        );
    }

};

export default TopicHistoryList;