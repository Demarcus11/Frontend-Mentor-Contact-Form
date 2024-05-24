const form = document.querySelector("[data-contact-form]");
const consentInput = document.querySelector("[data-consent-input]");
const emailInput = document.querySelector("[data-email-input]");
const errorsDOM = document.querySelectorAll(".error");
const generalEnquiryDOM = document.querySelector("[data-query-general-enquiry]");
const supportRequestDOM = document.querySelector("[data-query-support-request]");

const ERROR_MESSAGES = {
  required: "This field is required",
  emailInvalid: "Please enter a valid email address",
  consent: "To submit this form, please consent to being contacted",
  queryType: "Please select a query type",
};

const sendAlert = (title, message) => {
  const wrapper = document.createElement("div");
  const alertId = `alert-${Date.now()}`;

  wrapper.innerHTML = `
    <div class="alert" role="alert" id="${alertId}">
      <div class="flex-group">
        <img src='./assets/images/icon-success-check.svg' />
        <p>${title}</p>
      </div>
      <p>${message}</p>
    </div>`;

  document.body.append(wrapper);

  requestAnimationFrame(() => {
    wrapper.querySelector(".alert").classList.add("show");
  });

  setTimeout(() => {
    const alert = document.getElementById(alertId);
    if (alert) {
      alert.classList.remove("show");
      setTimeout(() => alert.remove(), 3000);
    }
  }, 3000);
};

const showError = (input, message) => {
  input.classList.add("input-error");
  const errorElement = input.closest(".label-input-group").parentElement.querySelector(".error");
  errorElement.textContent = message;
};

const resetErrors = () => {
  errorsDOM.forEach((error) => {
    error.textContent = "";
  });
  document.querySelectorAll(".input-error").forEach((input) => {
    input.classList.remove("input-error");
  });
};

const validateForm = (formData) => {
  let hasErrors = false;

  formData.forEach((value, name) => {
    const input = form.querySelector(`[name="${name}"]`);
    if (!value) {
      showError(input, ERROR_MESSAGES.required);
      hasErrors = true;
    } else if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      showError(input, ERROR_MESSAGES.emailInvalid);
      hasErrors = true;
    }
  });

  if (!generalEnquiryDOM.checked && !supportRequestDOM.checked) {
    const errorElement = generalEnquiryDOM.closest(".label-input-group").querySelector(".error");
    errorElement.textContent = "Please select a query type";
    hasErrors = true;
  }

  if (!consentInput.checked) {
    const errorElement = consentInput.parentElement.parentElement.querySelector(".error");
    errorElement.textContent = `${ERROR_MESSAGES.consent}`;
    hasErrors = true;
  }

  return hasErrors;
};

// Event Listeners
form.addEventListener("submit", async function (e) {
  e.preventDefault();
  resetErrors();

  const formData = new FormData(this);
  if (validateForm(formData)) return;

  const formDataObj = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formDataObj),
    });

    if (!response.ok) {
      const error = await response.json();
      console.log(error);
      return;
    }

    sendAlert("Message Sent!", "Thanks for completing the form. We'll be in touch soon!");
    form.reset();
  } catch (error) {
    console.log(error);
  }
});
