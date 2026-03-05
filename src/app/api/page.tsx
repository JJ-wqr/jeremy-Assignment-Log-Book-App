import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Assignment LogBook API",
  description: "YourName Assignment LogBook — REST API",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}