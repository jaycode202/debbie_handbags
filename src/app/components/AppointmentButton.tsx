"use client";

export default function AppointmentButton() {
  const handleCall = () => {
    window.location.href = "tel:+260 974508241";
  };

  return (
    <div className="fixed bottom-20 right-6 z-50">
      <button
        type="button"
        onClick={handleCall}
        aria-label="Call to book an appointment"
        className="block transition-transform duration-200 hover:scale-110"
      >
        <img
          src="phone2.png"
          alt="Book an appointment"
          className="h-12 w-12 object-contain drop-shadow-lg"
        />
      </button>
    </div>
  );
}
