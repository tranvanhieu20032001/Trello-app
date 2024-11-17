import Card from "./Card/Card";

function ListCards({ cards }) {
  return (
    <div
      className="list-card max-h-[calc(100vh-14rem)] space-y-2 overflow-y-auto
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-track]:bg-neutral-500
        dark:[&::-webkit-scrollbar-thumb]:bg-secondary"
    >
      {cards.map((card) => (
        <Card key={card._id} card={card} />
      ))}
    </div>
  );
}

export default ListCards;
