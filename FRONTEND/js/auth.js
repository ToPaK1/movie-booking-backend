const API_URL = "http://localhost:3000/api";

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const message = document.getElementById("message");


function showMessage(text, type) {

    message.textContent = text;

    message.className = `auth-message ${type}`;

    message.style.display = "block";
}


// ================= LOGIN =================

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;


        try {

            const response = await fetch(
                `${API_URL}/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message || "Login failed"
                );

            }


            localStorage.setItem(
                "token",
                data.token
            );


            if (data.user) {

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

            }


            showMessage(
                "Login successful! Redirecting...",
                "success"
            );


            setTimeout(() => {

                window.location.href = "index.html";

            }, 1000);


        } catch (error) {

            console.error(error);

            showMessage(
                error.message,
                "error"
            );

        }

    });

}


// ================= SIGNUP =================

if (signupForm) {

    signupForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const password =
            document.getElementById("password").value;


        try {

            const response = await fetch(
                `${API_URL}/auth/signup`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        phone,
                        password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message || "Registration failed"
                );

            }


            showMessage(
                "Account created successfully! Redirecting to login...",
                "success"
            );


            setTimeout(() => {

                window.location.href = "login.html";

            }, 1200);


        } catch (error) {

            console.error(error);

            showMessage(
                error.message,
                "error"
            );

        }

    });

}