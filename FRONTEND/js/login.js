const API_URL = "http://localhost:3000/api";

const loginForm =
    document.getElementById("loginForm");

const message =
    document.getElementById("message");


function showMessage(text, type) {

    message.textContent = text;

    message.className =
        `auth-message ${type}`;

    message.style.display = "block";
}


loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const email =
            document
                .getElementById("email")
                .value
                .trim();

        const password =
            document
                .getElementById("password")
                .value;


        if (!email || !password) {

            showMessage(
                "Please enter your email and password.",
                "error"
            );

            return;
        }


        try {

            const response = await fetch(
                `${API_URL}/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        email,
                        password

                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Login failed"
                );

            }


            // =========================
            // SAVE JWT
            // =========================

            localStorage.setItem(
                "token",
                data.token
            );


            // =========================
            // SAVE USER
            // =========================

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            showMessage(
                "Login successful! Redirecting...",
                "success"
            );


            setTimeout(() => {

                window.location.href =
                    "movies.html";

            }, 1000);


        } catch (error) {

            console.error(error);

            showMessage(
                error.message,
                "error"
            );

        }

    }
);