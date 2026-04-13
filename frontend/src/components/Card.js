function Card({ title, value, icon }) {
  return (
    <div className="card stat-card">

      <div className="card-icon">
        {icon}
      </div>

      <div>
        <h3>{value}</h3>
        <p>{title}</p>
      </div>

    </div>
  );
}

export default Card;