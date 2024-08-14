import React from "react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Reservation = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState(""); // Initialize as an empty string
  const navigate = useNavigate();

  const handleReservation = async (e) => {
    e.preventDefault();

    const currentDate = new Date();
    const selectedDate = new Date(date);
    const selectedTime = new Date(`${date}T${time}`);

    // Ensure the selected date is today or in the future
    if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
      toast.error("Reservation date must be today or a future date.");
      return;
    }

    // Ensure the time is between 8 AM and 11 PM
    const minTime = new Date(`${date}T08:00`);
    const maxTime = new Date(`${date}T23:00`);
    if (selectedTime < minTime || selectedTime > maxTime) {
      toast.error("Reservation time must be between 8 AM and 11 PM.");
      return;
    }

    // If booking for today, ensure the time is after the current time
    if (selectedDate.toDateString() === currentDate.toDateString()) {
      if (selectedTime <= currentDate) {
        toast.error("Reservation time must be after the current time.");
        return;
      }
    }

    try {
      const { data } = await axios.post(
        "https://fooders-restaurant-backend.onrender.com/api/v1/reservation/send",
        { firstName, lastName, email, phone, date, time },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setFirstName("");
      setLastName("");
      setPhone(""); // Clear the phone state
      setEmail("");
      setTime("");
      setDate("");
      navigate("/success");
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Reservation error:", error.response.data.message);
    }
  };

  return (
    <section className="reservation" id="reservation">
      <div className="container">
        <div className="banner">
          <img src="/reservation.png" alt="res" />
        </div>
        <div className="banner">
          <div className="reservation_form_box">
            <h1>MAKE A RESERVATION</h1>
            <p>For Further Questions, Please Call</p>
            <form onSubmit={handleReservation}>
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="date"
                  name="date"
                  placeholder="Date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]} // Disable past dates
                />
                <input
                  type="time"
                  name="time"
                  placeholder="Time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="email_tag"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <button type="submit">
                RESERVE NOW{" "}
                <span>
                  <HiOutlineArrowNarrowRight />
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reservation;
