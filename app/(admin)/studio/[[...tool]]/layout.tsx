// export const metadata = {
//   title: "Sanity Studio",
//   description: "Content management for Real Estate Platform",
// };

// export default function StudioLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body style={{ margin: 0 }}>{children}</body>
//     </html>
//   );
// }


export const metadata = {
  title: "Sanity Studio",
  description: "Directorio Oasis",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Reemplazamos html y body por un contenedor simple o un Fragment (<>)
    // Mantenemos el reset de márgenes usando un div para que Sanity ocupe toda la pantalla
    <div style={{ margin: 0, minHeight: "100vh" }}>
      {children}
    </div>
  );
}