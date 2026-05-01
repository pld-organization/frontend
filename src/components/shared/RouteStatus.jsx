function RouteStatus({ title, message }) {
  return (
    <div className="route-status-page">
      <div className="route-status-card">
        <h1>{title}</h1>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default RouteStatus;
