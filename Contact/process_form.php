<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = trim($_POST["name"]);
    $email = trim($_POST["email"]);
    $subject = trim($_POST["subject"]);
    $message = trim($_POST["message"]);

    // Set up email
    $to = "richardlechko04@gmail.com"; // Change this to your email address
    $subject = "New message from $name: $subject";
    $body = "Name: $name\nEmail: $email\n\nMessage:\n$message";

    // Send email
    if (mail($to, $subject, $body)) {
        // Email sent successfully
        echo json_encode(array("status" => "success", "message" => "Your message has been sent. We'll get back to you shortly."));
    } else {
        // Email failed to send
        echo json_encode(array("status" => "error", "message" => "Oops! Something went wrong. Please try again later."));
    }
} else {
    // Not a POST request, redirect back to contact page
    header("Location: contact.html");
    exit();
}
