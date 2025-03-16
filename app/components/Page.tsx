import React from "react";

const Page = ({
  children,
  title,
  className,
}: {
  children: React.ReactNode;
  title: string;
  className?: string;
}) => {
  return (
    <div className={`container mx-auto px-4 py-6 ${className}`}>
      <div className="bg-white border-4 rounded-2xl overflow-hidden p-8">
        <h1 className="text-2xl font-bold">{title}</h1>
        {children}
      </div>
    </div>
  );
};

export default Page;
