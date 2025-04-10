import React from 'react';
import '../../styles/components/AbstractSubmissionForm/Infocard.scss'

interface InfoCardProps {
  title: string;
  data: Record<string, any> | Array<Record<string, any>>;
  fields: Array<{ label: string; key: string }>;
  backgroundColor?: string;
  borderColor?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, data, fields, backgroundColor, borderColor }) => {
  return (
    <div
      className={`card mt-4 ${backgroundColor || ''}`} 
    >
      <div className="card-body text-start">
        <h5 className="card-title">{title}</h5>
        {Array.isArray(data) ? (
          data.map((item, index) => (
            <div key={index}>
              {fields.map((field) => (
                <p key={field.key} className="info-card-paragraph">
                  <strong>{field.label}:</strong> {item[field.key]}
                </p>
              ))}
              {index < data.length - 1 && <hr className="custom-separator" />}
            </div>
          ))
        ) : (
          fields.map((field) => (
            <p key={field.key} className="info-card-paragraph">
              <strong>{field.label}:</strong> {data[field.key]}
            </p>
          ))
        )}
      </div>
    </div>
  );
};

export default InfoCard;