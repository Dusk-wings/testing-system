export interface CardInformation {
    _id: string;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface ListInformation {
    _id: string;
    title: string;
    created_at: string;
    updated_at: string;
    cards: CardInformation[];
}

export interface BoardInformation {
    _id: string;
    user_id: string;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
    visiblity: string;
    lists: ListInformation[];
}