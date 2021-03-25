import React from "react";

const AllTopics = () => {

    return (
        <>
            <div className="firstLineOfGrid-col1"></div>
            <div className="firstLineOfGrid-col2"></div>
            <div className="page-header-col1"></div>
            <div className="page-header">
                <h2>Alle Agenda-Punkte</h2>
            </div>

            <div className="table-col1"></div>
            <div className="table agenda-table">
                <div className="resubmission agenda-header">WV-Termin</div>
                <div className="agenda-topic agenda-header">Inhalt</div>
                <div className="responsible agenda-header">Verantwortliche</div>
                <div className="doing agenda-header center">Doing</div>
                <div className="done agenda-header center">Done</div>
                <div className="agenda-separator"/><div className="agenda-separator"/><div className="agenda-separator"/><div className="agenda-separator"/><div className="agenda-separator"/>

                <div class="input-group date resubmission agenda-item agenda-date">
                    <input type="text" class="form-control" /><span class="input-group-addon"><i class="glyphicon glyphicon-th"></i></span>
                </div>
                $('#sandbox-container .input-group.date').datepicker({
        format: "dd.mm.yyyy",
        weekStart: 1,
        todayBtn: true,
        language: "de"
    });
                <div className="resubmission agenda-item">Achja nochmal Februar Eintrag zum Testen der gefixten Tabellenüberschriften</div>
                <div className="resubmission agenda-item">Claudia Flör</div>
                <button className="resubmission agenda-button checked"></button>
                <button className="resubmission agenda-button"></button>
            </div>
        </>
    );
};

export default AllTopics;
