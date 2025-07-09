import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const phoneNumber = "919835742586";
  const message = "Hi! I'm interested in learning more about Growsence courses.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-pulse"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
