import home from "~/assets/home.svg"

const HomeSection = () => {
  return (
    <div className="mx-4 my-8 border rounded-lg text-primary">
      <img className="w-full" src={home} alt="" />
      <h1 className="text-lg font-semibold text-center my-3">Organize - Track - Collaborate.</h1>
      <p className="text-sm text-center mx-2 mb-3">Invite people to boards and cards, leave comments, add due dates, and we will show the most important activity here.</p>
    </div>
  );
};

export default HomeSection;
