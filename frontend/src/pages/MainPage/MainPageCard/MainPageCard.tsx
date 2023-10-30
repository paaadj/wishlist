import "./mainPageCard.css";

interface IMainPageCard {
  children: React.ReactNode;
}

function MainPageCard(props: IMainPageCard) {
  const { children } = props;
  return <div className="card-container">{children}</div>;
}

export default MainPageCard;
