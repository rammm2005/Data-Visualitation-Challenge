import React from 'react';

type CustomNodeProps = {
    id: string;
    label: string;
    fields: { name: string; type: string; isPK?: boolean; isFK?: boolean }[];
};

const CustomNode: React.FC<CustomNodeProps> = ({ label, fields }) => {
    return (
        <div className="p-2 bg-white rounded shadow border">
            <h3 className="font-bold">{label}</h3>
            <table className="min-w-full mt-2 border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-2 py-1">Field</th>
                        <th className="border px-2 py-1">Type</th>
                    </tr>
                </thead>
                <tbody>
                    {fields.map((field, index) => (
                        <tr key={index}>
                            <td className="border px-2 py-1">{field.name} {field.isPK && '(PK)'} {field.isFK && '(FK)'}</td>
                            <td className="border px-2 py-1">{field.type}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CustomNode;
