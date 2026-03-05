import type { Card } from "../../lib/types/board";
import Button from "./button";
import { Plus } from "lucide-react";

interface Props {
    title: string;
    cards: Card[];
    operation: () => void;
}

function List({ title, cards, operation }: Props) {
    return (
        <div className="flex flex-col gap-2 min-h-fit  max-h-96 w-96 bg-purple-200 rounded-xl p-4 flex-shrink-0">
            <div className="flex justify-between items-center">
                <h2>{title}</h2>
                <Button onClick={operation}>
                    <Plus />
                </Button>
            </div>
            <section className="flex flex-col gap-2 bg-purple-100 p-2 rounded-xl" >
                {cards.length === 0 ? (
                    <p className="text-sm text-center">
                        No cards, start by creating a card
                    </p>
                ) : cards.map((card: Card) => {
                    return (
                        <div key={card._id}>
                            <h3>{card.title}</h3>
                            <p>{card.description}</p>
                        </div>
                    );
                })}
            </section>
        </div>
    );
}

export default List;