const API_URL = "http://localhost:3000/api";

const signupForm =
    document.getElementById("signupForm");

const message =
    document.getElementById("message");


function showMessage(text, type) {

    message.textContent = text;

    message.className =
        `auth-message ${type}`;

    message.style.display = "block";
}


signupForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const phone =
            document.getElementById("phone").value.trim();


        if (!name || !email || !password) {

            showMessage(
                "Please fill in all required fields.",
                "error"
            );

            return;
        }


        try {

            const response = await fetch(
                `${API_URL}/auth/signup`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name,
                        email,
                        password,
                        phone

                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Signup failed"
                );

            }


            showMessage(
                "Account created successfully! Redirecting to login...",
                "success"
            );


            setTimeout(() => {

                window.location.href =
                    "login.html";

            }, 1500);


        } catch (error) {

            console.error(error);

            showMessage(
                error.message,
                "error"
            );

        }

    }
);