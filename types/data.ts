export type NodeDataType = "PK" | "FK" | "Normal" | "String" | "Number" | "Code" | "Char" | "Decimal" | "UUID";


export type DataRow<T extends string = string> = {
    [key in T]: string;
};

export type StoredData = {
    spreadsheetId: string;
    range: string;
};

export type ChartDataProps<T extends string = string> = {
    labels: T[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
        borderColor?: string[];
        borderWidth?: number;
        fill?: boolean;
        tension?: number; cutout?: string;
    }[];
};

export type Node<T extends string = string> = {
    id: T;
    data: {
        label: T;
        type: NodeDataType;
    };
    position: { x: number; y: number };
};

export type Edge<T extends string = string> = {
    id: T;
    source: T;
    target: T;
};

export type ERDData<T extends string = string> = {
    nodes: Node<T>[];
    edges: Edge<T>[];
};


export type Column<T extends string = string> = {
    header: string;
    accessor: keyof DataRow<T>;
};

