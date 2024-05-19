const form = document.querySelector("[data-contact-form]");
const consentInput = document.querySelector("[data-consent-input]");
const emailInput = document.querySelector("[data-email-input]");
const errorsDOM = document.querySelectorAll(".error");
const generalEnquiryDOM = document.querySelector("[data-query-general-enquiry]");
const supportRequestDOM = document.querySelector("[data-query-support-request]");

// Event Listeners
form.addEventListener("submit", async function (e) {
  e.preventDefault();
  let hasErrors = false;

  // Reset error messages
  errorsDOM.forEach((error) => {
    error.textContent = "";
  });

  // Reset input errors
  const inputErrors = document.querySelectorAll(".input-error");
  inputErrors.forEach((input) => {
    input.classList.remove("input-error");
  });

  const formData = new FormData(this);

  // loop through all form name-value pairs
  for (let [name, value] of formData.entries()) {
    const input = this.querySelector(`[name="${name}"]`);

    if (!value) {
      if (input.name === "first-name" || input.name === "last-name" || input.name === "message") {
        // search up DOM tree for closest parent then search down DOM tree for error p tag
        input.classList.add("input-error");
        const errorElement = input
          .closest(".label-input-group")
          .parentElement.querySelector(".error");
        errorElement.textContent = "This field is required";
      }
      if (input.name === "email") {
        input.classList.add("input-error");
        const errorElement = input
          .closest(".label-input-group")
          .parentElement.querySelector(".error");
        errorElement.textContent = "Please enter a valid email address";
      }
      hasErrors = true;
    }
  }

  if (!generalEnquiryDOM.checked && !supportRequestDOM.checked) {
    const errorElement = generalEnquiryDOM.closest(".label-input-group").querySelector(".error");
    errorElement.textContent = "Please select a query type";
    hasErrors = true;
  }

  const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (!validEmailRegex.test(emailInput.value)) {
    emailInput.classList.add("input-error");
    const errorElement = emailInput
      .closest(".label-input-group")
      .parentElement.querySelector(".error");
    errorElement.textContent = "Please enter a valid email address";
    hasErrors = true;
  }

  if (!consentInput.checked) {
    const errorElement = consentInput.parentElement.parentElement.querySelector(".error");
    errorElement.textContent = "To submit this form, please consent to being contacted";
    hasErrors = true;
  }

  if (hasErrors) return;

  const formDataObj = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formDataObj),
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
});
