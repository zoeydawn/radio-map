export default function PageWrapper({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="pt-20 bg-base-200">{children}</div>
}
