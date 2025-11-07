document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contact-form");

  if (!contactForm) return;

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !subject || !message) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/contactSubmission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        contactForm.reset();
      } else {
        alert(data.message || "Failed to send message");
      }
    } catch (err) {
      console.error("Error sending contact form:", err);
      alert("Something went wrong. Please try again later.");
    }
  });
});
