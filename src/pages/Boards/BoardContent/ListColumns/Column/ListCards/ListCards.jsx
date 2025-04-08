import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Card from "./Card/Card";

function ListCards({ cards }) {
  // console.log('cards',cards);
  
  return (
    <SortableContext
      items={cards?.map((card) => card._id)}
      strategy={verticalListSortingStrategy}
    >
      <div className="max-h-[calc(100vh-15rem)] list-card space-y-2 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-500 dark:[&::-webkit-scrollbar-thumb]:bg-secondary">
        {cards.map((card) => (
          <Card key={card?.id} card={card} />
        ))}
      </div>
    </SortableContext>
  );
}

export default ListCards;
