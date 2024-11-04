import { ImageDown } from 'lucide-react';
import React, { useState } from 'react';
import ReactFlow, { MiniMap, Controls, Background, Node, Edge } from 'react-flow-renderer';

type NodeData = {
    id: string;
    data: {
        label: string;
        type: 'PK' | 'FK' | 'Normal' | 'String' | 'Number' | 'Code' | 'Char' | 'Decimal' | 'UUID';
    };
    position: {
        x: number;
        y: number;
    };
};

type EdgeData = {
    id: string;
    source: string;
    target: string;
};

type InteractiveERDProps = {
    nodes?: NodeData[];
    edges?: EdgeData[];
    onNodeDragStop?: (nodeId: string, position: { x: number; y: number }) => void;
    onEdgeChange?: (edgeId: string, newSource: string, newTarget: string) => void;
};

const InteractiveERD: React.FC<InteractiveERDProps> = ({ nodes = [], edges = [], onNodeDragStop, onEdgeChange }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleNodeDragStop = (event: React.MouseEvent, node: Node) => {
        if (onNodeDragStop) {
            onNodeDragStop(node.id, node.position);
        }
    };

    const handleEdgeDoubleClick = (event: React.MouseEvent, edge: Edge) => {
        const newSource = prompt("Masukkan ID node sumber:");
        const newTarget = prompt("Masukkan ID node target:");
        if (newSource && newTarget) {
            onEdgeChange?.(edge.id, newSource, newTarget);
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const downloadDrawIO = () => {
        const xmlContent = convertToDrawIOFormat(nodes, edges);
        const blob = new Blob([xmlContent], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'diagram.drawio';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setMenuOpen(false);
    };

    const downloadAsImage = () => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.toBlob(blob => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'diagram-image.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                } else {
                    console.error("Blob tidak valid untuk unduhan.");
                }
            });
        }
        setMenuOpen(false);
    };

    const convertToDrawIOFormat = (nodes: NodeData[], edges: EdgeData[]) => {
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
        <mxfile host="app.diagrams.net">
            <diagram name="Page-1" id="sample-diagram-id">
                <mxGraphModel dx="787" dy="522" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">
                    <root>
                        <mxCell id="0" style="rounded=0;whiteSpace=wrap;html=1;" />
                        <mxCell id="1" parent="0" />`;

        nodes.forEach(node => {
            const style = node.data.type === 'PK' ? 'shape=box;fillColor=#FFD700;' :
                node.data.type === 'FK' ? 'shape=ellipse;fillColor=#ADD8E6;' :
                    'shape=rounded;fillColor=#FFFFFF;';
            xml += `
                <mxCell id="${node.id}" value="${node.data.label}" style="${style}whiteSpace=wrap;html=1;" vertex="1" parent="1">
                    <mxGeometry x="${node.position.x}" y="${node.position.y}" width="100" height="40" as="geometry" />
                </mxCell>`;
        });

        edges.forEach(edge => {
            xml += `
                <mxCell id="${edge.id}" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonal=1;exitX=0.5;exitY=0.5;entryX=0.5;entryY=0.5;" edge="1" parent="1" source="${edge.source}" target="${edge.target}">
                    <mxGeometry relative="1" as="geometry" />
                </mxCell>`;
        });

        xml += `
                    </root>
                </mxGraphModel>
            </diagram>
        </mxfile>`;

        return xml;
    };

    return (
        <div className="relative">
            <div className="absolute right-1 top-[-6] z-10">
                <button
                    onClick={toggleMenu}
                    className="dark:text-slate-100 text-gray-900 dark:bg-slate-800/5 bg-white p-4 rounded-full"
                >
                    <ImageDown />
                </button>
                {menuOpen && (
                    <div className="absolute right-2 mt-2 w-48 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 shadow-md rounded-md">
                        <button
                            onClick={downloadDrawIO}
                            className="w-full px-4 py-2 text-left text-gray-700 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-600"
                        >
                            Unduh sebagai Draw.io
                        </button>
                        <button
                            onClick={downloadAsImage}
                            className="w-full px-4 py-2 text-left text-gray-700 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-600"
                        >
                            Unduh sebagai PNG
                        </button>
                    </div>
                )}
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodeDragStop={handleNodeDragStop}
                onEdgeDoubleClick={handleEdgeDoubleClick}
                style={{ width: '100%', height: '400px' }}
            >
                <MiniMap />
                <Controls />
                <Background />
            </ReactFlow>
        </div>
    );
};

export default InteractiveERD;
