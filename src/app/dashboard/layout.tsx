import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Survey Dashboard — CSC Field Survey",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
