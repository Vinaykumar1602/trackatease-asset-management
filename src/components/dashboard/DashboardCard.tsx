
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function DashboardCard({ title, description, children, footer }: DashboardCardProps) {
  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pb-2">{children}</CardContent>
      {footer && <div className="p-4 pt-0 border-t">{footer}</div>}
    </Card>
  );
}
