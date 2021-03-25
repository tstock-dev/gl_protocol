import React from "react";

const CreateAgenda = () => {
  const Separator = (
    <>
      <div className="agenda-separator" />
      <div className="agenda-separator" />
      <div className="agenda-separator" />
      <div className="agenda-separator" />
      <div className="agenda-separator" />
    </>
  );

  return (
    <>
      <div className="firstLineOfGrid-col1"></div>
      <div className="firstLineOfGrid-col2"></div>
      <div className="page-header-col1"></div>
      <div className="page-header">
        <h2>Agenda erstellen</h2>
      </div>
    </>
  );
};

export default CreateAgenda;
