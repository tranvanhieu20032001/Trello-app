import React from "react";

const LabelsCard = ({ card }) => {
  const labels = card?.labels;
  return (
    <>
      {labels.length > 0 ? (
        <div className="flex items-center gap-2 mt-2 mx-2">
          {labels.map((label) => (
            <div
              key={label?.label?.id}
              className="p-0.5 min-w-12 rounded-md text-xs font-medium flex items-center justify-center"
              style={{ backgroundColor: label?.label?.color }}
            >
              {label?.label?.name}
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
};

export default LabelsCard;
