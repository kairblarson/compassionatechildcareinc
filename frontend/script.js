document.addEventListener("DOMContentLoaded", function () {
    if (typeof emailjs !== "undefined") {
        emailjs.init("NYvDJKGdgtqkhI9fY");
    }

    const form =
        document.getElementById("careForm") ||
        document.getElementById("applyForm");

    const loader = document.getElementById("loader");
    const toast = document.getElementById("toast");
    const submitBtn = document.getElementById("submit-btn");

    if (!form) return;

    const isCareForm = form.id === "careForm";
    const isApplyForm = form.id === "applyForm";

    /* ---------------- UI ---------------- */
    function showLoader() {
        loader?.classList.remove("hidden");
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
    }

    function hideLoader() {
        loader?.classList.add("hidden");
        submitBtn.disabled = false;
        submitBtn.textContent = isCareForm
            ? "Submit Request"
            : "Submit Application";
    }

    function showToast(message, isError = false) {
        if (!toast) return;

        toast.textContent = message;
        toast.classList.remove("hidden", "error");
        toast.classList.add("show");

        if (isError) toast.classList.add("error");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 4000);
    }

    /* ---------------- VALIDATION ---------------- */
    function showError(input, message) {
        let error;

        // Try to find existing error message
        const group = input.closest(".form-group");

        if (group) {
            error = group.querySelector(".error-message");
        }

        // If no .form-group, create error dynamically
        if (!error) {
            error = document.createElement("small");
            error.className = "error-message";

            input.parentNode.appendChild(error);
        }

        error.textContent = message;
        input.classList.add("error");
    }

    function clearErrors() {
        document.querySelectorAll(".error-message").forEach((el) => {
            el.textContent = "";
        });

        document.querySelectorAll(".error").forEach((el) => {
            el.classList.remove("error");
        });
    }

    function validateForm() {
        let isValid = true;
        clearErrors();

        const inputs = form.querySelectorAll("input, textarea, select");

        inputs.forEach((input) => {
            const name = input.name;
            const value = input.value?.trim();

            // Skip optional field on apply form
            if (isApplyForm && name === "notes") return;

            // Apply form = EVERYTHING required (except notes)
            if (isApplyForm) {
                if (!value) {
                    showError(input, "This field is required");
                    isValid = false;
                    return;
                }
            }

            // Care form = only fields marked required
            if (isCareForm && input.hasAttribute("required")) {
                if (!value) {
                    showError(input, "This field is required");
                    isValid = false;
                    return;
                }
            }

            // EMAIL
            if (name === "email" && value) {
                const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                if (!valid) {
                    showError(input, "Enter a valid email");
                    isValid = false;
                }
            }

            // PHONE
            if (name === "phone" && value) {
                const valid = /^[0-9\-\+\(\)\s]{7,}$/.test(value);
                if (!valid) {
                    showError(input, "Enter a valid phone number");
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    /* ---------------- CLEAR ERRORS ON INPUT ---------------- */
    form.querySelectorAll("input, textarea, select").forEach((input) => {
        input.addEventListener("input", () => {
            input.classList.remove("error");

            const group = input.closest(".form-group");
            if (group) {
                const error = group.querySelector(".error-message");
                if (error) error.textContent = "";
            }
        });
    });

    /* ---------------- SUBMIT ---------------- */
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        if (!validateForm()) {
            showToast("Please complete all required fields", true);
            return;
        }

        showLoader();

        let templateParams = {};

        if (isCareForm) {
            templateParams = {
                parent_name: form.parent_name?.value || "",
                phone: form.phone?.value || "",
                email: form.email?.value || "",
                zip: form.zip?.value || "",

                num_children: form.num_children?.value || "",
                ages: form.ages?.value || "",
                child_details: form.child_details?.value || "",

                care_type: form.care_type?.value || "",
                schedule: form.schedule?.value || "",
                start_date: form.start_date?.value || "",
                hours: form.hours?.value || "",

                expectations: form.expectations?.value || "",
                responsibilities: form.responsibilities?.value || "",
                traits: form.traits?.value || "",
                communication: form.communication?.value || "",
                comfort: form.comfort?.value || "",

                budget: form.budget?.value || "",
                flexible: form.flexible?.value || "",

                experience: form.experience?.value || "",
                referral: form.referral?.value || "",
                success: form.success?.value || "",
                notes: form.notes?.value || "",
            };
        } else {
            templateParams = {
                full_name: form.full_name?.value || "",
                phone: form.phone?.value || "",
                email: form.email?.value || "",
                location: form.location?.value || "",

                years_experience: form.years_experience?.value || "",
                age_groups: form.age_groups?.value || "",
                background: form.background?.value || "",
                style: form.style?.value || "",
                enjoyment: form.enjoyment?.value || "",
                behavior: form.behavior?.value || "",

                tasks: form.tasks?.value || "",
                limitations: form.limitations?.value || "",

                availability: form.availability?.value || "",
                work_type: form.work_type?.value || "",
                last_minute: form.last_minute?.value || "",
                transport: form.transport?.value || "",
                travel: form.travel?.value || "",

                cpr: form.cpr?.value || "",
                background_check: form.background_check?.value || "",
                references: form.references?.value || "",

                communication: form.communication?.value || "",
                relationship: form.relationship?.value || "",
                rate: form.rate?.value || "",
                fit: form.fit?.value || "",
                notes: form.notes?.value || "",
            };
        }

        emailjs
            .send("service_onghhm7", "template_v1lzkwq", templateParams)
            .then(() => {
                hideLoader();
                showToast(
                    isCareForm
                        ? "Request sent successfully! 🎉"
                        : "Application submitted successfully! 🎉"
                );
                form.reset();
            })
            .catch((error) => {
                console.error(error);
                hideLoader();
                showToast("Failed to send. Please try again.", true);
            });
    });
});

/* ---------------- SMOOTH SCROLL ---------------- */
document.querySelectorAll('a[href*="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href").split("#")[1];
        if (!targetId) return;

        const target = document.getElementById(targetId);

        if (
            (target && window.location.pathname.includes("index.html")) ||
            window.location.pathname === "/"
        ) {
            e.preventDefault();

            const offset = 90;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });

            const menu = document.getElementById("mobile-menu");
            if (menu) menu.classList.remove("active");
        }
    });
});
