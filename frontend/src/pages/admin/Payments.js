import React, { useState } from "react";

function Payments() {

  const [search, setSearch] = useState("");

  const payments = [
    { id: 1, name: "Rahul Sharma", plan: "Monthly", amount: 1500, status: "Paid" },
    { id: 2, name: "Amit Patel", plan: "Quarterly", amount: 4000, status: "Paid" },
    { id: 3, name: "Priya Singh", plan: "Monthly", amount: 1500, status: "Pending" }
  ];

  const filteredPayments = payments.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = payments
    .filter((p) => p.status === "Paid")
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="payments-container">

      <h2> Membership Payments</h2>
      <div className="payment-cards">
        <div className="card revenue">
          <h3>Total Revenue</h3>
          <p>₹{totalRevenue}</p>
        </div>
        <div className="card members">
          <h3>Total Members</h3>
          <p>{payments.length}</p>
        </div>
        <div className="card pending">
          <h3>Pending Payments</h3>
          <p>{payments.filter((p)=>p.status==="Pending").length}</p>
        </div>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search Member Payment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="payment-table-header">
        <div className="col name">Member Name</div>
        <div className="col plan">Plan</div>
        <div className="col amount">Amount</div>
        <div className="col status">Status</div>
      </div>

      <div className="payment-list">
        {filteredPayments.map((pay) => (
          <div key={pay.id} className="payment-item">
            <div className="col name">{pay.name}</div>
            <div className="col plan">{pay.plan}</div>
            <div className="col amount">₹{pay.amount}</div>
            <div className={`col status ${pay.status === "Paid" ? "paid" : "pending"}`}>
              {pay.status}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Payments;