interface Board {
    _id: string;
    title: string;
    description: string;
    visibility: 'Public' | 'Private';
    created_at: string;
    updated_at: string;
}

export type { Board };
