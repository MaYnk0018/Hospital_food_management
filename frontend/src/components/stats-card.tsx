import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatsCardProps } from "../types/random";

export const StatsCard = ({ title, value, className }: StatsCardProps) => (
  <Card className={className}>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);