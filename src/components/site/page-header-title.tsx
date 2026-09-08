import React from "react"

type PageHeaderTitle = {
  title: string
  description: string
}

const PageHeaderTitle: React.FC<PageHeaderTitle> = ({ title, description }) => {
  return (
    <>
      <div className="full-bleed-border-b border-edge border-b-[1px] px-2 py-2">
        <h1 className="font-pixelify text-primary/90 text-base font-bold sm:text-xl md:text-2xl">
          {title}
        </h1>
      </div>
      <div className="full-bleed-border-b border-edge border-b-[1px] px-2 py-2">
        <p className="text-primary/90 font-mono text-xs sm:text-sm">
          {description}
        </p>
      </div>
    </>
  )
}

export { PageHeaderTitle }
