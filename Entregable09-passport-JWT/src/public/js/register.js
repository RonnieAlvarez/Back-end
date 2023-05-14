const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));
    try {
        const response = await fetch("/api/sessions/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(obj),
        });
        if (response.ok) {
            console.log("Registed: " + data);

            window.location.replace("/users/login");
        } else {
            throw new Error("Unable to log in");
        }
    } catch (error) {
        console.error(error);
    }
    console.log(response.ok);
});
