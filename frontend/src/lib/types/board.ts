interface Board {
    _id: string;
    title: string;
    description: string;
    visibility: 'Public' | 'Private';
    created_at: string;
    updated_at: string;
}

interface List {
    _id: string;
    title: string;
    position: number;
    board_id: string;
    created_at: string;
    updated_at: string;
}

interface Card {
    _id: string;
    user_id: string,
    board_id: string,
    title: string,
    description: string,
    deadline: string,
    list_id: string,
    status: 'Todo' | 'In Progress' | 'Completed',
    created_at: string,
    updated_at: string,
    position: number
}

export type { Board, List, Card };
