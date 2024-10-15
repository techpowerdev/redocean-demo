import axios from "axios";

// export async function GET() {
//   return Response.json({
//     message: `GET method called`,
//   });
// }

export async function POST(req: Request) {
  const { userId, message } = await req.json();

  if (!userId || !message) {
    return Response.json({ error: "User ID and message are required." });
  }

  try {
    const response = await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: userId,
        messages: [
          {
            type: "text",
            text: message,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
        },
      }
    );

    return Response.json({ message: "Message sent", data: response.data });
  } catch (error) {
    console.error("Error pushing message to LINE:", error);
    return Response.json({ error: "Failed to push message" });
  }
}

// export async function PUT() {
//   return Response.json({
//     message: `PUT method called`,
//   });
// }

// export async function DELETE() {
//   return Response.json({
//     message: `DELETE method called`,
//   });
// }
