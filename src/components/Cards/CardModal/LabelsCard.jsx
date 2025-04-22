import React from "react";

const LabelsCard = ({ card }) => {
  const labels = card?.labels;
  return (
    <>
      {labels.length > 0 ? (
        <div>
          <span>Label</span>
          <div className="flex items-center gap-2 mt-2">
            {labels.map((label) => (
              <div
                key={label?.label?.id}
                className="px-3 py-1.5 min-w-16 min-h-7 rounded-md text-xs font-medium flex items-center justify-center"
                style={{ backgroundColor: label?.label?.color }}
              >
                {label?.label?.name}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default LabelsCard;
