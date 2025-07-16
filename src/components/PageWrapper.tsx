export default function PageWrapper({
    children,
  }: Readonly<{
    children: React.ReactNode
  }>) {
    return (
      <div className="pt-20">
        {children}
      </div>
    )
  }
  